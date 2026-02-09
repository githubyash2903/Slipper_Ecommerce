import { z } from 'zod';

// 1. Profile Update Schema (Name & Phone)
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
});

// 2. Address Add Schema
export const addressSchema = z.object({
  name: z.string().min(1, "Label is required (e.g. Home, Work)"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(4, "Zip Code is required"),
  isDefault: z.boolean().optional(), 
});