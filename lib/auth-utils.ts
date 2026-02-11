import { auth } from "./auth";
import { redirect } from "next/navigation";

/**
 * Get the current server session
 * This is a server-side only function
 */
export async function getServerSession() {
  return await auth();
}

/**
 * Require authentication for a page/route
 * Redirects to login if not authenticated
 * This is a server-side only function
 */
export async function requireAuth() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  return session;
}

/**
 * Get the current user ID from session
 * Returns null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.user?.id ?? null;
}
