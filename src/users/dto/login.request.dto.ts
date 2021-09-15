import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginRequestDto {
    @IsEmail()
    @ApiProperty({
        example: 'abcd@gmail.com',
        description: '이메일',
    })
    public email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '1q2w3e4r',
        description: '비밀번호',
    })
    public password: string;
}