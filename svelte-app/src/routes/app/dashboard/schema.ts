import { z } from 'zod';

export const formSchema = z.object({
	foodName: z.string().min(3).max(50),
	macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
});

export type FormSchema = typeof formSchema;
