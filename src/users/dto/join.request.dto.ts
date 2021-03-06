// export defualt 가 아니라 export class로 하는 이점?
// 인터페이스와 비슷한 역할을 하면서, js로 바뀌어도
// 계속 class가 남아있어서 type 검증?(validation) 가능

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class JoinRequestDto {
    @IsEmail()
    @ApiProperty({
        example: 'abcd@gmail.com',
        description: '이메일',
    })
    public email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '수구리',
        description: '닉네임',
    })
    public nickname: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '1q2w3e4r',
        description: '비밀번호',
    })
    public password: string;
}