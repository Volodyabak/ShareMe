import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from '../utils/response.util';
import { AuthErrorMessage } from 'src/config/error-message.config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<ApiResponse> {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (userExists) {
        throw new ConflictException(AuthErrorMessage.emailExists);
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      const accessToken = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      });

      return {
        success: true,
        message: AuthErrorMessage.registeredSuccessfully,
        data: { accessToken },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        return {
          success: false,
          message: AuthErrorMessage.registerFailed,
          error: {
            code: 409,
            description: AuthErrorMessage.emailExists,
          },
        };
      }

      return {
        success: false,
        message: AuthErrorMessage.registerFailed,
        error: {
          code: 500,
          description: AuthErrorMessage.serverError,
        },
      };
    }
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException(AuthErrorMessage.invalidCredentials);
      }

      const accessToken = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      });

      const userResponse = {
        id: user.id,
        email: user.email,
      };

      return {
        success: true,
        message: AuthErrorMessage.successfullLogin,
        data: {
          accessToken,
          user: userResponse,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return {
          success: false,
          message: AuthErrorMessage.loginFailed,
          error: {
            code: 401,
            description: AuthErrorMessage.invalidCredentials,
          },
        };
      }

      return {
        success: false,
        message: AuthErrorMessage.loginFailed,
        error: {
          code: 500,
          description: AuthErrorMessage.serverError,
        },
      };
    }
  }
}
