"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  approveBooking,
  declineBooking,
  reviewModerationOverride,
} from "@/actions/booking";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RequestActions({
  bookingId,
  status,
  moderationStatus,
  moderationReviewedBy,
}: {
  bookingId: string;
  status: string;
  moderationStatus: string;
  moderationReviewedBy: string | null;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const canApproveDecline = status === "REQUESTED";
  const showReview = moderationStatus === "FLAGGED" && !moderationReviewedBy;

  async function handleApprove() {
    setPending(true);
    try {
      await approveBooking({ bookingId });
      toast.success("Approved");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  async function handleDecline() {
    setPending(true);
    try {
      await declineBooking({ bookingId });
      toast.success("Declined");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  async function handleReview() {
    setPending(true);
    try {
      await reviewModerationOverride({ bookingId });
      toast.success("Marked as reviewed");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canApproveDecline && (
        <>
          <Button size="sm" onClick={handleApprove} disabled={pending}>
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDecline}
            disabled={pending}
          >
            Decline
          </Button>
        </>
      )}
      {showReview && (
        <Button
          size="sm"
          variant="secondary"
          onClick={handleReview}
          disabled={pending}
        >
          Mark reviewed
        </Button>
      )}
    </div>
  );
}
