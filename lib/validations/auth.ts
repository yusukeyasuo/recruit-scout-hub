import { z } from "zod";

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "パスワードは必須です"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register validation schema
export const registerSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(100, "名前は100文字以内で入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(100, "パスワードは100文字以内で入力してください"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Invite validation schema
export const inviteSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください")
    .toLowerCase()
    .trim(),
});

export type InviteInput = z.infer<typeof inviteSchema>;
