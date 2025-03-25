import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({
    type: String,
    required: false,
  })
  firebase_uid?: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({
    type: String,
    required: false,
  })
  password?: string;

  @Prop({
    type: String,
    trim: true,
  })
  name?: string;

  @Prop({
    type: String,
    required: false,
  })
  phone?: string;

  @Prop({ default: 'user' })
  role: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
