import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
    constructor(
        @InjectRepository(Workspaces)
        private workspacesRepository: Repository<Workspaces>,
        @InjectRepository(WorkspaceMembers)
        private workspaceMembersRepository: Repository<WorkspaceMembers>,
        @InjectRepository(Channels)
        private channelsRepository: Repository<Channels>,
        @InjectRepository(ChannelMembers)
        private channelMembersRepository: Repository<ChannelMembers>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,

    ) { }

    async findById(id: number) {
        // return this.workspacesRepository.find({where: {id }, take : 1}); : 근본
        return this.workspacesRepository.findByIds([id]);
    }

    async findMyWorkspaces(myId: number) {
        return this.workspaceMembersRepository.find({
            where: {
                WorkspaceMembers: [{ UserId: myId }],
            },
        });
    }

    async createWorkspace(name: string, url: string, myId: number) {

    }

}
