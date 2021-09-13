import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from '../entities/Users';
import { AuthService } from './auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) {
        super();
    }
    // user의 id만 추출해서 세션에 저장
    serializeUser(user: Users, done: CallableFunction) {
        console.log(user);
        done(null, user.id);
    }
    // deserializeUser?
    // 세션에 저장되어있는 user의 id를 가져와 user의 객체를 복원
    // 복원 후 다시 req user에 넣어준다.
    async deserializeUser(userId: string, done: CallableFunction) {
        return await this.usersRepository
            .findOneOrFail( // 비동기 처리로 DB에 쿼리를 날리면 에러 처리를 하자
                {
                    id: +userId,
                },
                {
                    select: ['id', 'email', 'nickname'],
                    // 내가 속해있는 Workspaces까지 가져옴
                    relations: ['Workspaces'],
                },
            )
            .then((user) => {
                console.log('user', user);
                done(null, user); // req.user
            })
            .catch((error) => done(error));
    }
}