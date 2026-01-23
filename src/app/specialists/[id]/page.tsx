export default async function SpecialistPage() {
    return (
        <div className="p-6 space-y-6">
            <section>
                <h1 className="text-2xl font-bold">Specialist profile</h1>
                <p className="text-muted-foreground">
                    Specialist details will appear here.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold">Available slots</h2>
                <p className="text-muted-foreground">
                    Slots for the next 14 days will appear here.
                </p>
            </section>
        </div>
    );
}
