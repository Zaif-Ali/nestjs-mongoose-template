import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { mongooseSchemaConfig } from '../mongoose-schema.config';
import { UserGender, UserRole } from 'src/types/user.types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({
    type: String,
    enum: Object.values(UserGender),
    default: UserGender.other,
  })
  gender: UserGender;

  @Prop({
    type: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      postalCode: String,
      fullAddress: { type: String, required: true },
    },
  })
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    postalCode?: string;
    fullAddress: string;
  };

  @Prop({ type: Date, required: true })
  loginAt: Date;

  @Prop({ default: true })
  isFirstLogin: boolean;

  @Prop({ required: true })
  agent: string;

  @Prop()
  ip?: string;

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
