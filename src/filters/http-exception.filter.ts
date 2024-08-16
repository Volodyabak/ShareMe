import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { createErrorResponse } from '../utils/response.util';
import { AuthErrorMessage } from 'src/config/error-message.config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let description = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      message = exceptionResponse.message || exception.message;
      description = AuthErrorMessage.invalidCredentials;
    }

    const errorResponse = createErrorResponse(status, description, message);
    response.status(status).json(errorResponse);
  }
}
