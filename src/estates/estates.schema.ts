import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EstateDocument = Estate & Document;

@Schema({
  timestamps: true
})
export class Estate {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 10 }) // Free up to 10 members
  freeMemberLimit: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  residents: Types.ObjectId[]; // Array of user IDs

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId; // Manager who created estate

  @Prop({ required: false }) // Optional location
  location?: string;
}

export const EstateSchema = SchemaFactory.createForClass(Estate);
