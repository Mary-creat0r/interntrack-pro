import { z } from 'zod';

// Recreate the schemas here for isolated testing
// This tests the schema logic independently of the route
const applicationSchema = z.object({
    company: z.string().min(1, 'Company is required').max(200),
    role: z.string().min(1, 'Role is required').max(200),
    status: z.enum(['APPLIED', 'INTERVIEW', 'ASSESSMENT', 'OFFER', 'REJECTED']),
    appliedDate: z.string().optional(),
    nextActionDate: z.string().nullable().optional(),
    notes: z.string().max(1000).optional(),
    jobUrl: z.string().url().nullable().optional()
});

const updateApplicationSchema = applicationSchema.partial();

describe('applicationSchema', () => {

    describe('when all required fields are valid', () => {
        it('accepts a valid application with required fields only', () => {
            const result = applicationSchema.safeParse({
                company: 'Google',
                role: 'Software Engineer Intern',
                status: 'APPLIED'
            });
            expect(result.success).toBe(true);
        });

        it('accepts a valid application with all fields', () => {
            const result = applicationSchema.safeParse({
                company: 'Google',
                role: 'Software Engineer Intern',
                status: 'INTERVIEW',
                appliedDate: '2026-03-01',
                nextActionDate: '2026-03-20',
                notes: 'Found on LinkedIn',
                jobUrl: 'https://careers.google.com/jobs/123'
            });
            expect(result.success).toBe(true);
        });
    });

    describe('when required fields are missing', () => {
        it('rejects when company is missing', () => {
            const result = applicationSchema.safeParse({
                role: 'Intern',
                status: 'APPLIED'
            });
            expect(result.success).toBe(false);
        });

        it('rejects when role is missing', () => {
            const result = applicationSchema.safeParse({
                company: 'Google',
                status: 'APPLIED'
            });
            expect(result.success).toBe(false);
        });

        it('rejects when status is missing', () => {
            const result = applicationSchema.safeParse({
                company: 'Google',
                role: 'Intern'
            });
            expect(result.success).toBe(false);
        });
    });

    describe('when field values are invalid', () => {
        it('rejects an empty company name', () => {
            const result = applicationSchema.safeParse({
                company: '',
                role: 'Intern',
                status: 'APPLIED'
            });
            expect(result.success).toBe(false);
        });

        it('rejects an invalid status value', () => {
            const result = applicationSchema.safeParse({
                company: 'Google',
                role: 'Intern',
                status: 'WHATEVER'
            });
            expect(result.success).toBe(false);
        });

        it('rejects a company name exceeding 200 characters', () => {
            const result = applicationSchema.safeParse({
                company: 'A'.repeat(201),
                role: 'Intern',
                status: 'APPLIED'
            });
            expect(result.success).toBe(false);
        });

        it('rejects notes exceeding 1000 characters', () => {
            const result = applicationSchema.safeParse({
                company: 'Google',
                role: 'Intern',
                status: 'APPLIED',
                notes: 'A'.repeat(1001)
            });
            expect(result.success).toBe(false);
        });

        it('rejects an invalid job URL', () => {
            const result = applicationSchema.safeParse({
                company: 'Google',
                role: 'Intern',
                status: 'APPLIED',
                jobUrl: 'not-a-valid-url'
            });
            expect(result.success).toBe(false);
        });
    });

    describe('accepts all valid status enum values', () => {
        const validStatuses = ['APPLIED', 'INTERVIEW', 'ASSESSMENT', 'OFFER', 'REJECTED'];

        validStatuses.forEach(status => {
            it(`accepts status: ${status}`, () => {
                const result = applicationSchema.safeParse({
                    company: 'Google',
                    role: 'Intern',
                    status
                });
                expect(result.success).toBe(true);
            });
        });
    });

});

describe('updateApplicationSchema', () => {

    describe('when used for partial updates', () => {
        it('accepts an empty object — all fields optional for updates', () => {
            const result = updateApplicationSchema.safeParse({});
            expect(result.success).toBe(true);
        });

        it('accepts updating only status', () => {
            const result = updateApplicationSchema.safeParse({
                status: 'INTERVIEW'
            });
            expect(result.success).toBe(true);
        });

        it('accepts updating only notes', () => {
            const result = updateApplicationSchema.safeParse({
                notes: 'Had phone interview, went well'
            });
            expect(result.success).toBe(true);
        });

        it('still rejects invalid status even in partial update', () => {
            const result = updateApplicationSchema.safeParse({
                status: 'INVALID'
            });
            expect(result.success).toBe(false);
        });
    });

});