import { jest } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import { registerUser } from '../controllers/authController.js';

jest.setTimeout(30000);

let mongoServer;

const app = express();
app.use(express.json());
app.post('/api/auth/register', registerUser);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('POST /api/auth/register', () => {
  it('should register a user with valid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Ramki', email: 'ramkimern@gmail.com', password: 'password' });

    console.log(res.body);  // For debugging response structure

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('ramkimern@gmail.com');
  });

  it('should fail for invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Ramki', email: 'ramkiabc.com', password: 'password' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid email');
  });
});
