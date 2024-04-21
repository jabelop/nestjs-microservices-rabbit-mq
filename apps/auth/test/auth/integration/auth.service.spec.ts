import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../../../../libs/shared/src/domain/user/user.repository';
import { UserRepositoryMongoose } from '../../../src/infrastructure/db/mongo/user.repository';
import { AuthService } from '../../../src/application/auth.service';
import { AuthModule } from '../../../src/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
const usersRepositoryProvider = {provide: UserRepository, useClass: UserRepositoryMongoose};

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ MongooseModule.forRoot(`mongodb://${env.DB_HOST_TEST}/${env.DB_NAME_TEST}`), AuthModule],
      providers: [JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save an user', async () => {
    expect(await userRepository.saveUser({id: 0, username: "test13", password: "test1test13Password"})).toBe(true);
  });

  it('should login an existing user', async () => {
    expect(await userRepository.getUser("test13")).toBeTruthy();
    
  });

  afterAll(async () => await userRepository.deleteUser(0));
});
