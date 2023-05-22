import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Types, disconnect } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from '../src/review/reviews.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'test user',
  title: 'test title',
  description: 'test description',
  rating: 5,
  productId,
};

const loginDto: AuthDto = {
  login: 'SuperDen214@yandex.ru',
  password: '123',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    token = body.access_token;
  });

  it('/review/create (POST) = SUCCESS', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .set('Authorization', `Bearer ${token}`)
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined;
      });
  });

  it('/review/create (POST) = FAIL', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testDto, rating: 6 })
      .expect(400)
      .then(({ body }: request.Response) => {});
  });

  it('/review/byProduct/:productId (GET) = SUCCESS', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
      });
  });

  it('/review/byProduct/:productId (GET) = FAIL', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });

  it('/review/:id (DELETE) = SUCCESS', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/review/:id (DELETE) = FAIL', () => {
    return request(app.getHttpServer())
      .delete('/review/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${token}`)
      .expect(404, { statusCode: 404, message: REVIEW_NOT_FOUND });
  });

  afterAll(() => {
    disconnect();
  });
});
