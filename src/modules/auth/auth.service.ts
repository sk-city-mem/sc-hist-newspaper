import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(loginDTO: LoginDTO): Promise<any> {
    if (
      loginDTO.username !== this.configService.get('SUPERUSER_NAME') ||
      loginDTO.password !== this.configService.get('SUPERUSER_PASSWORD')
    ) {
      throw new UnauthorizedException();
    }

    // TODO: Generate a JWT and return it here
    // instead of the user object
    return {
      access_token: await this.jwtService.signAsync(loginDTO),
    };
  }
}
