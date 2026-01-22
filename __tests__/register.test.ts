import { POST } from '../app/api/auth/register/route';
import { createMocks } from 'node-mocks-http';
import mongoose from 'mongoose';

// Mock mongoose and bcrypt
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  models: { User: { findOne: jest.fn(), create: jest.fn() } },
  model: jest.fn(),
  Schema: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedpassword'),
}));

jest.mock('@/lib/db', () => jest.fn());

describe('Registration API', () => {
  it('should register a new user successfully', async () => {
    const body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
    const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(body)
    });

    const User = require('mongoose').models.User;
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: '123', username: 'testuser', email: 'test@example.com' });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toBe('User created successfully');
  });

  it('should return error if user already exists', async () => {
    const body = { username: 'existing', email: 'exist@example.com', password: 'password123' };
    const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(body)
    });

    const User = require('mongoose').models.User;
    User.findOne.mockResolvedValue({ _id: '456' });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe('User already exists');
  });
});
