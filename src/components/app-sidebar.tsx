import { Calendar, Home, Inbox, Settings } from "lucide-react"

import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {requireUser} from "@/lib/action";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export async function AppSidebar() {
    const user = await requireUser().catch(() => null);
    const router = useRouter();
    const items = [
        {
            title: "Home",
            url: "/",
            icon: Home,
        },
        {
            title: "Specialists",
            url: "/specialists",
            icon: Inbox,
        },
        {
            title: "Bookings",
            url: "/bookings",
            icon: Calendar,
        },
    ];

    if (user?.role === "ADMIN") {
        items.push({
            title: "Admin",
            url: "/admin",
            icon: Settings,
        });
    }

    if (user?.role === "SPECIALIST") {
        items.push({
            title: "Dashboard",
            url: "/specialist/dashboard",
            icon: Settings,
        });
    }
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Button onClick={() => router.push('/sign-in') }>Sign out</Button>
            </SidebarFooter>
        </Sidebar>
    )
}