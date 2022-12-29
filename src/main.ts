import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createAndInitBot } from './telegram-bot/telegram-bot.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3003);
}

// init the telegram bot
createAndInitBot();
bootstrap();
