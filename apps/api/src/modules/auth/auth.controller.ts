import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { User } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    schema: { example: { access_token: 'jwt_token_here' } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  login(
    @Request() req: { user: Omit<User, 'password'> }, // Tipagem para req.user
    // loginDto é necessário para o LocalAuthGuard e Swagger, mesmo que não usado diretamente aqui.

    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(req.user);
  }
}
