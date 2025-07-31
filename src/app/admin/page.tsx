"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PapiverseLoading } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { UserService } from "@/services/UserService";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const { claims, loading } = useAuth();
    const [user, setUser] = useState<User>()
    console.log(claims);
    

    if (loading) return <PapiverseLoading />
    return(
        <section>
            
        </section>
    )
}