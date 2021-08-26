import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService){

    }

    // get: users
    // 내 정보 return
    @Get()
    getUsers() {

    }
    // post: users
    @Post()
    postUsers(@Body() data: JoinRequestDto) {
        // usersService 호출!
        this.usersService.postUsers(data.email, data.nickname, data.password);
    }
    // post: users/login
    @Post('login')
    logIn(@Req() req) {
        return req.user;
    }   
    // post: users/logout
    // express의 Req, Res 사용
    @Post('logout')
    logOut(@Req() req, @Res() res) {
        req.logOut();
        res.clearCookie('connect.sid', { httpOnly: true});
        res.send('ok');
    }
}
