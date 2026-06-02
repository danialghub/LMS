import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("آدرس ایمیل نامعتبر است")
  .min(1);

export const passwordSchema = z.string().trim().min(1);

const UserRoleEnumSchema = z.enum(['student', 'instructor']).transform(val => val.trim());

const instructorProfileSchema = z.object({
  major: z.string().optional(),
  bio: z.string().optional(),
}).optional();

export const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: emailSchema,
  password: passwordSchema,
  avatar: z.string().optional(),
  role: UserRoleEnumSchema,
  instructorProfile: instructorProfileSchema
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  role: UserRoleEnumSchema
});

