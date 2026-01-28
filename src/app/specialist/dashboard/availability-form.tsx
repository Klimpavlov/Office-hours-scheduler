"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { availabilityRuleSchema } from "@/actions/availability/schema";
import { upsertAvailabilityRule } from "@/actions/availability";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { z } from "zod";

const WEEKDAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

type FormValues = z.infer<typeof availabilityRuleSchema>;

export function AvailabilityForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(availabilityRuleSchema),
    defaultValues: {
      weekday: 1,
      startTime: "09:00",
      endTime: "17:00",
      slotDurationMinutes: 30,
      timezone: "Europe/Berlin",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await upsertAvailabilityRule(values);
      toast.success("Saved");
      form.reset(undefined, { keepValues: false });
      onSuccess?.();
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-2">
        <Label>Weekday</Label>
        <Select
          value={String(form.watch("weekday"))}
          onValueChange={(v) => form.setValue("weekday", Number(v))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WEEKDAYS.map((d) => (
              <SelectItem key={d.value} value={String(d.value)}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Start</Label>
        <Input type="time" {...form.register("startTime")} />
        {form.formState.errors.startTime && (
          <p className="text-sm text-destructive">{form.formState.errors.startTime.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>End</Label>
        <Input type="time" {...form.register("endTime")} />
        {form.formState.errors.endTime && (
          <p className="text-sm text-destructive">{form.formState.errors.endTime.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Slot (min)</Label>
        <Input type="number" min={5} max={240} {...form.register("slotDurationMinutes", { valueAsNumber: true })} />
        {form.formState.errors.slotDurationMinutes && (
          <p className="text-sm text-destructive">{form.formState.errors.slotDurationMinutes.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Timezone (IANA)</Label>
        <Input placeholder="Europe/Berlin" {...form.register("timezone")} />
        {form.formState.errors.timezone && (
          <p className="text-sm text-destructive">{form.formState.errors.timezone.message}</p>
        )}
      </div>
      <div className="flex items-end">
        <Button type="submit">Add rule</Button>
      </div>
    </form>
  );
}
