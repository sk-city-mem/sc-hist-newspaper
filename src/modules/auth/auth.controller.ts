import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  public search(@Body() loginDTO: LoginDTO) {
    return this.authService.signIn(loginDTO);
  }
}
