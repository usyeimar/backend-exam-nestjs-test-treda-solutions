import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { SignUpDto } from './dto/SignUp.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  /**
   * Iniciar sesión
   *
   * Realiza la autenticación del usuario utilizando las credenciales proporcionadas,
   * busca el usuario por el correo electrónico y valida la contraseña, si todo es correcto
   * se genera un token de acceso (JWT) y se retorna en la respuesta encapsulada en un objeto
   *
   * @param email
   * @param password
   */
  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    this.logger.log('User: ', JSON.stringify(user));
    if (!user) {
      throw new NotFoundException(
        'No user found with the provided email address',
      );
    }

    const passworsIsValid = await bcrypt.compare(password, user.password);

    if (!passworsIsValid) {
      throw new UnauthorizedException(
        'La contraseña es incorrecta, verifique e intente nuevamente',
      );
    }

    console.log('Password is valid: ', passworsIsValid);

    if (!passworsIsValid) {
      throw new UnauthorizedException(
        'Password is incorrect, check and try again.',
      );
    }
    //generate the token
    const token = this.generateToken(user);

    //return the response
    return {
      code: 200,
      message: 'Successful login',
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        nickName: user.nickName,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  /**
   * Registrarse
   *
   * Registro de un nuevo usuario
   * @param input
   */
  async signUp(input: SignUpDto) {
    this.logger.log('Input: ', JSON.stringify(input));
    try {
      const { email, nickName } = input;

      await this.checkUserExists(email, nickName);

      //create user

      const newUser = await this.usersService.create(input);

      const token = this.generateToken(newUser);

      return {
        code: 200,
        message: 'User registered successfully',
        success: true,
        token,
      };
    } catch (error) {
      this.logger.error('Error registering user:', error);
      throw new UnprocessableEntityException(error.message);
    }
  }

  /**
   * Verify token
   *
   * Verificar la validez de un token
   * @param token
   * @param clockTolerance
   */
  verifyToken(token: string, clockTolerance = 60) {
    const decoded = this.jwtService.verify(token, {
      clockTolerance: clockTolerance,
    });

    const user = this.usersService.findByEmail(decoded.email);

    if (!user) {
      throw new BadRequestException(
        'The user associated with the token does not exist',
      );
    }
    return user;
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      ...user,
      role: user.role,
      sub: user.id,
    });
  }

  private async checkUserExists(
    email: string,
    nickname: string,
  ): Promise<void> {
    const userByEmail = await this.usersService.findByEmail(email);
    if (userByEmail) {
      throw new BadRequestException(
        'There is already a user with the provided email address',
      );
    }

    const userByNickname = await this.usersService.findByNickname(nickname);
    if (userByNickname) {
      throw new BadRequestException(
        'There is already a user with the provided nickname',
      );
    }
  }
}
