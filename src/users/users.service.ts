import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  get() {
    return 'users';
  }
}
