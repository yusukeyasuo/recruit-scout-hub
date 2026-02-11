"use server";

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/lib/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { AuthError } from "next-auth";

export type LoginResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Sign in with email and password
 */
export async function signIn(data: LoginInput): Promise<LoginResult> {
  try {
    // Validate input
    const validatedFields = loginSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "入力内容に誤りがあります",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    // Attempt to sign in
    await nextAuthSignIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    // Handle authentication errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "メールアドレスまたはパスワードが正しくありません",
          };
        default:
          return {
            success: false,
            error: "認証エラーが発生しました。もう一度お試しください。",
          };
      }
    }

    // Unexpected errors
    console.error("Login error:", error);
    return {
      success: false,
      error: "ログイン中にエラーが発生しました。もう一度お試しください。",
    };
  }
}

/**
 * Sign out
 */
export async function signOut() {
  await nextAuthSignOut({ redirect: false });
}
