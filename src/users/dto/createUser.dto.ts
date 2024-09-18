import { IsEmail, IsEmpty, IsMongoId, isMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEmpty()
    @IsString()
    @IsMongoId()
    profile?: string;
}
