import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getZodiacSign } from '../../Utils';
import { UsersService } from '../../users/services/users.service';
import * as moment from 'moment';
import { ProfilePayloadDto } from '../dto/create-profile.dto';
import { Profile } from '../schemas/Profile.schema';

enum Gender {
    MALE,
    FEMALE
}

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
        private usersService: UsersService
    ) {}

    async create(profilePayloadDto: ProfilePayloadDto) {
        const birthDate = new Date(profilePayloadDto.birthDate)
        const birthSign = getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1, birthDate.getFullYear())
        if (birthSign.error) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'Invalid birth date'
        }, HttpStatus.BAD_REQUEST);

        const data = {
            ...profilePayloadDto,
            horoscope: birthSign.horoscope,
            zodiac: birthSign.zodiac
        }
        console.log(data)
        const schema = new this.profileModel(data);
        const result = await schema.save();
        return true;
    }

    findOneById(userId: string) {
        const result = this.profileModel.findById(userId);
        return result;
    }

    async findOneUserProfile(userId: string) {
        const result = await this.usersService.findOneById(userId);

        return result && {
            username: result.username,
            email: result.email,
            profile: result.profile && {
                about: result.profile.about || null,
                displayName: result.profile.displayName || null,
                gender: result.profile?.gender?.toString() === '0' ? 'Male' : result.profile.gender?.toString() === "1" ? 'Female' : null,
                birthDate: result.profile.birthDate ? moment(result.profile.birthDate).format('YYYY-MM-DD') : null,
                weight: result.profile.weight || null,
                height: result.profile.height || null,
                horoscope: result.profile.horoscope || null,
                zodiac: result.profile.zodiac || null,
            } || null
        } || null;
    }
}
