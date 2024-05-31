import { z } from 'zod';

export const formSchema = z.object({
	foodName: z.string().min(3).max(50),
	macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
	pricePesos: z.string().min(0).max(10000),
	carbohydrates: z.string().min(0).max(10000),
	proteins: z.string().min(0).max(10000),
	fats: z.string().min(0).max(10000)
});

export type FormSchema = typeof formSchema;
