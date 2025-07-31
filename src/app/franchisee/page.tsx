"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PapiverseLoading } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { UserService } from "@/services/UserService";
import { User } from "@/types/user";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FranchiseePage() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await UserService.getUserById(claims.userId);
                setUser(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData()
    }, [claims])
    console.log(user);
    

    
    if (loading || authLoading) return <PapiverseLoading />
    return (
        <div className="w-full h-screen py-4 px-2">
            <div className="text-2xl font-semibold">WELCUM MAKMAK</div>
            <Avatar className="w-4/5 h-5/6 rounded-sm">
                <AvatarImage className="w-full h-full !rounded-0" src={user?.imageUrl ? `https://395z4m7f-8080.asse.devtunnels.ms${user.imageUrl}` : ""}/>
            </Avatar>
            
          

        </div>
    );
}