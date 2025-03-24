import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/types/user.types';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
