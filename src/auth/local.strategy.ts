import { Strategy } from 'passport-local';
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email', passwordField: 'password' });
    }

    async validate(email: string, password: string, done: CallableFunction) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException(); // status code : 401 예외 처리
        }
        return done(null, user); // serializer user가 됨. 즉, req login 으로 감.
    }
}