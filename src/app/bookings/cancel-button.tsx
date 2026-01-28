"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelBooking } from "@/actions/booking";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    setPending(true);
    try {
      await cancelBooking({ bookingId });
      toast.success("Booking cancelled");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Cancel failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleCancel} disabled={pending}>
      {pending ? "Cancelling…" : "Cancel"}
    </Button>
  );
}
