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

}
