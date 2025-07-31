"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PapiverseLoading } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { UserService } from "@/services/UserService";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export default function FranchiseePage() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        async function fetchData() {
            const data = await UserService.getUserById(claims.userId);
            setUser(data);
        }
        fetchData()
    }, [claims])

    
    if (loading || authLoading) return <PapiverseLoading />
    return (
        <div>
            <div>WELCUM MAKMAK</div>
            <Avatar>
                <AvatarImage className="w-full" src={ user?.imageUrl } alt="" />
            </Avatar>

        </div>
    );
}