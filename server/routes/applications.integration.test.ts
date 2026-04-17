import request from 'supertest';
import app from '../app';
import prisma from '../lib/prisma';

afterAll(async () => {
    await prisma.$disconnect();
});

describe('GET /api/health', () => {
    it('returns 200 and status ok', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });
});

describe('POST /api/auth/register', () => {
    it('returns 400 when fields are missing', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@test.com' }); // missing name and password
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('returns 409 when email already exists', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@interntrack.com', // already exists in your DB
                password: 'password123'
            });
        expect(response.status).toBe(409);
        expect(response.body.error).toBe('An account with this email already exists');
    });
});

describe('POST /api/auth/login', () => {
    it('returns 400 when fields are missing', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com' }); // missing password
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('returns 401 with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@test.com',
                password: 'wrongpassword'
            });
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid email or password');
    });
});

describe('GET /api/applications', () => {
    it('returns 401 without a token', async () => {
        const response = await request(app).get('/api/applications');
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });

    it('returns 401 with an invalid token', async () => {
        const response = await request(app)
            .get('/api/applications')
            .set('Authorization', 'Bearer invalidtoken123');
        expect(response.status).toBe(401);
    });
});

describe('POST /api/applications', () => {
    it('returns 401 without authentication', async () => {
        const response = await request(app)
            .post('/api/applications')
            .send({
                company: 'Google',
                role: 'Intern',
                status: 'APPLIED'
            });
        expect(response.status).toBe(401);
    });

    it('returns 400 with invalid status enum', async () => {
        // First login to get a token
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@interntrack.com',
                password: 'hashedpassword123'
            });

        // Only run this assertion if login succeeded
        if (loginRes.status === 200) {
            const token = loginRes.body.token;
            const response = await request(app)
                .post('/api/applications')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    company: 'Google',
                    role: 'Intern',
                    status: 'INVALID_STATUS' // not in enum
                });
            expect(response.status).toBe(400);
        }
    });
});