"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
    const [pending, setPending] = useState(false);
    const router = useRouter();

    const onLogout = async () => {
        setPending(true);
        await authClient.signOut();
        router.push("/sign-in");
    };

    return (
        <Button variant="outline" className='text-black' disabled={pending} onClick={onLogout}>
            Sign out
        </Button>
    );
}
