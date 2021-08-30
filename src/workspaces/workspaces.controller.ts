import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
    @Get()
    getMyWorkspaces() {

    }

    @Post()
    createWorkspaces() {

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
