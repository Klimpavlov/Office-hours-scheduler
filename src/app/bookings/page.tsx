import { requireUser } from "@/lib/action";
import { listMyBookings } from "@/actions/booking";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextContent } from "@/components/rich-text-content";
import { CancelBookingButton } from "./cancel-button";
import type { TiptapDoc } from "@/lib/rich-text";

export default async function MyBookingsPage() {
  const user = await requireUser().catch(() => null);
  if (!user) redirect("/sign-in");

  const bookings = await listMyBookings();

  if (bookings.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">My bookings</h1>
        <p className="mt-4 text-muted-foreground">You don’t have any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">My bookings</h1>
      <div className="space-y-4">
        {bookings.map((b) => (
          <Card key={b.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Badge variant={b.status === "APPROVED" ? "default" : "secondary"}>
                {b.status}
              </Badge>
              {["REQUESTED", "APPROVED"].includes(b.status) && (
                <CancelBookingButton bookingId={b.id} />
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {new Date(b.startsAt).toLocaleString()} –{" "}
                {new Date(b.endsAt).toLocaleString()}
              </p>
              {b.descriptionJson && (
                <div className="rounded border bg-muted/30 p-3 text-sm">
                  <RichTextContent doc={b.descriptionJson as TiptapDoc} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
