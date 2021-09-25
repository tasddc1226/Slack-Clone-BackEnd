import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelChats } from 'src/entities/ChannelChats';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelsService {
    constructor(
        @InjectRepository(Channels)
        private channelsRepository: Repository<Channels>,
        @InjectRepository(ChannelMembers)
        private channelMembersRepository: Repository<ChannelMembers>,
        @InjectRepository(Workspaces)
        private workspacesRepository: Repository<Workspaces>,
        @InjectRepository(ChannelChats)
        private channelChatsRepository: Repository<ChannelChats>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>
    ) { }
    // id로 channel 찾기
    async findById(id: number) {
        return this.channelsRepository.findOne({ where: { id } });
    }

    // 워크스페이스 내의 모든 채널 가져오기
    async getWorkspaceChannels(url: string, myId: number) {
        return this.channelsRepository
            // channelsRepository를 channels라는 별명으로 설정
            .createQueryBuilder('channels')
            // 내가 속해있는 채널들을 모두 가져오고
            .innerJoinAndSelect(
                'channels.ChannelMembers',
                'channelMembers',
                'channelMembers.userId = :myId',
                { myId },
            )
            // 채널에 대한 워크스페이스도 가져옴
            .innerJoinAndSelect(
                'channels.Workspace',
                'workspace',
                'workspace.url = :url',
                { url },
            )
            .getMany();
    }

    // 워크스페이스 채널 하나만 가져오기
    async getWorkspaceChannel(url: string, name: string) {
        return this.channelChatsRepository.findOne({
            where: {
                // workspaceId: id,
                name,
            },
        });
    }

}
