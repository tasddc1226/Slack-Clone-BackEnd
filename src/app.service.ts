import { Injectable } from '@nestjs/common';

// 요청, 응답에 대해서는 모름.
// 서비스에서는 순수하게 해야하는 동작만 수행하고
// 그 결과를 컨트롤러에 전달.

@Injectable()
export class AppService {
  // getHello(): string {
  //   return '안녕 친구들!';
  // }

  async getSwim() {
    return process.env.SECRET;
  }
}
