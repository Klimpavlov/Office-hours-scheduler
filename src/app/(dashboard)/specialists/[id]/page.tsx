import { notFound } from "next/navigation";
import {
  getSpecialistById,
  getSpecialistSlotsNext14Days,
} from "@/actions/specialist";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BookingForm } from "./booking-form";
import { SlotsList } from "@/app/(dashboard)/specialists/[id]/slots-list";

export default async function SpecialistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [specialist, slots] = await Promise.all([
    getSpecialistById(id).catch(() => null),
    getSpecialistSlotsNext14Days(id),
  ]);

  if (!specialist) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={specialist.image ?? undefined}
              alt={specialist.name}
            />
            <AvatarFallback className="text-lg">
              {specialist.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{specialist.name}</CardTitle>
            {specialist.bio && (
              <p className="mt-1 text-muted-foreground">{specialist.bio}</p>
            )}
          </div>
        </CardHeader>
      </Card>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Available slots (next 14 days)
        </h2>
        {slots.length === 0 ? (
          <p className="text-muted-foreground">
            No slots available in the next 14 days.
          </p>
        ) : (
          <SlotsList slots={slots} />
        )}
      </section>

      <BookingForm specialistId={id} slots={slots} />
    </div>
  );
}
