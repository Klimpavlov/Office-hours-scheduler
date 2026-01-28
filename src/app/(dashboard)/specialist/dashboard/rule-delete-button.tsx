"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAvailabilityRule } from "@/actions/availability";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RuleDeleteButton({
  ruleId,
  weekday,
  startTime,
  endTime,
}: {
  ruleId: string;
  weekday: number;
  startTime: string;
  endTime: string;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setPending(true);
    try {
      await deleteAvailabilityRule({ id: ruleId });
      toast.success("Rule removed");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={handleDelete}
      disabled={pending}
    >
      Delete
    </Button>
  );
}
