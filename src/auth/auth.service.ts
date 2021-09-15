import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt'
import { Repository } from "typeorm";
import { Users } from "src/entities/Users";

@Injectable()
export class AuthService {
    constructor( // 의존성 주입
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) { }

    async validateUser(email: string, password: string) {
        // 서비스에서 서비스를 호출하는 것 보다는 레포지토리를 호출하자
        const user = await this.usersRepository.findOne({
            // 이메일을 통해서 해당 유저를 찾음.
            where: { email },
            select: ['id', 'email', 'password'],
        });
        console.log(email, password, user);
        if (!user) {
            // 찾는 유저가 없다면 return null
            return null;
        }
        const result = await bcrypt.compare(password, user.password);
        // 비밀번호 까지 일치한다면
        if (result) {
            // 구조분해 할당과 Rest 문법을 사용하여 해당 유저의 비밀번호를 제외한 나머지를 리턴
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }
}