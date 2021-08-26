import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workspaces/:url/dms')
export class DmsController {
    @Get(':id/chats')
    getChat(@Query() query, @Param() param) { // query 객체를 통째로 받아옴
        console.log(query.perPage, query.page);
        // :id, :url 라우터 파라메터를 가져옴
        console.log(param.id, param.url);
    }

    @Post(':id/chats')
    postChat(@Body() body) {

    }
}
