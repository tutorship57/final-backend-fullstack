import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  //Middleware: cookieParser()
  // - Read the cookie header from incoming request and parse the string to java object
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  //Middleware: enableCors()
  // - sending Access-Control-Allow-Origin telling the browser that it safe to let 'http://localhost:5173' talk to me(server)
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
