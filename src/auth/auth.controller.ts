import { Controller, Post, Body, HttpCode, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiResponse } from '../utils/response.util';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const response: ApiResponse = await this.authService.register(dto);
    const statusCode = response.success ? 201 : response.error?.code || 500;
    res.status(statusCode).json(response);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() { email, password }: { email: string; password: string },
    @Res() res: Response,
  ): Promise<void> {
    const response: ApiResponse = await this.authService.login(email, password);
    const statusCode = response.success ? 200 : response.error?.code || 500;
    res.status(statusCode).json(response);
  }
}
