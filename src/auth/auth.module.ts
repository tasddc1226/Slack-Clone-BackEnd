import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Users } from "../entities/Users";
import { AuthService } from "./auth.service";
import { LocalSerializer } from "./local.serializer";
import { LocalStrategy } from "./local.strategy";

@Module({
    // 사용하려는 다른 Module import
    imports: [
        // session: false로 하면 세션에 저장이 X -> 토큰으로 로그인 하려면 false
        PassportModule.register({ session: true }),
        // UsersModule을 Repository로 대체
        TypeOrmModule.forFeature([Users]),
    ],
    // Injectable이 붙으면.. providers
    providers: [AuthService, LocalStrategy, LocalSerializer],
})
export class AuthModule { }