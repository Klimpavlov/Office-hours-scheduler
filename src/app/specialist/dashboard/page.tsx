import { requireUser } from "@/lib/action";
import { listMyAvailabilityRules } from "@/actions/availability";
import { listSpecialistBookings } from "@/actions/booking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextContent } from "@/components/rich-text-content";
import { AvailabilityForm } from "./availability-form";
import { RuleDeleteButton } from "./rule-delete-button";
import { RequestActions } from "./request-actions";
import type { TiptapDoc } from "@/lib/rich-text";
import { redirect } from "next/navigation";

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function SpecialistDashboard() {
  const user = await requireUser().catch(() => null);
  if (!user) redirect("/sign-in");
  if (user.role !== "SPECIALIST") {
    return (
      <div className="p-6">
        <p className="text-destructive">Access denied. Specialist only.</p>
      </div>
    );
  }

  const [rules, requests] = await Promise.all([
    listMyAvailabilityRules(),
    listSpecialistBookings(),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Specialist dashboard</h1>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Availability rules</h2>
        <AvailabilityForm />
        {rules.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {rules.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span>
                  {WEEKDAY[r.weekday]} {r.startTime}–{r.endTime}, {r.slotDurationMinutes}min, {r.timezone}
                </span>
                <RuleDeleteButton
                  ruleId={r.id}
                  weekday={r.weekday}
                  startTime={r.startTime}
                  endTime={r.endTime}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-muted-foreground">No rules yet. Add one above.</p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Booking requests</h2>
        {requests.length === 0 ? (
          <p className="text-muted-foreground">No requests yet.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((b) => (
              <Card key={b.id}>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-2">
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
                    {b.moderationReviewedBy && (
                      <span className="text-xs text-muted-foreground">Reviewed</span>
                    )}
                  </div>
                  <RequestActions
                    bookingId={b.id}
                    status={b.status}
                    moderationStatus={b.moderationStatus}
                    moderationReviewedBy={b.moderationReviewedBy}
                  />
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
                  {b.moderationReason && (
                    <p className="text-xs text-muted-foreground">
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
