import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold">Office Hours Scheduler</h1>
        <p className="text-muted-foreground max-w-md">
          Book time with specialists, manage availability, and schedule sessions.
        </p>

        <div className="flex gap-4">
          <Button asChild>
            <Link href="/specialists">Browse specialists</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/bookings">My bookings</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
