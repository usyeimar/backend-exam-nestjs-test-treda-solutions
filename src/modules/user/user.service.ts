import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from './entities/user.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(PasswordResetToken)
    private readonly passwordResetTokenModel: typeof PasswordResetToken,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingEmail = await this.userModel.findOne({
        where: { email: createUserDto.email },
      });

      if (existingEmail) {
        throw new BadRequestException('Email already exists');
      }

      const existingNickname = await this.userModel.findOne({
        where: { nickName: createUserDto.nickName },
      });

      if (existingNickname) {
        throw new BadRequestException('Nickname already exists');
      }
      const hashedPassword = await this.hashPassword(createUserDto.password);
      if (!hashedPassword) {
        throw new InternalServerErrorException('Error hashing password');
      }
      createUserDto.password = hashedPassword;

      return await this.userModel.create({ ...createUserDto });
    } catch (error) {
      this.logger.error('Error creating user:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findAll(filters: FilterUsersDto) {
    try {
      const {
        search: rawSearch,
        role: rawRole,
        page: rawPage,
        limit: rawLimit,
        sortBy: rawSortBy,
        order: rawOrder,
      } = filters;

      const search = typeof rawSearch === 'string' ? rawSearch.trim() : '';
      const role = typeof rawRole === 'string' ? rawRole.trim() : undefined;
      const page = Number(rawPage) && rawPage > 0 ? Number(rawPage) : 1;
      const limit = Number(rawLimit) && rawLimit > 0 ? Number(rawLimit) : 10;

      const allowedSortFields = [
        'createdAt',
        'email',
        'nickName',
        'firstName',
        'lastName',
      ];
      const sortBy = allowedSortFields.includes(rawSortBy)
        ? rawSortBy
        : 'createdAt';
      const order =
        rawOrder === 'ASC' || rawOrder === 'DESC' ? rawOrder : 'DESC';

      const whereClause: any = {};

      if (search) {
        whereClause[Op.or] = [
          { nickName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (role) {
        whereClause.role = role;
      }

      this.logger.debug(`Where Clause: ${JSON.stringify(whereClause)}`);

      const { rows: users, count } = await this.userModel.findAndCountAll({
        where: whereClause,
        offset: (page - 1) * limit,
        limit,
        order: [[sortBy, order]],
        distinct: true,
      });

      return {
        items: users,
        meta: {
          totalItems: count,
          itemCount: users.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
        },
      };
    } catch (error) {
      this.logger.error('Error finding users:', error);
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  /**
   * Find user by email
   *
   * This method is used to find a user by email
   * @param email
   */
  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async findByNickname(nickname: string) {
    return this.userModel.findOne({ where: { nickName: nickname } });
  }

  /**
   * Find one user by id
   */
  async findOne(id: string) {
    try {
      const user = await this.userModel.findByPk(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(`Error finding user with id ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving user');
    }
  }

  /**
   * Update user
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);

      // Verificar email único si se está actualizando
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingEmail = await this.findByEmail(updateUserDto.email);
        if (existingEmail) {
          throw new BadRequestException('Email already exists');
        }
      }

      // Verificar nickname único si se está actualizando
      if (updateUserDto.nickName && updateUserDto.nickName !== user.nickName) {
        const existingNickname = await this.findByNickname(
          updateUserDto.nickName,
        );
        if (existingNickname) {
          throw new BadRequestException('Nickname already exists');
        }
      }

      await user.update(updateUserDto);

      return user;
    } catch (error) {
      this.logger.error(`Error updating user with id ${id}:`, error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }

  /**
   * Remove user
   */
  async remove(id: string) {
    try {
      const user = await this.findOne(id);
      await user.destroy();
      return { statusCode: 204 };
    } catch (error) {
      this.logger.error(`Error removing user with id ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error removing user');
    }
  }

  /**
   * Find one user by email
   */
  async findOneByEmail(email: string) {
    try {
      const user = await this.findByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(`Error finding user with email ${email}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving user');
    }
  }

  /**
   * Find one user by nickname
   */
  async findOneByNickName(nickname: string) {
    try {
      const user = await this.findByNickname(nickname);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(`Error finding user with nickname ${nickname}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving user');
    }
  }

  /**
   * Get user profile
   * @param user
   */
  async profile(user: User): Promise<User> {
    return user;
  }

  /**
   * Helper para hashear la contraseña
   * @param password
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust the number of salt rounds
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }
}
