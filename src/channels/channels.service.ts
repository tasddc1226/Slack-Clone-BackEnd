import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelChats } from 'src/entities/ChannelChats';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { Workspaces } from 'src/entities/Workspaces';
import { MoreThan, Repository } from 'typeorm';

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
        private usersRepository: Repository<Users>,
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
        return this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .where('channel.name = :name', { name })
            .getOne();
    }

    // 워크스페이스에 새로운 채널 생성하기
    async createWorkspaceChannels(url: string, name: string, myId: number) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        const channel = new Channels();
        channel.name = name;
        channel.WorkspaceId = workspace.id;
        const channelReturned = await this.channelsRepository.save(channel);
        const channelMember = new ChannelMembers();
        channelMember.UserId = myId;
        channelMember.ChannelId = channelReturned.id;
        await this.channelMembersRepository.save(channelMember);
    }

    // 채널에 속한 멤버들 가져오기
    async getWorkspaceChannelMembers(url: string, name: string) {
        return this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.Channels', 'channels', 'channels.name = :name', {
                name,
            })
            .innerJoin('channels.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .getMany();
    }

    // 채널에 새로운 멤버 추가하기
    async createWorkspaceChannelMembers(url, name, emial) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .where('channel.name = :name', { name })
            .getOne();
        if (!channel) {
            throw new NotFoundException('채널이 존재하지 않습니다!');
        }

        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.email', { emial })
            .innerJoin('user.Workspaces', 'workspace', 'workspace.url = :url', {
                url,
            })
            .getOne();
        if (!user) {
            throw new NotFoundException('사용자가 존재하지 않습니다!');
        }
        const channelMember = new ChannelMembers();
        channelMember.ChannelId = channel.id;
        channelMember.UserId = user.id;
        await this.channelMembersRepository.save(channelMember);

    }

    // 채널에서 채팅내역 가져오기
    async getWorkspaceChannelChats(
        url: string,
        name: string,
        perPage: number,
        page: number,
    ) {
        return this.channelChatsRepository
            .createQueryBuilder('channelChats')
            .innerJoin('channelChats.Channel', 'channel', 'channel.name = :name', {
                name,
            })
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            // 채팅을 작성한 사람 select
            .innerJoinAndSelect('channelChats.User', 'user')
            // 날짜 역순으로 정렬
            .orderBy('channelChats.createAt', 'DESC')
            .take(perPage)
            .skip(perPage * (page - 1))
            .getMany();
    }



    // 채널에서 내가 아직 읽지 않은 메시지의 개수를 보여주는 api
    async getChannelUnreadsCount(url, name, after) {
        // 채널의 id를 얻어오기 위해서 해당 채널을 찾는다.
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .where('channel.name = :name', { name })
            .getOne();

        return this.channelChatsRepository.count({ // COUNT (*)과 동일
            where: {
                ChannelId: channel.id,
                createAt: MoreThan(new Date(after)),
            },
        });
    }

}
