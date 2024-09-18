import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/User.schema';
import { Profile } from '../schemas/Profile.schema';
import { AuthService } from '../../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';

const mockUser = {
    _id: 'mockUserId',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
    profile: null
};

const mockProfile = {
    _id: 'mockProfileId',
    displayName: 'Test Profile',
    gender: 'MALE',
    birthDate: new Date()
};

const mockAuthService = {
    signUser: jest.fn().mockReturnValue('mockToken'),
};

describe('UsersService', () => {
    let service: UsersService;
    let userModel: any;
    let profileModel: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel(),
                },
                {
                    provide: getModelToken(Profile.name),
                    useValue: mockProfileModel(),
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService(),
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userModel = module.get(getModelToken(User.name));
        profileModel = module.get(getModelToken(Profile.name));
    });

    // Mock User model with constructor and methods
    function mockUserModel() {
        return {
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            constructor: jest.fn(), // Mocks the User constructor
            create: jest.fn(),
            save: jest.fn(), // Mock save method on instance
        };
    }

    // Mock Profile model
    function mockProfileModel() {
        return {
            findByIdAndUpdate: jest.fn(),
            save: jest.fn(),
        };
    }

    // Mock AuthService
    function mockAuthService() {
        return {
            signUser: jest.fn().mockResolvedValue('mockToken'),
        };
    }

    describe('authenticate', () => {
        it('should authenticate a user with correct credentials', async () => {
            jest.spyOn(service, 'findOneByEmailOrUsername').mockResolvedValue(mockUser as any);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

            const result = await service.authenticate({ username: 'testuser', password: 'password' });

            expect(service.findOneByEmailOrUsername).toHaveBeenCalledWith('testuser');
            expect(result).toEqual({ accessToken: 'mockToken' });
        });

        it('should throw an exception if username or password is incorrect', async () => {
            jest.spyOn(service, 'findOneByEmailOrUsername').mockResolvedValue(null);

            await expect(service.authenticate({ username: 'wronguser', password: 'password' }))
                .rejects
                .toThrow(HttpException);
        });
    });

    describe('register', () => {
        // it('should register a new user successfully', async () => {
        //     const mockUser = {
        //         _id: 'mockUserId',
        //         email: 'test@example.com',
        //         username: 'testuser',
        //         save: jest.fn().mockResolvedValue({
        //             _id: 'mockUserId',
        //             email: 'test@example.com',
        //             username: 'testuser',
        //         }),
        //     };

        //     // Mock bcrypt hashing
        //     jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
        //     // Mock findOne to simulate no existing user
        //     jest.spyOn(service, 'findOneByUsername').mockResolvedValue(null);

        //     // Mock userModel constructor behavior
        //     userModel.constructor.mockImplementation(() => mockUser);

        //     const result = await service.register({
        //         email: 'test@example.com',
        //         username: 'testuser',
        //         password: 'password',
        //         confirmPassword: 'password',
        //     });

        //     expect(service.findOneByUsername).toHaveBeenCalledWith('testuser');
        //     expect(result).toEqual({
        //         _id: 'mockUserId',
        //         email: 'test@example.com',
        //         username: 'testuser',
        //     });
        // });

        it('should throw an error if passwords do not match', async () => {
            await expect(service.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password',
                confirmPassword: 'wrongpassword',
            })).rejects.toThrow(HttpException);
        });

        it('should throw an error if user is already registered', async () => {
            jest.spyOn(service, 'findOneByUsername').mockResolvedValue(mockUser as any);

            await expect(service.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password',
                confirmPassword: 'password',
            })).rejects.toThrow(HttpException);
        });
    });

    describe('updateUserProfile', () => {
        // it('should update the user profile if user has a profile', async () => {
        //     jest.spyOn(userModel, 'findById').mockResolvedValue({ ...mockUser, profile: 'mockProfileId' });
        //     jest.spyOn(profileModel, 'findByIdAndUpdate').mockResolvedValue(mockProfile);

        //     const result = await service.updateUserProfile('mockUserId', { 'displayName': 'test' });

        //     expect(profileModel.findByIdAndUpdate).toHaveBeenCalledWith('mockProfileId', { profile: 'mockProfileId' }, { new: true });
        //     expect(result).toEqual(mockUser);
        // });

        // it('should create a new profile if user does not have one', async () => {
        //     jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser);
        //     jest.spyOn(profileModel, 'save').mockResolvedValue(mockProfile);

        //     const result = await service.updateUserProfile('mockUserId', { 'displayName': 'test' });

        //     expect(profileModel.save).toHaveBeenCalled();
        //     expect(result.profile).toEqual(mockProfile._id);
        // });

        it('should throw an exception if user is not found', async () => {
            jest.spyOn(userModel, 'findById').mockResolvedValue(null);

            await expect(service.updateUserProfile('invalidUserId', { 'displayName': 'test' }))
                .rejects
                .toThrow(NotFoundException);
        });
    });

    describe('findOneByEmailOrUsername', () => {
        it('should return user if found by email or username', async () => {
            jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);

            const result = await service.findOneByEmailOrUsername('testuser');

            expect(userModel.findOne).toHaveBeenCalledWith({
                $or: [
                    { username: 'testuser' },
                    { email: 'testuser' },
                ],
            });
            expect(result).toEqual(mockUser);
        });
    });
});
