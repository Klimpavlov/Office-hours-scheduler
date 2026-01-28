import { listSpecialists } from "@/actions/specialist";
import { SpecialistsList } from "./specialists-list";

export default async function SpecialistsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const specialists = await listSpecialists({ tag });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Specialists</h1>
      <SpecialistsList specialists={specialists} tag={tag} />
      {specialists.length === 0 && (
        <p className="text-center text-muted-foreground">
          No specialists found.
        </p>
      )}
    </div>
  );
}
