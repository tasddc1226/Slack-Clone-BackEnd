import {
    Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isEmail } from 'class-validator';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@ApiTags('WORKSPACES')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces')
export class WorkspacesController {
    constructor(private workspacesService: WorkspacesService) { }

    @ApiOperation({ summary: '내 워크스페이스 가져오기' })
    @Get()
    async getMyWorkspaces(@User() user: Users) { // 커스텀데코레이터 사용
        return this.workspacesService.findMyWorkspaces(user.id);
    }

    @ApiOperation({ summary: '워크스페이스 생성' })
    @Post()
    async createWorkspaces(@User() user: Users, @Body() body: CreateWorkspaceDto) {
        return this.workspacesService.createWorkspace(
            body.workspace,
            body.url,
            user.id,
        );
    }

    @ApiOperation({ summary: '워크스페이스 멤버 가져오기' })
    @Get(':url/members')
    async getAllMembersFromWorkspace(@Param('url') url: string) {
        return this.workspacesService.getWorkspaceMembers(url);
    }

    @ApiOperation({ summary: '워크스페이스 멤버 초대하기' })
    @Post(':url/members')
    async inviteMembersToWorkspace(
        @Param('url') url: string,
        @Body('email') email,
    ) {
        return this.workspacesService.createWorkspaceMembers(url, email);
    }


    @Delete(':url/members/:id')
    kickMemberFromWorkspace() {

    }

    @ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' })
    @Get(':url/members/:id')
    async getWorkspaceMember(
        @Param('url') url: string,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.workspacesService.getWorkspaceMember(url, id);
    }

    @ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' })
    @Get(':url/users/:id')
    async getWorkspaceUser(
        @Param('url') url: string,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.workspacesService.getWorkspaceMember(url, id);
    }

}
