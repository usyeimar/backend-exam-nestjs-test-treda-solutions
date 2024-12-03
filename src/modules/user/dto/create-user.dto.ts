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
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  password: string;

  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9._-]*$/, {
    message:
      'El nickname solo puede contener letras, números, puntos, guiones y guiones bajos',
  })
  nickName: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'user', enum: ['user', 'admin'] })
  @IsOptional()
  @IsEnum(['user', 'admin'], { message: 'El rol debe ser user o admin' })
  role?: string = 'user';
}
