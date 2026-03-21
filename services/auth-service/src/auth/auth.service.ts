import { Injectable, Logger } from '@nestjs/common';
import { KeycloakAdapter } from './keycloak.adapter';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly keycloakAdapter: KeycloakAdapter) {}

  async login(email: string, password: string) {
    this.logger.log(`Login attempt for email=${email}`);
    const tokens = await this.keycloakAdapter.login(email, password);
    this.logger.log(`Login successful for email=${email}`);
    return tokens;
  }

  async refresh(refreshToken: string) {
    this.logger.log('Token refresh attempt');
    const tokens = await this.keycloakAdapter.refresh(refreshToken);
    this.logger.log('Token refresh successful');
    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    this.logger.log('Logout attempt');
    await this.keycloakAdapter.logout(refreshToken);
    this.logger.log('Logout successful');
  }

  async getUserInfo(accessToken: string) {
    return this.keycloakAdapter.getUserInfo(accessToken);
  }

  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
  }) {
    return this.keycloakAdapter.createUser(userData);
  }
}
