"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { promoteToSpecialist } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function PromoteButton({
  userId,
  isSpecialist,
}: {
  userId: string;
  isSpecialist: boolean;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  if (isSpecialist) {
    return <span className="text-xs text-muted-foreground">Specialist</span>;
  }

  async function handlePromote() {
    setPending(true);
    try {
      await promoteToSpecialist(userId);
      toast.success("Promoted to specialist");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handlePromote} disabled={pending}>
      {pending ? "Promoting…" : "Promote to specialist"}
    </Button>
  );
}
