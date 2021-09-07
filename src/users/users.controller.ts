import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseInterceptors
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

// 전체 컨트롤러에 Interceptors 장착
@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiOkResponse({
        description: '성공',
        type: UserDto,
    })
    @ApiResponse({
        status: 500,
        description: '서버 에러',
    })
    @ApiOperation({ summary: '내 정보 조회' })
    @Get()
    getUsers(@User() user) {     // User 데코레이터를 사용
        return user || false;
        // res.locals.jwt
        /*
            express에서는 res.locals가 미들웨어간에 공유할 수 있는
            변수 역할을 함. 이때는 req, res가 필수적으로 사용되어 짐.
            이를 사용하게 되면 한 플랫폼에 종속되어짐.
            => 해결하기 위해 커스텀 데코레이터를 사용함. 이를 통해 타입 추론도 가능해짐!
        */
    }

    @ApiOperation({ summary: '회원 가입' })
    @Post()
    async join(@Body() data: JoinRequestDto) {
        // usersService 호출!
        await this.usersService.join(data.email, data.nickname, data.password);
    }

    @ApiOkResponse({
        description: '로그인 성공',
        type: UserDto,
    })
    @ApiResponse({
        status: 500,
        description: '서버 에러',
    })
    @ApiOperation({ summary: '로그인' })
    @Post('login')
    logIn(@User() user) {
        return user;
    }

    @ApiOperation({ summary: '로그 아웃' })
    @Post('logout')
    logOut(@Req() req, @Res() res) {
        req.logOut();
        res.clearCookie('connect.sid', { httpOnly: true });
        res.send('ok');
    }
}
