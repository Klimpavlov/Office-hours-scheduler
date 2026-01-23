import { requireUser } from "@/lib/action";

export default async function AdminPage() {
    const user = await requireUser();

    if (user.role !== "ADMIN") {
        return <div className="p-6">Access denied</div>;
    }

    return (
        <div className="p-6 space-y-8">
            <section>
                <h2 className="text-xl font-semibold">Users</h2>
                <p className="text-muted-foreground">
                    Promote users to specialists.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold">All bookings</h2>
                <p className="text-muted-foreground">
                    View all bookings and moderation info.
                </p>
            </section>
        </div>
    );
}
