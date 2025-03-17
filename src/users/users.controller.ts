import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  // inject the users service
  constructor(private readonly usersService: UsersService) {}

  // Expose the get method
  @Get('/')
  get() {
    return this.usersService.get();
  }
}
