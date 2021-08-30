import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('DM')
@Controller('api/workspaces/:url/dms')
export class DmsController {
    @ApiParam({
        name: 'url',
        required: true,
        description: '워크스페이스 url',
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: '사용자 아이디',
    })
    @ApiQuery({
        name: 'perPage',
        required: true,
        description: '한 번에 가져오는 개수',
    })
    @ApiQuery({
        name: 'page',
        required: true,
        description: '불러올 페이지',
    })
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
