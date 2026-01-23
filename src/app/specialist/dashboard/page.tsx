import { requireUser } from "@/lib/action";

export default async function SpecialistDashboard() {
    const user = await requireUser();

    if (user.role !== "SPECIALIST") {
        return <div className="p-6">Access denied</div>;
    }

    return (
        <div className="p-6 space-y-8">
            <section>
                <h2 className="text-xl font-semibold">Availability rules</h2>
                <p className="text-muted-foreground">
                    Manage your weekly availability here.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold">Booking requests</h2>
                <p className="text-muted-foreground">
                    Incoming booking requests will appear here.
                </p>
            </section>
        </div>
    );
}
