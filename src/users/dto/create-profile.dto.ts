import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

enum Gender {
    MALE,
    FEMALE
}

export class ProfilePayloadDto {
    @IsNotEmpty()
    @IsString()
    about: string;

    @IsNotEmpty()
    @IsString()
    displayName: string;
    
    @IsEnum(Gender)
    gender: Gender

    @IsNotEmpty()
    @IsDateString()
    birthDate: string

    @IsNotEmpty()
    @IsNumber()
    weight: number

    @IsNotEmpty()
    @IsNumber()
    height: number
}