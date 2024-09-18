import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { AuthPayloadDto } from '../../auth/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../auth/auth.service';
import { RegisterPayloadDto } from '../../auth/dto/register.dto';
import { User } from '../schemas/User.schema';
import { Profile } from '../schemas/Profile.schema';
import { getZodiacSign } from '../../Utils';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
        private authService: AuthService
    ) {}

    async authenticate(payload: AuthPayloadDto) {
        const findUser = await this.findOneByEmailOrUsername(payload.username)
        if (!findUser) throw new HttpException({
            status: HttpStatus.UNAUTHORIZED,
            error: 'incorrect username or password'
        }, HttpStatus.UNAUTHORIZED);;

        const isAuth = await bcrypt.compare(payload.password, findUser.password);
        if (!isAuth) throw new HttpException({
            status: HttpStatus.UNAUTHORIZED,
            error: 'incorrect username or password'
        }, HttpStatus.UNAUTHORIZED);

        const secret = await this.authService.signUser({ username: findUser.username, id: findUser._id.toString() });

        return {
            accessToken: secret
        };
    }

    async register(payload: RegisterPayloadDto) {
        const findUser = await this.findOneByUsername(payload.username)

        if (findUser) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'User already registered'
        }, HttpStatus.BAD_REQUEST);

        if (payload.password !== payload.confirmPassword) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'Invalid confirm password'
        }, HttpStatus.BAD_REQUEST);

        const password = await bcrypt.hash(payload.password, 10)

        const result = await this.create({
            email: payload.email,
            password,
            username: payload.username,
        });

        const response = result.toObject();
        delete response.password;
        return response
    }

    create(userDto: CreateUserDto) {
        const result = new this.userModel(userDto);
        return result.save();
    }

    async findOneById(userId: string) {
        const result = await this.userModel.findById(userId).populate('profile');
        return result.toObject();
    }

    findOneByUsername(username: string) {
        const result = this.userModel.findOne({ username: username});

        return result;
    }

    findOneByEmailOrUsername(emailOrUsername: string) {
        return this.userModel.findOne({
            $or: [
                { username: emailOrUsername },
                { email: emailOrUsername },
            ],
        })
    }

    updateById(userId: string, updateUserDto: UpdateUserDto) {

        const result = this.userModel.findByIdAndUpdate(userId, {profile: updateUserDto});
        return result;
    }

    async updateUserProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        let model = this.userModel.findById(userId);
        const _user = await model;
        if (!_user) {
            throw new NotFoundException('User not found');
        }
        let user = await _user.populate('profile')
        let profile;
        if (user.profile) {
            // If the user already has a profile, update it
            const birthDate = new Date(updateProfileDto.birthDate)
            const birthSign = getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1, birthDate.getFullYear())
            if (birthSign.error) throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Invalid birth date'
            }, HttpStatus.BAD_REQUEST);

            const data = {
                ...updateProfileDto,
                horoscope: birthSign.horoscope,
                zodiac: birthSign.zodiac
            }
            profile = await this.profileModel.findByIdAndUpdate(user.profile, data, { new: true }).exec();
        } else {
            // If the user does not have a profile, create a new profile
            const birthDate = new Date(updateProfileDto.birthDate)
            const birthSign = getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1, birthDate.getFullYear())
            if (birthSign.error) throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Invalid birth date'
            }, HttpStatus.BAD_REQUEST);

            const data = {
                ...updateProfileDto,
                horoscope: birthSign.horoscope,
                zodiac: birthSign.zodiac
            }
            profile = new this.profileModel(data);
            await profile.save();

            // Associate the new profile with the user
            user.profile = profile._id;
        }

        user = await user.save();
        return {
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            profile: profile
        };
    }
}
