import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Message } from './schemas/Message.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {

    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>
    ) {}

    async create(messageDto: CreateMessageDto) {
        const message = new this.messageModel(messageDto);
        return await message.save();
    }

    async getMessagesGroupedByUser(userId: string) {
        const objectId = new mongoose.Types.ObjectId(userId);

        return this.messageModel.aggregate([
            {
                // Match messages where the user is either the sender or the recipient
                $match: {
                    $or: [
                        { sender: objectId },
                        { receipent: objectId },
                    ],
                },
            },
            {
                // Group messages by the other user (i.e., the recipient if the user is the sender, or the sender if the user is the recipient)
                $group: {
                    _id: {
                        user: {
                            $cond: {
                                if: { $eq: ["$sender", objectId] },
                                then: "$receipent",
                                else: "$sender"
                            }
                        }
                    },
                    messages: {
                        $push: {
                            _id: "$_id",
                            text: "$text",
                            sender: "$sender",
                            receipent: "$receipent",
                            createdAt: "$createdAt"
                        }
                    }
                }
            },
            {
                // Populate the user information (the sender or recipient in the group)
                $lookup: {
                    from: 'users', // The 'users' collection
                    localField: '_id.user',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                // Simplify the structure by unwinding the userInfo
                $unwind: "$userInfo"
            },
            {
                // Optionally, sort messages by createdAt for each group
                $sort: { "messages.createdAt": 1 }
            },
            {
                // Project the necessary fields
                $project: {
                    user: {
                        _id: "$userInfo._id",
                        username: "$userInfo.username",
                        email: "$userInfo.email"
                    },
                    messages: 1
                }
            }
        ]).exec();
    }
}
