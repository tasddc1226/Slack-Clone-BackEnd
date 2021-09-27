import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    NotFoundException,
    Post,
    Request,
    Response,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { NotLoggedInGuard } from '../auth/not-logged-in.guard';
import { User } from '../common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
import { Users } from '../entities/Users';
import { JoinRequestDto } from './dto/join.request.dto';
import { LoginRequestDto } from './dto/login.request.dto';
import { UsersService } from './users.service';

// 전체 컨트롤러에 Interceptors 장착
@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USERS')
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiCookieAuth('connect.std')
    @ApiOperation({ summary: '내 정보 조회' })
    @Get()
    async getProfile(@User() user: Users) {
        // user가 오면 login한 상태, false이면 login 하지 않은 상태
        return user || false;
    }

    @ApiOperation({ summary: '회원 가입' })
    @UseGuards(NotLoggedInGuard) // 로그인 하지 않은 사람만..
    @Post()
    async join(@Body() data: JoinRequestDto) {
        const user = this.usersService.findByEmail(data.email);
        if (!user) {
            throw new NotFoundException();
        }
        const result = await this.usersService.join(
            data.email,
            data.nickname,
            data.password,
        );
        if (result) {
            return 'ok';
        } else {
            throw new ForbiddenException();
        }
    }

    @ApiOperation({ summary: '로그인' })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async logIn(@User() user: Users) {
        return user;
    }

    @ApiCookieAuth('connect.sid')
    @ApiOperation({ summary: '로그아웃' })
    @UseGuards(LoggedInGuard)
    @Post('logout')
    async logOut(@Response() res) {
        res.clearCookie('connect.sid', { httpOnly: true });
        return res.send('ok');
    }
}
