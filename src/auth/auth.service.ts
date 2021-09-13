import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
    constructor( // 의존성 주입
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) { }

    async validateUser(email: string, password: string) {
        // 서비스에서 서비스를 호출하는 것 보다는 레포지토리를 호출하자
        const user = await this.usersRepository.findOne({
            where: { email }, // 이메일을 통해서 해당 유저를 찾음.
        });
        console.log(email, password, user);
        if (!user) {
            return null; // 찾는 유저가 없다면 null return
        }
        const result = await bcrypt.compare(password, user.password);
        if (result) { // 비밀번호 까지 일치한다면
            // 구조분해 할당과 Rest 문법을 사용하여 해당 유저의 비밀번호를 제외한 나머지를 리턴
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }
}