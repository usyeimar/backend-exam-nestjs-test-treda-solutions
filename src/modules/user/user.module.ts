import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './user.service';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { User } from './entities/user.entity';
import { UsersController } from './user.controller';
import { ProfileController } from './profile.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, PasswordResetToken])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController, ProfileController],
})
export class UsersModule {}
