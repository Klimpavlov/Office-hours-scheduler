import { auth } from "@/lib/auth";
import {headers} from "next/headers";

export async function requireUser() {
  // const session = await auth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function RequireRole(
  roles: Array<"USER" | "SPECIALIST" | "ADMIN">,
) {
  const user = await requireUser();

  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}
