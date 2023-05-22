import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  USER_NOT_FOUND_ERROR,
  PASSWORD_IS_INCORRECT_ERROR,
} from '../src/auth/auth.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  login: 'SuperDen214@yandex.ru',
  password: '123',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  // let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // const { body } = await request(app.getHttpServer())
    //   .post('/auth/login')
    //   .send(loginDto);
    // token = body.access_token;
  });

  it('/auth/login (POST) = SUCCESS', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: 'SuperDen214@yandex.ru', password: '123' })
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) = FAIL(LOGIN)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: '', password: '123' })
      .expect(401, {
        statusCode: 401,
        message: USER_NOT_FOUND_ERROR,
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) = FAIL(PASSWORD)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: 'SuperDen214@yandex.ru', password: '' })
      .expect(401, {
        statusCode: 401,
        message: PASSWORD_IS_INCORRECT_ERROR,
        error: 'Unauthorized',
      });
  });

  afterAll(() => {
    disconnect();
  });
});
