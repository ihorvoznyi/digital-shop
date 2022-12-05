import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT);
}

bootstrap().then(() =>
  console.log(`Server is running on ${process.env.PORT} port.`)
);
