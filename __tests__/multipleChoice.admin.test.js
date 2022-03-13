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
  
describe('multiple-choice challenges', () => {

    // Add MC-questions
    describe('post multiple-choice route', () => {

        describe('given invalid MC-question body (no correct answer)', () => {
            it('should return 400', async () => {
                const validToken = jwt.sign({_id: random24BitHex}, process.env.TOKEN_SECRET, { expiresIn: '1m' });
                const question = {
                    question: 'How much is 1+1',
                    wrong: ['1', '3', '4'],
                    difficulty: 1
                }
                await supertest(app)
                .post('/multiple-choices/')
                .send(question)
                .set('auth-token', validToken)
                .expect(400);
            });
        });

        describe('given valid MC-question body', () => {
            it('should return 200', async () => {
                const validToken = jwt.sign({_id: random24BitHex}, process.env.TOKEN_SECRET, { expiresIn: '1m' });
                const question = {
                    question: 'How much is 1+1',
                    correct: '2',
                    wrong: ['1', '3', '4'],
                    difficulty: 1
                }
                await supertest(app)
                .post('/multiple-choices/')
                .send(question)
                .set('auth-token', validToken)
                .expect(200);
            });
        });
        
    });

    

    // Get all MC-questions
    describe('get multiple-choice route', () => {

        describe('given that no JWT-token is provided at all', () => {
            it('should return a 400', async () => {
                await supertest(app)
                .get('/multiple-choices/')
                .expect(400);
            });
        });

        describe('given the provided JWT-token is invalid', () => {
            it('should return a 400', async () => {
                const invalidToken = jwt.sign({_id: random24BitHex}, 'incorrectTokenSecret', { expiresIn: '1m' });
                await supertest(app)
                .get('/multiple-choices/')
                .set('auth-token', invalidToken)
                .expect(400);
            });
        });

        describe('given the provided JWT-token is valid', () => {
            it('should return a 200', async () => {
                const validToken = jwt.sign({_id: random24BitHex}, process.env.TOKEN_SECRET, { expiresIn: '1m' });
                const res = await supertest(app)
                .get('/multiple-choices/')
                .set('auth-token', validToken)
                .expect(200);
            });
        });
    });
});