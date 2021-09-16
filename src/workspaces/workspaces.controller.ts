import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
    constructor(
        private workspacesService: WorkspacesService
    ) { }


    @Get()
    getMyWorkspaces(@User() user: Users) { // 커스텀데코레이터 사용
        return this.workspacesService.findMyWorkspaces(user.id);
        // @Param or @Query는 기본적으로 문자열을 받아오기 때문에 myId : number로 하면 X
        // type만 number로 명시할 뿐이지, 실제 JS값은 문자열이다.
        // 1. parseInt(myId)로 넘겨주어 형변환을 시킨다.
        // 2. +myId로 문자열모양을 숫자로 바꿔준다.
        // 3. myId.valueOF()를 사용 등등이있지만,,
        // ParseIntPipe를 사용하자.
    }

    @Post()
    createWorkspaces(@User() user: Users, @Body() body: CreateWorkspaceDto) {
        return this.workspacesService.createWorkspace(
            body.workspace,
            body.url,
            user.id,
        );
    }

    @Get(':url/members')
    getAllMembersFromWorkspace() {

    }

    @Post(':url/members')
    inviteMembersToWorkspace() {

    }

    @Delete(':url/members/:id')
    kickMemberFromWorkspace() {

    }

    @Get(':url/members/:id')
    getMemberInfoInWorkspace() {

    }

    @Get(':url/users/:id')
    getWorkspaceUser() {

    }

}
