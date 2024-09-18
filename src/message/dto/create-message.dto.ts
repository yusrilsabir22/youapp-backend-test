import { IsNotEmpty } from "class-validator";

export class CreateMessageDto {
    sender: string;
    @IsNotEmpty()
    receipent: string
    @IsNotEmpty()
    text: string;
}
