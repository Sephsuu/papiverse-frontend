import { ScrollArea } from "@/components/ui/scroll-area";
import { Branch } from "@/types/branch";
import { Claim } from "@/types/claims";
import { Dispatch, SetStateAction } from "react";

interface Props {
    claims: Claim;
    branches: Branch[];
    activeBranch: number;
    setActiveBranch: Dispatch<SetStateAction<number>>;
}

export function BranchesSidebar({ claims, branches, activeBranch, setActiveBranch }: Props) {
    return(
        <ScrollArea className="bg-white rounded-md shadow-sm px-4 py-2 h-[95vh]">
            <div className="text-lg font-semibold">Branches</div>
            <button 
                onClick={ () => setActiveBranch(claims.branch.branchId!) } 
                className={`w-full text-start p-2 border-b-1 ${activeBranch === claims.branch.branchId && "bg-darkbrown text-light rounded-sm"}`}
            >
                <div className="text-sm">My Branch</div>
            </button>
            {branches.map((item, index) => (
                claims.branch.branchId !== item.branchId && (
                    <button
                        onClick={ () => setActiveBranch(item.branchId!) } 
                        key={ index }
                        className={`w-full text-start p-2 border-b-1 ${activeBranch === item.branchId && "bg-darkbrown text-light rounded-sm"}`}
                    >
                        <div className="text-sm">{ item.branchName }</div>
                    </button>
                )
            ))}
        </ScrollArea>
    );
}