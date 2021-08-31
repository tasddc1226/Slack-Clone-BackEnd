import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// token 데코레이터를 직접 만들어줌 -> 중복을 제거
export const Token = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        // Http 서버를 사용하고 있음.
        // 실행 컨텍스트(ExecutionContext)를 통해서 ctx라는 한 객체에 접근이 가능함.
        // 따라서, 한 서버 내에서 Ws(WebSocket), Rpc, Http 이 3가지 서버를 동시에 돌릴 수 있다.
        const response = ctx.switchToHttp().getResponse();
        return response.locals.jwt;
    },
) ;

// jwt를 사용하여 토큰 사용
// @Token() token