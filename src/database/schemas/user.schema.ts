import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { mongooseSchemaConfig } from '../mongoose-schema.config';
import { UserRole } from 'src/types/user.types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.consumer,
  })
  role: UserRole;
}

const UserSchema = SchemaFactory.createForClass(User);

mongooseSchemaConfig(UserSchema);

export { UserSchema };
