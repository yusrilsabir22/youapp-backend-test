import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthPayloadDto {

    @ApiProperty({
        example: "test123 Or test@test.com",
        required: true
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: "test1234",
        required: true
    })
    @IsNotEmpty()
    password: string;
}
