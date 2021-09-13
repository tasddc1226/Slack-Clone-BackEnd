import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// Injectable가 붙으면 providers 이다.
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const can = await super.canActivate(context);
        if (can) {
            const request = context.switchToHttp().getRequest();
            console.log('login for cookie');
            await super.logIn(request);
        }
        return true;
    }
}