import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Query,
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
    let users = await this.cacheService.get('all-users');
    if (!users) {
      console.log('fetching from db');
      users = await this.usersService.get();
      await this.cacheService.set('all-users', users);
    }
    return { users: users };
  }

  // Get single user by id
  @Get('/')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  async getById(@Query('id') id: string) {
    let user = await this.cacheService.get(`user-${id}`);
    if (user) return user;
    user = await this.usersService.findById(+id);
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);
    await this.cacheService.set(`user-${id}`, user);
    return { user: user };
  }

  // Get single user by email
  @Get('/')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  async getByEmail(@Query('email') email: string) {
    let user = await this.cacheService.get(`user-${email}`);
    if (user) return user;
    user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException(`User with id: ${email} not found`);
    await this.cacheService.set(`user-${email}`, user);
    return { user: user };
  }
  

  // Create a new user
  @Post('/create-user')
  @HttpCode(201)
  async createUser(@Body() CreateUserDto: CreateUserDto) {
    const user = await this.usersService.findByEmail(CreateUserDto.email);
    if (user) throw new BadRequestException('Email already exists');
    return this.usersService.create(CreateUserDto);
  }
}
