import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Specialist = {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  tags: string | null;
};

export function SpecialistsList({
  specialists,
  tag,
}: {
  specialists: Specialist[];
  tag?: string;
}) {
  return (
    <>
      <form method="get" action="/specialists" className="flex gap-2">
        <Input
          name="tag"
          placeholder="Filter by tag"
          defaultValue={tag ?? ""}
          className="max-w-xs"
        />
        <Button type="submit" variant="secondary">
          Filter
        </Button>
      </form>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {specialists.map((s) => (
          <Link key={s.id} href={`/specialists/${s.id}`}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="p-4">
                <h3 className="font-semibold">{s.name}</h3>
                {s.bio && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {s.bio}
                  </p>
                )}
                {s.tags && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {s.tags}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
