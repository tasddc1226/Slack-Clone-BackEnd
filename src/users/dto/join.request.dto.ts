// export defualt 가 아니라 export class로 하는 이점?
// 인터페이스와 비슷한 역할을 하면서, js로 바뀌어도
// 계속 class가 남아있어서 type 검증?(validation) 가능

import { ApiProperty } from "@nestjs/swagger";

export class JoinRequestDto {
    @ApiProperty({
        example: 'abcd@gmail.com',
        description: '이메일',
        required: true,
    })
    public email: string;

    @ApiProperty({
        example: '수구리',
        description: '닉네임',
        required: true,
    })
    public nickname: string;

    @ApiProperty({
        example: 'password1234',
        description: '비밀 번호',
        required: true,
    })
    public password: string;
}