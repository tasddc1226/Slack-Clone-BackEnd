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
            | string
            | { error: string; statusCode: 400; message: string[] };
        // let msg = '';

        console.log(status, err);

        response.status(status).json({ msg: err });
        // if (typeof err !== 'string' && err.error === 'Bad Request') {
        //     return response.status(status).json({
        //         success: false,
        //         code: status,
        //         data: err.message,
        //     });
        // }

        // response.status(status).json({
        //     success: false,
        //     code: status,
        //     data: err,
        // });
    }
}