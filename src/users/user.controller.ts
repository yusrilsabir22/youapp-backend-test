import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { ResponseMessage } from '../response.decorator';
import { TransformInterceptor } from '../response.interceptor';
import { UsersService } from '../users/services/users.service';
import { UpdateUserDto } from '../users/dto/updateUser.dto';
import { RegisterPayloadDto } from '../auth/dto/register.dto';
import { AuthPayloadDto } from '../auth/dto/login.dto';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
class BaseResponse<T>  {
    statusCode: number;
    message: string;
    data: T;
}
const dataResponse: BaseResponse<{accessToken: string}> = {
    data: {accessToken: ''},
    message: '',
    statusCode: 200
}
@ApiTags("User")
@Controller()
@UseInterceptors(TransformInterceptor)
export class UserController {
    constructor(
        private profileService: ProfileService,
        private userService: UsersService
    ) { }

    @Post('/login')
    @ApiResponse({ status: 401, description: 'Forbidden.' })
    @ApiOkResponse({
        status: 200,
        description: 'User object with JWT token',
    })
    @ApiBody({
        type: AuthPayloadDto,
        description: 'Json structure for user object',
    })
    @ResponseMessage('Logged in successfully')
    @UsePipes(new ValidationPipe())
    async authenticate(@Body() payload: AuthPayloadDto) {
        const result = await this.userService.authenticate(payload);
        if (!result) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED)
        }
        return result
    }

    @Post('/register')
    @ResponseMessage('success register')
    @ApiBody({
        type: RegisterPayloadDto,
        description: 'Json structure for user object',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBadRequestResponse({description: 'Bad request'})
    @ApiOkResponse({
        description: 'User object with JWT token',
    })
    @UsePipes(new ValidationPipe())
    async register(@Body() payload: RegisterPayloadDto) {
        const result = await this.userService.register(payload);
        return result
    }

    @Post('/createProfile')
    @ApiBody({
        type: UpdateUserDto,
        description: 'Json structure for profile object',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiOkResponse({
        description: 'User object with JWT token',
    })
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @ResponseMessage('success create profile')
    createProfile(
        @Req() req: Request,
        @Body() payload: UpdateProfileDto
    ) {
        return this.userService.updateUserProfile(req.user.id, payload);
    }

    @Get('/getProfile')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiOkResponse({
        description: 'User object with JWT token',
    })
    @ResponseMessage('success get profile')
    getProfile(
        @Req() req: Request,
    ) {
        return this.profileService.findOneUserProfile(req.user.id);
    }

    @Get('/updateProfile')
    @ApiBody({
        type: UpdateUserDto,
        description: 'Json structure for profile object',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiOkResponse({
        description: 'User object with JWT token',
    })
    @UseGuards(JwtAuthGuard)
    @ResponseMessage('success update profile')
    updateProfile(
        @Req() req: Request,
        @Body() payload: UpdateProfileDto
    ) {
        return this.userService.updateUserProfile(req.user.id, payload);
    }
}
