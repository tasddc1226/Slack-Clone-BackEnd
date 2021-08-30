import { ApiProperty } from "@nestjs/swagger";
import { JoinRequestDto } from "src/users/dto/join.request.dto";

// 상속이 가능!
export class UserDto extends JoinRequestDto{
    @ApiProperty({
        required: true,
        example: 1,
        description: '아이디',
    })
    id: number;

    
}