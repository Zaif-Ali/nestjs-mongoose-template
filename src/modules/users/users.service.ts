import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name, { timestamp: true });

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

  get() {
    this.logger.log('Getting all users');
    return this.userModel.find();
  }

  findById(id: number) {
    return this.userModel.findById(id);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(userDTO: CreateUserDto) {
    this.logger.log(`Creating user: ${userDTO.name}`);
    const newUser = new this.userModel(userDTO);
    await newUser.save();
    return newUser;
  }
}
