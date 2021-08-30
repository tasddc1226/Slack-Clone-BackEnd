import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
    // 모든 채널 가져오기
    @Get()
    getAllChannels() {

    }

    @Post()
    createChannels() {

    }

    // 특정 Channel 가져오기
    @Get('name')
    getSpecificChannel() {

    }

    @Get(':name/chats')
    getChats(@Query() query, @Param() param) { // query 객체를 통째로 받아옴
        console.log(query.perPage, query.page);
        // :id, :url 라우터 파라메터를 가져옴
        console.log(param.id, param.url);
    }

    @Post(':name/chats')
    postChat(@Body() body) {

    }

    @Get(':name/members')
    getAllMembers() {

    }

    @Post(':name/members')
    inviteMembers() {

    }
}
