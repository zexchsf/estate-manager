import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = Estate & Document;

@Schema()
export class Estate {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 10 }) // Free up to 10 members
  freeMemberLimit: number;

  @Prop({ default: [] })
  residents: string[]; // Array of user IDs

  @Prop({ required: true })
  ownerId: string; // Manager who created estate
}

export const EstateSchema = SchemaFactory.createForClass(Estate);
