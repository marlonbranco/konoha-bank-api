import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('Banking flow - E2E test', () => {
    let app: NestFastifyApplication;

    beforeEach(async () => {

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

        await app.init();
        await app.getHttpAdapter().getInstance().ready();
    });
    it('should create accounts, make a deposit, transfer, withdrawal, check balance & statement', async () => {
        const account1 = await request(app.getHttpServer())
            .post('/accounts/create')
            .send({ name: 'Jane Doe', email: 'jane.doe@email.com' })
            .expect(201);

        const account2 = await request(app.getHttpServer())
            .post('/accounts/create')
            .send({ name: 'John Doe', email: 'john.doe@email.com' })
            .expect(201);

        await request(app.getHttpServer())
            .post('/transactions/deposit')
            .send({ email: 'jane.doe@email.com', amount: 100 })
            .expect(201);

        await request(app.getHttpServer())
            .post('/transactions/transfer')
            .send({ emailSender: 'jane.doe@email.com', emailReceiver: 'john.doe@email.com', amount: 50 })
            .expect(201);

        await request(app.getHttpServer())
            .post('/transactions/withdrawal')
            .send({ email: 'john.doe@email.com', amount: 50 })
            .expect(201);

        const balanceAccount1 = await request(app.getHttpServer())
            .get(`/accounts/${account1.body.id}/balance`)
            .expect(200);

        const balanceAccount2 = await request(app.getHttpServer())
            .get(`/accounts/${account2.body.id}/balance`)
            .expect(200);

        const statementAccount1 = await request(app.getHttpServer())
            .get(`/accounts/${account1.body.id}/statement`)
            .expect(200);

        const statementAccount2 = await request(app.getHttpServer())
            .get(`/accounts/${account2.body.id}/statement`)
            .expect(200);


        expect(balanceAccount1.body.balance).toBe(50);
        expect(balanceAccount2.body.balance).toBe(0);
        expect(statementAccount1.body).toStrictEqual([
            {
                "amount": "100",
                "transaction": {
                    "type": "DEPOSIT",
                    "sender": {
                        "name": "Jane Doe",
                        "email": "jane.doe@email.com"
                    },
                    "receiver": {
                        "name": "Jane Doe",
                        "email": "jane.doe@email.com"
                    }
                }
            },
            {
                "amount": "-50",
                "transaction": {
                    "type": "TRANSFER",
                    "sender": {
                        "name": "Jane Doe",
                        "email": "jane.doe@email.com"
                    },
                    "receiver": {
                        "name": "John Doe",
                        "email": "john.doe@email.com"
                    }
                }
            }
        ]);
        expect(statementAccount2.body).toStrictEqual([
            {
                "amount": "50",
                "transaction": {
                    "type": "TRANSFER",
                    "sender": {
                        "name": "Jane Doe",
                        "email": "jane.doe@email.com"
                    },
                    "receiver": {
                        "name": "John Doe",
                        "email": "john.doe@email.com"
                    }
                }
            },
            {
                "amount": "-50",
                "transaction": {
                    "type": "WITHDRAWAL",
                    "sender": {
                        "name": "John Doe",
                        "email": "john.doe@email.com"
                    },
                    "receiver": {
                        "name": "John Doe",
                        "email": "john.doe@email.com"
                    }
                }
            }
        ]);
    });

    afterAll(async () => {
        await app.close();
    });
});