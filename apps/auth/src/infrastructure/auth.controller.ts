import { Controller, Get, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { ClientProxy, Ctx, EventPattern, MessagePattern, RmqContext } from '@nestjs/microservices';
import { User } from '../../../../libs/shared/src/domain/user/user';

@Controller()
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService, @Inject('AUTH_SERVICE') private readonly rmqService: ClientProxy) { }
  
  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Ctx() context: RmqContext): Promise<User> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      channel.ack(message);
      return {username: "one", password: 'other'};//this.authService.validateUser(message.username, message.password);
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @MessagePattern({ cmd: 'login' })
  async login(@Ctx() context: RmqContext): Promise<string> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const data = JSON.parse(message.content.toString()).data;
      const receivedUser: User = { username: data.username, password: data.password };
      const result: any = await this.authService.login(receivedUser);
      channel.ack(message);

      if (!result) throw new HttpException('Incorrect user or password', HttpStatus.NOT_FOUND);
      return result.access_token;

    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }


  }

  @MessagePattern({
    cmd: 'signup',
  })
  async signup(@Ctx() context: RmqContext): Promise<boolean> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      console.info("message: ", message.content.toString());
      const data = JSON.parse(message.content.toString()).data;
      const receivedUser: User = { username: data.username, password: data.password };
      const result: boolean = await this.authService.save(receivedUser);
      channel.ack(message);
      
      if (result) return true;
      else return false;

      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    } catch (error) {
      return false;
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
