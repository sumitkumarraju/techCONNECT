import { challengeSchema } from '@/lib/validations';

describe('Validation Schemas', () => {
    describe('challengeSchema', () => {
        it('should validate correct input with lowercase difficulty', () => {
            const result = challengeSchema.safeParse({
                title: 'Two Sum',
                description: 'Add two numbers',
                difficulty: 'easy',
                points: 10,
                tags: ['array'],
                starterCode: 'function sum(a, b) { return a + b; }',
                testCases: [{ input: '[1, 2]', output: '3' }]
            });
            expect(result.success).toBe(true);
        });

        it('should fail with capitalized difficulty', () => {
            const result = challengeSchema.safeParse({
                title: 'Two Sum',
                description: 'Add two numbers',
                difficulty: 'Easy',
                points: 10,
                tags: ['array'],
                starterCode: 'function sum(a, b) { return a + b; }',
                testCases: [{ input: '[1, 2]', output: '3' }]
            });
            expect(result.success).toBe(false);
        });

        it('should fail with invalid difficulty', () => {
            const result = challengeSchema.safeParse({
                title: 'Two Sum',
                description: 'Add two numbers',
                difficulty: 'extreme',
                points: 10,
                tags: ['array'],
                starterCode: 'function sum(a, b) { return a + b; }',
                testCases: [{ input: '[1, 2]', output: '3' }]
            });
            expect(result.success).toBe(false);
        });
    });
});
