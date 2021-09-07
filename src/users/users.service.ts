import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) { }

    // getUser() { }

    async join(email: string, nickname: string, password: string) {
        if (!email) {
            // async 에서는 throw를 해도 서버가 죽지 않는다.
            throw new HttpException("이메일이 없네요!", 400);
        }
        if (!nickname) {
            // 닉네임 없다고 에러
            throw new HttpException("닉네임 없네요!", 400);
        }
        if (!password) {
            // 비밀번호 없다고 에러
            throw new HttpException("비밀번호가 없네요!", 400);
        }
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user) {
            // 이미 존재하는 유저
            throw new HttpException("이미 존재하는 사용자 입니다!", 401);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await this.usersRepository.save({
            email,
            nickname,
            password: hashedPassword,
        });
    }
}
