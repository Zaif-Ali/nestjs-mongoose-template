import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name, { timestamp: true });

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

  private users = [
    {
      id: 1,
      name: 'John Doe',
    },
    {
      id: 2,
      name: 'Emily Smith',
    },
  ];
  get() {
    this.logger.log('Getting all users');
    return this.userModel.find();
  }

  find(id: number) {
    return this.users.find((user) => user.id === id);
  }

  create(userDTO: { name: string }) {
    const newUser = { id: this.users.length + 1, name: userDTO.name };
    this.users.push(newUser);
    return newUser;
  }
}
