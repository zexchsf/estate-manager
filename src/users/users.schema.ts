import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string;

  @Prop()
  name?: string;

  @Prop()
  phone?: string;

  @Prop({ default: 'user' })
  role: string;

  _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
