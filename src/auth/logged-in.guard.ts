import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

// 로그인 인증해주는 미들웨어 구현
@Injectable()
export class LoggedInGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        // express의 request를 가져와서 사용
        const request = context.switchToHttp().getRequest();
        // true or false에 따라서 어떤 컨트롤러를 사용하고 못하는지가 결정
        return request.isAuthenticated();
    }
}