import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterPayloadDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    confirmPassword: string;
}
