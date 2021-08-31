import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@ApiTags('USER')
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService){

    }

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
    // User 데코레이터를 사용
    getUsers(@User() user) {
        return user;
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
    postUsers(@Body() data: JoinRequestDto) {
        // usersService 호출!
        this.usersService.postUsers(data.email, data.nickname, data.password);
    }
    
    @ApiOkResponse({
        description: '성공',
        type: UserDto,
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
        res.clearCookie('connect.sid', { httpOnly: true});
        res.send('ok');
    }
}
