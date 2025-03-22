import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { RedisCacheService } from 'src/shared/services/redis-cache.service';
import { EmailService } from 'src/queues/email/email.service';

@Controller('users')
export class UsersController {
  // inject the users service
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ApiConfigService,
    private readonly cacheService: RedisCacheService,
    private readonly emailService: EmailService,
  ) {}

  // Get all the users
  @Get('/')
  @HttpCode(200)
  async get() {
    await this.emailService.sendEmail(
      'huzaifa@artemamed.com',
      'test',
      'welcome',
      {
        name: 'Huzaifa',
      },
    );
    let users = await this.cacheService.get('all-users');
    if (!users) {
      console.log('fetching from db');
      users = await this.usersService.get();
      await this.cacheService.set('all-users', users);
    }
    return { users: users };
  }

  // Get single user by id
  @Get('/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  async getById(@Param('id') id: string) {
    let user = await this.cacheService.get(`user-${id}`);
    if (user) return user;
    user = this.usersService.find(+id);
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);
    await this.cacheService.set(`user-${id}`, user);
    return { user: user };
  }

  // Create a new user
  @Post('/create-user')
  @HttpCode(201)
  createUser(@Body() CreateUserDto: CreateUserDto) {
    return this.usersService.create({ name: CreateUserDto.name });
  }
}
