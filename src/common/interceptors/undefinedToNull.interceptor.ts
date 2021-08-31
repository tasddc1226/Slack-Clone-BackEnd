/* 
interceptor란?
=> Nest에서 제공하는 기능
=> Main 컨트롤러 실행 전,후로 특정 동작을 수행하도록 하는 것
=> 컨트롤러에서 return 한 후에 데이터를 가공할 수 있는 마지막 기회 제공 
*/

import { 
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        // 컨트롤러 가기 전 부분 (ex. logging 할 때 시간 측정 등..)
        return next
            .handle()
            // data가 undefined면 null로 바꿔주어 마지막으로 data 가공 작업
            .pipe(map((data) => (data === undefined ? null : data))); 
    
        // 후 부분
    }
}