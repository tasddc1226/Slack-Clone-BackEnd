import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// 컨트롤러는 req, res에 대해 알고있다.
// 요청을 받아서 서비스에 넘기고 결과를 받아서 응답을 하는 것.
// express.js 에서는 미들웨어에서 요청에 대한 처리, 비즈니스 로직, 응답에 대한 처리를 한번에 처리했었음. 
// 여기서 비즈니스 로직을 nestjs 에서는 서비스로 분리를 한 것

// 컨트롤러와 서비스를 분리하는 이유?
// 1) 코드의 재사용을 위함.
// 2) 서비스(비즈니스 로직)는 req, res에 대해 모르므로 독립적인 특징 -> 단위, e2e 테스트가 용이

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  getSwim() {
    return this.appService.getSwim();
  }
}
