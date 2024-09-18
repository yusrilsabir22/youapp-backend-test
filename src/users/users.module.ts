import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/User.schema';
import { Profile, ProfileSchema } from './schemas/Profile.schema';
import { UsersService } from './services/users.service';
import { UserController } from './user.controller';
import { ProfileService } from './services/profile.service';
import { AuthService } from '../auth/auth.service';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Profile.name,
            schema: ProfileSchema
        }]),
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }]),
    ],
    controllers: [UserController],
    providers: [UsersService, ProfileService, AuthService],
    exports: [UsersService, ProfileService],
})
export class UsersModule {}
