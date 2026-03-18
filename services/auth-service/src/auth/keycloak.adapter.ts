import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KeycloakAdapter {
  private readonly logger = new Logger(KeycloakAdapter.name);
  private readonly baseUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor() {
    this.baseUrl = process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080';
    this.realm = process.env.KEYCLOAK_REALM || 'ifarm';
    this.clientId = process.env.KEYCLOAK_CLIENT_ID || 'ifarm-api';
    this.clientSecret = process.env.KEYCLOAK_CLIENT_SECRET || '';
  }

  private get tokenUrl(): string {
    return `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`;
  }

  private get userInfoUrl(): string {
    return `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`;
  }

  private get revokeUrl(): string {
    return `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/revoke`;
  }

  async login(email: string, password: string) {
    try {
      const params = new URLSearchParams({
        grant_type: 'password',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        username: email,
        password: password,
        scope: 'openid profile email',
      });

      const response = await axios.post(this.tokenUrl, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      this.logger.warn(`Login failed for email=${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
      });

      const response = await axios.post(this.tokenUrl, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        token: refreshToken,
        token_type_hint: 'refresh_token',
      });

      await axios.post(this.revokeUrl, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    } catch (error) {
      // Silently handle - token may already be expired
      this.logger.debug('Token revocation failed, token may already be expired');
    }
  }

  async getUserInfo(accessToken: string) {
    try {
      const response = await axios.get(this.userInfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
  }) {
    // Get admin token
    const adminParams = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });
    const adminToken = await axios.post(this.tokenUrl, adminParams.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const adminAccessToken = adminToken.data.access_token;
    const usersUrl = `${this.baseUrl}/admin/realms/${this.realm}/users`;

    // Create user
    const createResponse = await axios.post(
      usersUrl,
      {
        email: userData.email,
        username: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        enabled: true,
        emailVerified: true,
        credentials: [
          {
            type: 'password',
            value: userData.password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // Get user ID from Location header
    const locationHeader = createResponse.headers.location;
    const userId = locationHeader
      ? locationHeader.split('/').pop()
      : null;

    // Assign role
    if (userId) {
      const rolesUrl = `${this.baseUrl}/admin/realms/${this.realm}/roles/${userData.role}`;
      const roleResponse = await axios.get(rolesUrl, {
        headers: { Authorization: `Bearer ${adminAccessToken}` },
      });
      const role = roleResponse.data;

      await axios.post(
        `${usersUrl}/${userId}/role-mappings/realm`,
        [role],
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    return userId;
  }
}
