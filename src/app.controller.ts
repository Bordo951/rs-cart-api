import { Controller, Get, Request, Post, UseGuards, HttpStatus, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard, AuthService, JwtAuthGuard, BasicAuthGuard } from './auth';
import { LOGIN_TYPES } from './auth/auth.service';
import { AppRequest } from './shared';
import { User } from './users/models';

@ApiTags('auth')
@Controller()
export class AppController {

  constructor(private authService: AuthService) {}

  @Get([ '', 'ping' ])
  healthCheck(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  // @UseGuards(LocalAuthGuard)
  @Post('api/auth/login')
  @ApiBody({ type: User })
  async login(@Request() req: AppRequest, @Body() body: User) {
    const token = this.authService.login(body, LOGIN_TYPES.BASIC);
  
    return  {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        ...token,
      },
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get('api/profile')
  async getProfile(@Request() req: AppRequest) {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        user: req.user,
      },
    };
  }
}
