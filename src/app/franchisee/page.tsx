"use client"

import { PapiverseLoading } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export default function FranchiseePage() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Claims updated:", claims);
    }, [claims]);
    
    if (loading || authLoading) return <PapiverseLoading />
    return (
        <div>
            <h1>Franchisee Page { claims.sub }</h1>
            <p>Welcome to the franchisee section of our application.</p>
        </div>
    );
}