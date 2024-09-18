import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Profile } from "./Profile.schema";

@Schema()
export class User {

    @Prop({unique: true})
    email: string;

    @Prop({unique: true})
    username: string;

    @Prop()
    password: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: false,
        isRequired: false
    })
    profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
