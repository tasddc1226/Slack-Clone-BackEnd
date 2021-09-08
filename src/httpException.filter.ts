import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

// HttpException을 Catch 하는 부분!
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) { // exception에는 HttpException에 대한 정보가 들어있음.
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus(); // 400 ..
        const err = exception.getResponse() as // error msg
            | { message: any, statusCode: number } // error 메시지 커스터마이징한 string
            | { error: string; statusCode: 400; message: string[] }; // class-validator가 주는 메시지 형식
        // let msg = '';
        // class-validator의 error 메시지인 경우
        if (typeof err !== 'string' && err.statusCode === 400) {
            return response.status(status).json({
                success: false,
                code: status,
                data: err.message,
            });
        }
        // error msg가 string인 경우를 서로 다르게 format
        response.status(status).json({
            success: false,
            code: status,
            data: err.message,
        });
    }
}