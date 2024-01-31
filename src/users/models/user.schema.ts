import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument, UserRoles, UserStatuses } from 'src/common';

@Schema({ timestamps: true })
export class User extends AbstractDocument {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRoles })
  role: UserRoles;

  @Prop({ required: true, enum: UserStatuses })
  status: UserStatuses;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ _id: 1, status: 1 });
