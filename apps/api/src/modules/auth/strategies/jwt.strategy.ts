import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserService } from '../../user/user.service';
// Reflector não é mais necessário aqui, pois a lógica de @Public é tratada no JwtAuthGuard.
// import { Reflector } from '@nestjs/core';
// import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    // private readonly reflector: Reflector, // Removido
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // Removido async já que não há await dentro desta função como está.
  // Se você descomentar a busca de usuário, adicione async de volta.
  validate(payload: { sub: string; email: string }) {
    // O payload aqui é o que foi assinado no token JWT (id do usuário e email)
    // Você pode querer buscar o usuário no banco de dados aqui para adicionar mais informações ao objeto request.user
    // Exemplo:
    // const user = await this.userService.findById(payload.sub);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // const { password, ...result } = user;
    // return result;
    return { userId: payload.sub, email: payload.email };
  }
}
