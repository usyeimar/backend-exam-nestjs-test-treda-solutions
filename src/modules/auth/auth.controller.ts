import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/SignIn.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/public.decorator';
import { SignUpDto } from './dto/SignUp.dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Public()
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signIn(@Body() loginDto: SignInDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @Post('sign-up')
  @Public()
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  async signUp(@Body() signUp: SignUpDto) {
    return this.authService.signUp(signUp);
  }
}
