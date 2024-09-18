import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { Request } from 'express';
import { ResponseMessage } from 'src/response.decorator';
import { TransformInterceptor } from 'src/response.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Message')
@Controller()
@UseInterceptors(TransformInterceptor)
export class MessageController {
    constructor(private messageService: MessageService) {}

    @Post('/sendMessage')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @ResponseMessage('success send message')
    sendMessage(
        @Req() req: Request,
        @Body() payload: CreateMessageDto
    ) {
        payload.sender = req.user.id;
        return this.messageService.create(payload);
    }

    @Get('/viewMessage')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @ResponseMessage('success view message')
    async viewMessage(
        @Req() req: Request
    ) {
        const data = await this.messageService.getMessagesGroupedByUser(req.user.id)
        return data;
    }
}
