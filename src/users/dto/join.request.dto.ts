// export defualt 가 아니라 export class로 하는 이점?
// 인터페이스와 비슷한 역할을 하면서, js로 바뀌어도
// 계속 class가 남아있어서 type 검증?(validation) 가능

import { ApiProperty, PickType } from "@nestjs/swagger";
import { Users } from "../../entities/Users";

export class JoinRequestDto extends PickType(Users, [
    'email',
    'nickname',
    'password',
] as const) { }