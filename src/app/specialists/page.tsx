import {listSpecialists} from "@/actions/specialist";
import {Card, CardContent} from "@/components/ui/card";

 const SpecialistsPage = async () => {
    const specialists = await listSpecialists()

     if (specialists.length === 0) {
         return (
             <div className="p-8 text-center text-muted-foreground">
                 No specialists available yet.
             </div>
         );
     }

    return (
        <div className='grid gap-6 p-6 md:grid-cols-3'>
            {specialists.map((s) => (
                <Card key={s.id}>
                    <CardContent className="p-4">
                        <h3 className="font-semibold">{s.name}</h3>
                        {s.bio && (
                            <p className="text-sm text-muted-foreground mt-2">{s.bio}</p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default SpecialistsPage