import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'diagnostics_channel';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Connection, MoreThan, Repository } from 'typeorm';

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
        private connection: Connection,

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
        const workspace = this.workspacesRepository.create({
            name,
            url,
            OwnerId: myId,
        });
        const returned = await this.workspacesRepository.save(workspace);
        const workspaceMember = new WorkspaceMembers();
        workspaceMember.UserId = myId;
        workspaceMember.WorkspaceId = returned.id;
        const channel = new Channels();
        channel.name = '일반';
        channel.WorkspaceId = returned.id;
        const [, channelReturned] = await Promise.all([
            this.workspaceMembersRepository.save(workspaceMember),
            this.channelsRepository.save(channel),
        ]);
        const channelMember = new ChannelMembers();
        channelMember.UserId = myId;
        channelMember.ChannelId = channelReturned.id;
        await this.channelMembersRepository.save(channelMember);
    }

    // 워크스페이스의 멤버들을 가져오는 서비스 : 쿼리 빌더 사용
    // 쿼리 빌더 : typeORM이 최대한 SQL과 비슷하게 만들어 놓은 것
    async getWorkspaceMembers(url: string) {
        this.usersRepository
            // u는 Users entity 대한 별명
            .createQueryBuilder('u')
            .innerJoin('u.WorkspaceMembers', 'm')
            // sql injection 방어를 위한 url 파싱 방법
            .innerJoin('m.Workspace', 'w', 'w.url = :url', { url })
            // join 결과를 객체로 가져오기 위해서 getMany() 사용
            // 하지만 자바스크립트로 한번 가공하기 때문에 속도가 느린 단점
            // ORM을 사용하는데 성능까지..? -> Row query 날리기
            .getMany();

    }
    // 워크스페이스에 멤버를 초대하는 service
    async createWorkspaceMembers(url, email) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
            join: {
                alias: 'workspace',
                // join한 테이블의 데이터까지 모두 가져옴
                innerJoinAndSelect: {
                    channels: 'workspace.Channels',
                },
            },
        });
        // use QueryBuilder
        // this.workspacesRepository.createQueryBuilder('workspace').innerJoinAndSelect('workspace.channels', 'channels').getOne()

        // 워크스페이스에 사용자를 추가하고 저장.
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        const workspaceMember = new WorkspaceMembers();
        workspaceMember.WorkspaceId = workspace.id;
        workspaceMember.UserId = user.id;
        await this.workspaceMembersRepository.save(workspaceMember);

        // 유저를 모든 채널에 추가하는게 아니라 기본적으로 있는 일반 채널에 초대
        const channelMember = new ChannelMembers();
        channelMember.ChannelId = workspace.Channels.find(
            (v) => v.name === '일반',
        ).id;
        channelMember.UserId = user.id;
        await this.channelMembersRepository.save(channelMember);
    }

    // 워크스페이스에 있는 멤버들 가져오는 service
    async getWorkspaceMember(url: string, id: number) {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .innerJoin(
                'user.Workspaces',
                'workspaces',
                'workspaces.url = :url',
                { url },
            )
            .getOne();
    }

    async getWorkspaceChannel(url: string, name: string) {
        return this.channelsRepository.findOne({
            where: {
                // workspaceId: id,
                name,
            },
            relations: ['Workspace'],
        });
    }

    // 워크스페이스에 새로운 채널 생성하기
    async createWorkspaceChannels(url: string, name: string, myId: number) {
        const workspace = await this.workspaceMembersRepository.findOne({
            where: { url },
        });
        const channel = new Channels();
        channel.name = name;
        channel.WorkspaceId = workspace.UserId;
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
