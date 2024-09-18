import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./User.schema";
import mongoose from "mongoose";

enum Gender {
    MALE,
    FEMALE
}

@Schema()
export class Profile {

    @Prop()
    about: string;

    @Prop()
    displayName: string;

    @Prop({type: String, enum: Gender})
    gender: Gender

    @Prop()
    birthDate: Date

    @Prop()
    horoscope: string;

    @Prop()
    zodiac: string;

    @Prop()
    weight: number

    @Prop()
    height: number
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
