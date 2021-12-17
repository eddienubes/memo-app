import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { googleAuthConfig } from '../../common/config/google-auth-config';
import { AuthService } from './auth.service';
import { Auth, google } from 'googleapis';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class GoogleAuthService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    @Inject(googleAuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof googleAuthConfig>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    const clientId = authConfig.googleClientId;
    const clientSecret = authConfig.googleClientSecret;

    this.oauthClient = new google.auth.OAuth2(clientId, clientSecret);
  }

  public async authenticate(token: string) {
    // TODO: Vulnerable to invalid tokens, try catch expected
    const tokenInfo = await this.oauthClient.getTokenInfo(token);

    const email = tokenInfo.email;

    try {
      const user = await this.userService.findByEmail(email);

      return this.handleRegisteredUser(user);
    } catch (err) {
      if (err.status !== 404) {
        throw new err();
      }

      return this.registerUser(token, email);
    }
  }

  private async handleRegisteredUser(user: User) {
    if (!user.isRegisteredWithGoogle) {
      throw new UnauthorizedException();
    }

    const { accessTokenCookie, refreshTokenCookie } =
      await this.retrieveCookiesForUser(user);

    return {
      accessTokenCookie,
      refreshTokenCookie,
      user,
    };
  }

  private async retrieveCookiesForUser(user: User): Promise<{
    accessTokenCookie: string;
    refreshTokenCookie: string;
  }> {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      accessTokenCookie,
      refreshTokenCookie,
    };
  }

  private async registerUser(token: string, email: string) {
    const userData = await this.getUserData(token);

    const { name, picture } = userData;

    const user = await this.userService.createWithGoogle(email, name, picture);

    return this.handleRegisteredUser(user);
  }

  private async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }
}
