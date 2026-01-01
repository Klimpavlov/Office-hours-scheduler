import {auth} from "@/lib/auth";

export async function requireUser() {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    return session.user
}

export async function RequireRole(roles:Array<"USER" | "SPECIALIST"| "ADMIN">) {
    const user = await requireUser();

    if (!roles.includes(user.role)) {
        throw new Error("Forbidden")
    }

    return user;
}