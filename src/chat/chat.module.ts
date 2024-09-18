import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageService } from '../message/message.service';
import { AuthService } from '../auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../users/services/users.service';
import { Message, MessageSchema } from '../message/schemas/Message.schema';
import { User, UserSchema } from '../users/schemas/User.schema';
import { Profile, ProfileSchema } from '../users/schemas/Profile.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Message.name,
            schema: MessageSchema
        }]),
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }]),
        MongooseModule.forFeature([{
            name: Profile.name,
            schema: ProfileSchema
        }])
    ],
    providers: [ChatGateway, MessageService, AuthService, UsersService]
})
export class ChatModule {}
