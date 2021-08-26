import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

// Nest에서도 express 형태의 미들웨어 작성 가능
// express의 morgan을 nest에서 미들웨어로 작성해서 사용해보자

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP'); // logger context 지정

    // express middleware 형태 (노드의 실행 순서는 달라질 수 있음.)
    use(request: Request, response: Response, next: NextFunction): void {
        // 1. 라우터가 시작될 때 기록
        const { ip, method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';

        // 3. 라우터가 finish 된 후 .on으로 비동기로 실행
        response.on('finish', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            // console.log 보다는 Logger.log를 사용
            // HTTP 관련 요청들만 따로 로그 출력
            this.logger.log(
                `${method} ${originalUrl} ${statusCode} ${contentLength}, - ${userAgent} ${ip}`,
            );
        });
        // 2. middleware에서 next()를 해줘야 다음라우터로 넘어간다.
        next();
    }
}