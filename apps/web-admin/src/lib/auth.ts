import type { NextAuthOptions, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    role?: string;
    sub?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || 'ifarm-web-admin',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
      issuer: process.env.KEYCLOAK_ISSUER || 'http://localhost:8080/realms/ifarm',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }): Promise<JWT> {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;

        const decoded = parseJwt(account.access_token || '');
        const realmRoles = getRealmRoles(decoded);
        token.role = realmRoles.includes('ADMIN') ? 'ADMIN' : 'UNKNOWN';
      }

      if (token.expiresAt && Date.now() >= token.expiresAt * 1000 - 60_000) {
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }): Promise<Session> {
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.id = token.sub || '';
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getRealmRoles(decoded: Record<string, unknown> | null): string[] {
  if (!decoded) return [];
  const realmAccess = decoded.realm_access;
  if (!realmAccess || typeof realmAccess !== 'object' || !('roles' in realmAccess)) {
    return [];
  }
  const roles = (realmAccess as { roles?: unknown }).roles;
  return Array.isArray(roles) ? roles.filter((role): role is string => typeof role === 'string') : [];
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const issuer = process.env.KEYCLOAK_ISSUER || 'http://localhost:8080/realms/ifarm';
    const tokenUrl = `${issuer}/protocol/openid-connect/token`;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID || 'ifarm-web-admin',
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET || '',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken || '',
      }),
    });

    const refreshed = await response.json();

    if (!response.ok) throw refreshed;

    return {
      ...token,
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + refreshed.expires_in,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return { ...token, error: 'RefreshAccessTokenError' } as JWT;
  }
}
