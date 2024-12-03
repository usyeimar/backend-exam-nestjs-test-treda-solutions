import { CreateUserDto } from '../../user/dto/create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Match } from '../../../shared/decorators/match.decorator';

export class SignUpDto extends OmitType(CreateUserDto, ['role'] as const) {
  @ApiProperty({ example: 'John', required: true })
  @IsNotEmpty({ message: 'The firstName is required' })
  @IsString({ message: 'The firstName must be a string' })
  firstName: string;

  @ApiProperty({ example: 'Doe', required: true })
  @IsNotEmpty({ message: 'The lastName is required' })
  @IsString({ message: 'The lastName must be a string' })
  lastName: string;

  @ApiProperty({ example: 'Password123!', required: true })
  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  @Match('password', {
    message: 'The password and passwordConfirmation do not match',
  })
  passwordConfirmation: string;
}
