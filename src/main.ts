import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './httpException.filter';
import * as passport from 'passport';
import session from 'express-session';


declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DTO에서 사용된 class-validator 적용
  app.useGlobalPipes(new ValidationPipe());
  // 모든 컨트롤러에서 발생하는 HttpException을 처리!
  app.useGlobalFilters(new HttpExceptionFilter());
  // session 동작을 위해 추가
  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.PORT || 3000; // port값이 없으면 3000으로..!
  // localhost:PORT/api 에 자동으로 api 문서들을 만들어준다.
  const config = new DocumentBuilder()
    .setTitle('Slack API')
    .setDescription('Slack 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}
bootstrap();
