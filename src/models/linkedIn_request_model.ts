import z from 'zod';

const linkedInRequestSchema = z.object({
    roastLevel: z.string().min(0).max(3).default('3'),
    role: z.string().optional().default('0'),
    language: z.string().optional().default('2'),
    meme: z.string().optional().default("false"),
    linkedProfile: z.string(),
});
export default linkedInRequestSchema;