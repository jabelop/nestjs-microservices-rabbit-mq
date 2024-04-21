import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../api/src/app.module';


describe('AuthController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should response 200 on POST /auth/login good data', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({username: "test1", password: "test1Password"})
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  it('should response 404 on POST /auth/login not existing data', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({username: "test11", password: "test11Password"})
      .then((response) => {
        expect(response.statusCode).toBe(404);
      });
  });
});
