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
        const user = await this.usersRepository.findOne({
            where: { email }, // 이메일을 통해서 해당 유저를 찾음.
        });
        console.log(email, password, user);
        if (!user) {
            return null; // 찾는 유저가 없다면 null return
        }
        const result = await bcrypt.compare(password, user.password);
        if (result) { // 비밀번호 까지 일치한다면
            const result = await bcrypt.compare(password, ...userWithoutPassword) = user;
            // delete user.password; 하면 비밀번호만 남음. 위의 줄과 동일함
            return userWithoutPassword;
        }
        return null;
    }
}