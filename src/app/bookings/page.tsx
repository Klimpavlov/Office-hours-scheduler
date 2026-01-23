import { requireUser } from "@/lib/action";
import { listMyBookings } from "@/actions/booking";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export default async function MyBookingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    console.log(session)
    const bookings = await listMyBookings();

    if (bookings.length === 0) {
        return (
            <div className="p-6 text-muted-foreground">
                You don’t have any bookings yet.
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            {bookings.map((b) => (
                <div key={b.id} className="border rounded p-4">
                    <div>Status: {b.status}</div>
                    <div>
                        {new Date(b.startsAt).toLocaleString()} –{" "}
                        {new Date(b.endsAt).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
