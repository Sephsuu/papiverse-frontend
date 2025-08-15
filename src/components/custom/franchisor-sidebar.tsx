"use client"

import { usePathname, useRouter } from "next/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { adminRoute, franchiseeRoute } from "@/lib/routes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown, ChevronUp, LucideIcon, User2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { SidebarLoading } from "../ui/loader";
import { AuthService } from "@/services/AuthService";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { UserService } from "@/services/UserService";
import {Spinner} from "@/components/custom/Spinner";


export function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const hideSidebar = pathname === "/auth" || pathname === "/";
    const { claims, loading } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState<User>();
    
    useEffect(() => {
        async function fetchData(id: number) {
            try {
                const data = await UserService.getUserById(id);
                if (data) {
                    setUser(data);
                }
            } catch (e) {
                console.log(e);
            }
        }
        if (claims.userId && claims.userId !== 0) {
            fetchData(claims.userId);
        }
    }, [claims])


    async function handleLogout() {
        await AuthService.deleteCookie();
        toast.success("Logging out. Please wait patiently.", { duration: Infinity });
        localStorage.removeItem('token');
        router.push("/auth");
    }



     if (loading) return <SidebarLoading />
    return(
        <>
        {!hideSidebar &&
            <Sidebar
                variant="floating" 
                collapsible="icon"
            >
                <SidebarTrigger 
                    className="rounded-full shadow-6xl bg-white absolute z-50 right-[-20px] top-[47%] -translate-x-1/2 -translate-y-1/2"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                />
                <SidebarContent 
                    className={ `rounded-md ${isCollapsed && "px-1"}` }
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
                    <SidebarMenu className={ `mt-3 ${isCollapsed && "flex flex-col justify-center items-center"}` }>
                        {adminRoute.map((item, index) => (
                            item.children.length !== 0 ?
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
                            :
                            <SidebarMenuButton className="flex gap-2" key={ index }>
                                <Link 
                                    href={ item.href! }
                                    className="flex items-center gap-2"
                                >
                                    <item.icon className="w-4 h-4" />
                                    { item.title }
                                </Link>
                                
                            </SidebarMenuButton>
                        ))}
                    </SidebarMenu>

                    <SidebarFooter className={`mt-auto ${isCollapsed ? "p-1" :  ""}`}>
                        <SidebarMenu>
                            <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        className={`h-10 mb-2 gap-3 flex items-center ${
                                            isCollapsed ? "justify-center w-full h-10" : "justify-start w-full"
                                        }`}  >
                                        <Avatar className="h-10 w-10">
                                            {user?.imageUrl ? (
                                            <AvatarImage
                                                src={`https://395z4m7f-8080.asse.devtunnels.ms${user.imageUrl}`}
                                                alt=""
                                            />
                                            ) : (
                                            <Spinner className="h-4 w-4 mt-1" />
                                            )}
                                        </Avatar>

                                        {!isCollapsed && (
                                            <>
                                            <h1 className="text-md whitespace-nowrap">{claims.sub}</h1>
                                            <ChevronUp className="ml-auto" />
                                            </>
                                        )}
                                        </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                side="right"
                                className="w-50"
                                >
                                <DropdownMenuItem>
                                    <Link href='/admin/account'>Account</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={ handleLogout }>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </SidebarContent>
                
            </Sidebar>
        }
        </>
    );
}