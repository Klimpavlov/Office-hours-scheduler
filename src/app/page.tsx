import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {redirect} from "next/navigation";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-full max-w-3xl flex-col items-center gap-8 px-6 py-24 sm:items-start">
                <h1 className="text-4xl font-bold">Office Hours Scheduler</h1>
                <p className="max-w-md text-muted-foreground">
                    Book time with specialists, manage availability, and schedule sessions.
                </p>
                <div className="flex flex-wrap gap-4">
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
