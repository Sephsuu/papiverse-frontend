"use client"

import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider } from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { adminRoute } from "@/lib/routes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown } from "lucide-react";

export function AppSidebar() {
    const pathname = usePathname();
    const hideSidebar = pathname === "/auth";
    return(
        <>
        {!hideSidebar &&
            <Sidebar
                variant="floating" 
                collapsible="icon"
            >
                <SidebarContent 
                    className="rounded-md"
                    style={{ backgroundImage: "url(/images/sidebar_bg.svg)" }}
                >
                    <Link href="/auth/login">
                        <Image
                            src="/images/papiverse_logo.png"
                            alt="Papiverse Logo"
                            width={150}
                            height={150}
                            className="mx-auto mt-4"
                        />
                    </Link>
                    <SidebarMenu className="mt-3">
                        {adminRoute.map((item, index) => (
                            <Collapsible className="group/collapsible" key={ index }>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className="flex gap-2">
                                            <item.icon className="w-4 h-4" />
                                            { item.title }
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.children.map((sub, index) => (
                                                <SidebarMenuButton key={ index }>
                                                    <Link href={ sub.href }>
                                                        { sub.title }
                                                    </Link>
                                                </SidebarMenuButton>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
        }
        </>
    );
}