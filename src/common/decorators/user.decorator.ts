import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { request } from "express";

// User라는 데코레이터를 직접 만들어줌
export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);