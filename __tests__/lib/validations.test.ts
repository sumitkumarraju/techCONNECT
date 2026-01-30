import { loginSchema, registerSchema, createProjectSchema, challengeSchema } from '@/lib/validations';

describe('Validation Schemas', () => {
    describe('loginSchema', () => {
        it('should validate correct input', () => {
            const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' });
            expect(result.success).toBe(true);
        });

        it('should fail with empty fields', () => {
            const result = loginSchema.safeParse({ email: '', password: '' });
            expect(result.success).toBe(false);
        });
    });

    describe('registerSchema', () => {
        it('should validate correct input', () => {
            const result = registerSchema.safeParse({
                name: 'Test User',
                username: 'test_user',
                email: 'test@example.com',
                password: 'password123'
            });
            expect(result.success).toBe(true);
        });

        it('should fail if passwords short', () => {
            const result = registerSchema.safeParse({
                name: 'Test User',
                username: 'test_user',
                email: 'test@example.com',
                password: '123'
            });
            expect(result.success).toBe(false);
        });

        it('should fail if username contains special chars', () => {
            const result = registerSchema.safeParse({
                name: 'Test User',
                username: 'test user!',
                email: 'test@example.com',
                password: 'password123'
            });
            expect(result.success).toBe(false);
        });
    });

    describe('createProjectSchema', () => {
        it('should validate correct input', () => {
            const result = createProjectSchema.safeParse({
                name: 'My Project',
                description: 'A cool project',
                isPublic: true,
                techStack: ['React', 'Node']
            });
            expect(result.success).toBe(true);
        });

        it('should fail without name', () => {
            const result = createProjectSchema.safeParse({
                description: 'A cool project',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('challengeSchema', () => {
        it('should validate correct input with lowercase difficulty', () => {
            const result = challengeSchema.safeParse({
                title: 'Challenge 1',
                description: 'Desc',
                difficulty: 'easy',
                points: 100,
                tags: ['JS'],
                starterCode: 'code',
                testCases: []
            });
            expect(result.success).toBe(true);
        });

        it('should fail with capitalized difficulty', () => {
            const result = challengeSchema.safeParse({
                title: 'Challenge 1',
                description: 'Desc',
                difficulty: 'Easy',
                points: 100,
                tags: ['JS'],
                starterCode: 'code',
                testCases: []
            });
            expect(result.success).toBe(false);
        });
    });
});
