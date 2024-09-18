import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../users/schemas/User.schema";
import mongoose, { now } from "mongoose";


@Schema()
export class Message {

    @Prop()
    text: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        isRequired: true,
        required: true
    })
    sender: User;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        isRequired: true,
        required: true
    })
    receipent: User;

    @Prop({default: now()})
    createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
