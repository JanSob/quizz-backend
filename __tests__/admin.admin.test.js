const supertest = require('supertest');
const dbConnectAndListen = require('../mongoDBInit.js');
const createServer = require('../server.js');
const jwt = require('jsonwebtoken');
require('jest-extended');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = createServer();
random24BitHex = "CFC9E4E2373A64F3E5660B09";

beforeAll( async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

  
afterAll( async () => {
    await mongoose.disconnect();
});

  
describe('admin', () => {

    //ADMIN - REGISTER
    describe('admin-route register', () => {

        describe('given invalid JWT-token', () => {
            it('should return 400', async () => {
                const invalidToken = jwt.sign({_id: random24BitHex}, 'incorrectTokenSecret', { expiresIn: '1m' });
                await supertest(app)
                .post('/admin/register')
                .set('auth-token', invalidToken)
                .expect(400);
            });
        });

        describe('given valid JWT-token but invalid email-format', () => {
            it('should return 400', async () => {
                const validToken = jwt.sign({_id: random24BitHex}, process.env.TOKEN_SECRET, { expiresIn: '1m' });
                const body = {
                    email: 'testATgmail.com',
                    password: '191919191919191919'
                };
                await supertest(app)
                .post('/admin/register')
                .set('auth-token', validToken)
                .send(body)
                .expect(400);
            });
        });

        describe('given valid JWT-token but invalid password (too short)', () => {
            it('should return 400', async () => {
                const validToken = jwt.sign({_id: random24BitHex}, process.env.TOKEN_SECRET, { expiresIn: '1m' });
                const body = {
                    email: 'test@gmail.com',
                    password: '1234'
                };
                await supertest(app)
                .post('/admin/register')
                .set('auth-token', validToken)
                .send(body)
                .expect(400);
            });
        });

        describe('given valid JWT-token and valid registration-details', () => {
            it('should return 200', async () => {
                const validToken = jwt.sign({_id: random24BitHex}, process.env.TOKEN_SECRET, { expiresIn: '1m' });
                const body = {
                    email: 'test@gmail.com',
                    password: '191919191919191919'
                };
                await supertest(app)
                .post('/admin/register')
                .set('auth-token', validToken)
                .send(body)
                .expect(200);
            });
        });
    });


    // ADMIN - LOGIN
    describe('admin-route login', () => {

        describe('given no login-credentials at all', () => {
            it('should return a 400 and have no auth-token header', async () => {
                const res = await supertest(app)
                .post('/admin/login')
                .expect(400);
                expect(res.header).not.toHaveProperty('auth-token');
            });
        });

        describe('given no email', () => {
            it('should return a 400 and have no auth-token header', async () => {
                const body = {password: '123456789123456789'};
                const res = await supertest(app)
                .post('/admin/login')
                .send(body)
                .expect(400);
                expect(res.header).not.toHaveProperty('auth-token');
            });
        });

        describe('given no password', () => {
            it('should return a 400 and have no auth-token header', async () => {
                const body = {email: 'test@gmail.com'};
                const res = await supertest(app)
                .post('/admin/login')
                .send(body)
                .expect(400);
                expect(res.header).not.toHaveProperty('auth-token');
            });
        });

        describe('given incorrect password', () => {
            it('should return a 400 and have no auth-token header', async () => {
                const body = {
                    email: 'test@gmail.com',
                    password: 'wrongpasswordforcertain'
                };
                const res = await supertest(app)
                .post('/admin/login')
                .send(body)
                .expect(400);
                expect(res.header).not.toHaveProperty('auth-token');
            });
        });

        describe('given incorrect email', () => {
            it('should return a 400 and have no auth-token header', async () => {
                const body = {
                    email: 'wrongemail@gmail.com',
                    password: '191919191919191919'
                };
                const res = await supertest(app)
                .post('/admin/login')
                .send(body)
                .expect(400);
                expect(res.header).not.toHaveProperty('auth-token');
            });
        });

        describe('given correct credentials', () => {
            it('should return a 200 and a signed jwt-token in header auth-token', async () => {
                const body = {
                    email: 'test@gmail.com',
                    password: '191919191919191919'
                };
                const res = await supertest(app)
                .post('/admin/login')
                .send(body)
                .expect(200);
                expect(res.header).toHaveProperty('auth-token');
            });
        });

    });

    
});