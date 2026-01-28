"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBookingSchema, type CreateBookingInput } from "@/actions/booking/schema";
import { createBooking } from "@/actions/booking";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { TiptapDoc } from "@/lib/rich-text";
import { toast } from "sonner";

type Slot = { startsAt: Date; endsAt: Date; isBooked: boolean };

const defaultDoc: TiptapDoc = {
  type: "doc",
  content: [{ type: "paragraph", content: [] }],
};

export function BookingForm({
  specialistId,
  slots,
}: {
  specialistId: string;
  slots: Slot[];
}) {
  const [pending, setPending] = useState(false);
  const available = slots.filter((s) => !s.isBooked);

  const form = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      specialistId,
      startsAt: "",
      endsAt: "",
      descriptionJson: defaultDoc,
    },
  });

  async function onSubmit(values: CreateBookingInput) {
    setPending(true);
    try {
      await createBooking(values);
      toast.success("Booking requested.");
      form.reset({ ...form.getValues(), descriptionJson: defaultDoc });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Request failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a booking</CardTitle>
        <CardDescription>Choose a slot and describe your request (rich text).</CardDescription>
      </CardHeader>
      <CardContent>
        {available.length === 0 ? (
          <p className="text-muted-foreground">No available slots to book.</p>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register("specialistId")} />

            <div className="space-y-2">
              <Label>Slot</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={form.watch("startsAt")}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v) {
                    const slot = available.find((s) => s.startsAt.toISOString() === v);
                    if (slot) {
                      form.setValue("startsAt", slot.startsAt.toISOString());
                      form.setValue("endsAt", slot.endsAt.toISOString());
                    }
                  } else {
                    form.setValue("startsAt", "");
                    form.setValue("endsAt", "");
                  }
                }}
              >
                <option value="">Select a time</option>
                {available.map((slot) => (
                  <option
                    key={slot.startsAt.toISOString()}
                    value={slot.startsAt.toISOString()}
                  >
                    {slot.startsAt.toLocaleString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {slot.endsAt.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </option>
                ))}
              </select>
              {form.formState.errors.startsAt && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.startsAt.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor
                value={form.watch("descriptionJson") ?? defaultDoc}
                onChange={(doc) => form.setValue("descriptionJson", doc)}
              />
              {form.formState.errors.descriptionJson && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.descriptionJson.message as string}
                </p>
              )}
            </div>

            <Button type="submit" disabled={pending}>
              {pending ? "Sending…" : "Request booking"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
