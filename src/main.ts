import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
  console.log(`\n[🚀] App started on port ${port}`);
  console.log(`[🌍] Environment: ${process.env.NODE_ENV}`);
}
bootstrap();
