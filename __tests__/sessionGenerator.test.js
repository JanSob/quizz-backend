const supertest = require('supertest');
const createServer = require('../server.js');
require('jest-extended');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fireBaseAdminInit = require('../firebaseAdminInit');
const jwt = require('jsonwebtoken');

const app = createServer();
random24BitHex = "CFC9E4E2373A64F3E5660B09";
var validUserToken;

beforeAll( async () => {
    fireBaseAdminInit.initFirebaseAdmin();
    validUserToken = await fireBaseAdminInit.createTestUserToken();
    console.log(validUserToken);
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll( async () => {
    await mongoose.disconnect();
  });


// Populating the Database with 3 questions
describe('given valid MC-question body', () => {
    it('should return 200', async () => {
        const validToken = jwt.sign({_id: random24BitHex}, process.env.TOKEN_SECRET, { expiresIn: '1m' });
        const question1 = {
            question: 'How much is 2+1',
            correct: '2',
            wrong: ['1', '3', '4'],
            difficulty: 1
        }
        await supertest(app)
        .post('/multiple-choices/')
        .send(question1)
        .set('auth-token', validToken)
        .expect(200);
    });
});

describe('given valid MC-question body', () => {
    it('should return 200', async () => {
        const validToken = jwt.sign({_id: random24BitHex}, process.env.TOKEN_SECRET, { expiresIn: '1m' });
        const question2 = {
            question: 'How much is 2+1',
            correct: '3',
            wrong: ['1', '2', '4'],
            difficulty: 1
        }
        await supertest(app)
        .post('/multiple-choices/')
        .send(question2)
        .set('auth-token', validToken)
        .expect(200);
    });
});

describe('given valid MC-question body', () => {
    it('should return 200', async () => {
        const validToken = jwt.sign({_id: random24BitHex}, process.env.TOKEN_SECRET, { expiresIn: '1m' });
        const question3 = {
            question: 'How much is 3+1',
            correct: '4',
            wrong: ['1', '3', '2'],
            difficulty: 1
        }
        await supertest(app)
        .post('/multiple-choices/')
        .send(question3)
        .set('auth-token', validToken)
        .expect(200);
    });
});



// Session-generator tests
describe('session-generator', () => {
    describe('get session-generator route', () => {
        describe('given jwt-token is valid and the requested session-size is too large (more than 10)', () => {
            it('should return a 400', async () => {
                await supertest(app)
                .get('/session-generator/session')
                .set('auth-token', validUserToken)
                .query({ sessionSize: 11 })
                .expect(400);
            });
        });

        describe('given the jwt-token is valid and the requested session-size is 3', () => {
            it('should return a 200 and the body should be a json with an array of size 3', async () => {
                const res = await supertest(app)
                .get('/session-generator/session')
                .set('auth-token', validUserToken)
                .query({ sessionSize: 3 })
                .expect(200);
                expect(res.type).toEqual('application/json');
                expect(res.body).toBeArrayOfSize(3);
            });
        });
    });
});