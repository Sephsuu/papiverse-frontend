"use client"

import { BranchService } from "@/services/BranchService";
import { Branch } from "@/types/branch";
import { useEffect, useState } from "react";
import { PolarAngleAxisWrapper } from "recharts/types/polar/PolarAngleAxis";
import { toast } from "sonner";
import { BranchesSidebar } from "../_components/BranchesSIdebar";
import { useAuth } from "@/hooks/use-auth";
import { PapiverseLoading } from "@/components/ui/loader";
import { BranchSalesOverview } from "../_components/BranchSalesOverview";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BranchSales() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [activeBranch, setActiveBranch] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await BranchService.getAllBranches(0, 1000);
                setBranches(data.content);
                setActiveBranch(claims.branch.branchId);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, []);

    if ( loading || authLoading) return <PapiverseLoading />
    return(
        <section className="w-full py-4 px-2">
            <div className="grid grid-cols-5 gap-2">
                <div>
                    <BranchesSidebar
                        claims={ claims }
                        branches={ branches }
                        activeBranch={ activeBranch }
                        setActiveBranch={ setActiveBranch }
                    />
                </div>
                <ScrollArea className="col-span-4 h-screen">
                    <BranchSalesOverview />
                </ScrollArea>
            </div>
            
        </section>
    );
}