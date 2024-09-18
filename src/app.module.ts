import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { dbConfig } from './constant';
import { UsersModule } from './users/users.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true
    }),
    MongooseModule.forRoot(dbConfig.url),
    AuthModule,
    UsersModule,
    MessageModule,
    ChatModule,
  ],
  providers: [],
})
export class AppModule {}
