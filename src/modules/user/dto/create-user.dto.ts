import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9._-]*$/, {
    message:
      'The nickname must contain only letters, numbers, underscores, dots and hyphens',
  })
  nickName: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: 'The first name is required' })
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'user', enum: ['user', 'admin'] })
  @IsOptional()
  @IsEnum(['user', 'admin'], { message: 'Invalid role, must be user or admin' })
  role?: string = 'user';

  @ApiProperty({ example: 'This is a bio' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'https://www.example.com/avatar.png' })
  @IsOptional()
  @IsString()
  avatar?: string;
}
