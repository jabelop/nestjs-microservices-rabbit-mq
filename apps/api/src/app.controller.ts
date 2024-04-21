import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../../../libs/shared/src/domain/user/user';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject('AUTH_SERVICE') private readonly authService: ClientProxy) { }

  @Post('auth/signup')
  async signup(
    @Body() user: User
  ) {
    user.id = 1;
    try{
      return this.authService.send(
        {
          cmd: 'signup',
        },
        user
      );
    } catch (error) {
      console.info(" ******** error:  *********  ");
      console.error(error);
      return {success: false, error};
    }
    
  }

  @Post('auth/login')
  async login(
    @Body() user: User,
  ) {
    return this.authService.send(
      {
        cmd: 'login',
      },
      user
    );
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return this.authService.send(
      {
        cmd: 'get-user',
      },
      {id}
    );
  }
}
