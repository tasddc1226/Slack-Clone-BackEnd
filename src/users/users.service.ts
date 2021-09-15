import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(WorkspaceMembers)
        private workspaceMembersRepository: Repository<WorkspaceMembers>,
        @InjectRepository(ChannelMembers)
        private channelMembersRepository: Repository<ChannelMembers>,
        private connection: Connection,
    ) { }


    async findByEmail(email: string) {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password'],
        });
    }

    async join(email: string, nickname: string, password: string) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const user = await queryRunner.manager
            .getRepository(Users)
            .findOne({ where: { email } });
        if (user) {
            // 이미 존재하는 유저
            throw new UnauthorizedException("이미 존재하는 사용자 입니다!");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        try {
            const returned = await queryRunner.manager.getRepository(Users).save({
                email,
                nickname,
                password: hashedPassword,
            });
            throw new Error('롤백 테스트!');
            const workspaceMember = queryRunner.manager.getRepository(WorkspaceMembers).create();
            workspaceMember.UserId = returned.id;
            workspaceMember.WorkspaceId = 1;
            await queryRunner.manager.getRepository(WorkspaceMembers).save(workspaceMember);
            await queryRunner.manager.getRepository(ChannelMembers).save({
                UserId: returned.id,
                ChannelId: 1,
            });
            await queryRunner.commitTransaction();
            return true;
        } catch (error) {
            console.error(error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
