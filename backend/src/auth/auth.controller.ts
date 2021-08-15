import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { IRequestWithUser } from './interfaces/request-with-user.interface';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';
import { JwtAuthenticationGuard } from './guards/jwt-authentication.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @Post('signup')
  async signUp(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('signin')
  async signIn(@Req() request: IRequestWithUser, @Res() response: Response): Promise<Response> {
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);

    // TODO: Replace method of cleaning the password
    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('signout')
  signOut(@Req() req: IRequestWithUser, @Res() res: Response): Response {
    res.setHeader('Set-Cookie', this.authService.getCookieForSignOut());
    return res.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() req: IRequestWithUser) {
    const { user } = req;
    user.password = undefined;

    return user;
  }
}
