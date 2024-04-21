
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '../../../../libs/shared/src/config/jwt';
import { UserRepository } from '../../../../libs/shared/src/domain/user/user.repository';
import { User } from '../../../../libs/shared/src/domain/user/user';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) { }

  /**
   * validate an user
   * 
   * @param username the username
   * @param pass the password
   * 
   * @returns a Promise with the user data if the user is valid, with null if is not 
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.getUser(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * login a user in the app
   * 
   * @param user the user to login
   * 
   * @returns an object with the access token if the user data is correct, null if it is not 
   */
  async login(user: User): Promise<any> {
    const userDB: User = await this.userRepository.getUser(user.username);
    console.info("::::: User DB", userDB);
    if (userDB && user.password === userDB.password) {
      const payload = { username: userDB.username, id: userDB.id };
      return {
        access_token: this.jwtService.sign(payload, { secret: JWT_SECRET }),
      };
    }
    return null;

  }

  /**
   * save an user
   * 
   * @param user the user to save
   * 
   * @returns a Promise with true if the user was saved, false it there was an error
   */
  async save(user: User): Promise<boolean> {
    return await this.userRepository.saveUser(user);

  }
}
