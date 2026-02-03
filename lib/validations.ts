import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, "Email or Username is required"),
    password: z.string().min(1, "Password is required")
});

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export const createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
    isPublic: z.boolean().optional(),
    techStack: z.array(z.string()).optional()
});

export const updateProjectSchema = z.object({
    name: z.string().min(1, "Project name cannot be empty").optional(),
    description: z.string().optional(),
    isPublic: z.boolean().optional(),
    techStack: z.array(z.string()).optional()
});

export const challengeSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    points: z.number().int().positive(),
    tags: z.array(z.string()),
    starterCode: z.string(),
    testCases: z.array(z.object({
        input: z.string(),
        output: z.string(),
        isHidden: z.boolean().optional()
    }))
});

export const submissionSchema = z.object({
    challengeId: z.string(),
    code: z.string().min(1, "Code cannot be empty"),
    language: z.enum(["javascript", "python", "java", "cpp"]).default("javascript")
});

export const discussionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().optional(),
    projectId: z.string().optional(),
    type: z.enum(['project', 'community']),
    tags: z.array(z.string()).optional()
});

export const commentSchema = z.object({
    discussionId: z.string(),
    content: z.string().min(1, "Comment cannot be empty")
});

export const profileUpdateSchema = z.object({
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    skills: z.array(z.string()).max(10, "Maximum 10 skills").optional(),
    githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
    linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal(""))
});
