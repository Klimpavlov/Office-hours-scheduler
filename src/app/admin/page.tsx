import { requireUser } from "@/lib/action";
import {
  listUsersForAdmin,
  listAllBookingsForAdmin,
} from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PromoteButton } from "./promote-button";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await requireUser().catch(() => null);
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") {
    return (
      <div className="p-6">
        <p className="text-destructive">Access denied. Admin only.</p>
      </div>
    );
  }

  const [users, bookings] = await Promise.all([
    listUsersForAdmin(),
    listAllBookingsForAdmin(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Admin</h1>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Users</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {/*<PromoteButton userId={u.id} isSpecialist={u.isSpecialist} />*/}
                      {u.role === "ADMIN" ? (
                          <span className="text-muted-foreground text-xs">—</span>
                      ) : (
                          <PromoteButton userId={u.id} isSpecialist={u.isSpecialist} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">All bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-muted-foreground">No bookings.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <Card key={b.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{b.status}</Badge>
                    <Badge
                      variant={
                        b.moderationStatus === "FLAGGED"
                          ? "destructive"
                          : b.moderationStatus === "APPROVED"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {b.moderationStatus}
                    </Badge>
                    {b.moderationReviewedAt && (
                      <span className="text-xs text-muted-foreground">
                        Reviewed
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>
                    User: {b.userName ?? b.userId} · {new Date(b.startsAt).toLocaleString()} –{" "}
                    {new Date(b.endsAt).toLocaleString()}
                  </p>
                  {b.moderationReason && (
                    <p className="text-muted-foreground">
                      Moderation: {b.moderationReason}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
