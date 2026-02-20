import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://localhost:3000',          // frontend local dev
      'http://127.0.0.1:3000',          // frontend local dev (alternate)
      'https://slooze-kappa.vercel.app', // frontend production
    ],
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}/graphql`);
}
bootstrap();