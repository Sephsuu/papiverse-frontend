import { DeleteButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SupplyService } from "@/services/RawMaterialService";
import { UserService } from "@/services/UserService";
import { Supply } from "@/types/supply";
import { User } from "@/types/user";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    toDelete: Supply;
    setDelete: React.Dispatch<React.SetStateAction<Supply | undefined>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteSupply({ toDelete, setDelete, setReload }: Props) {
    const [onProcess, setProcess] = useState(false);
    console.log(toDelete);
    

    async function handleDelete() {
        try {
            setProcess(true);
            await SupplyService.deleteSupply(toDelete.code!);
            toast.success(`Employee ${toDelete.name} deleted successfully.`)
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setProcess(false); 
            setDelete(undefined);
            setReload(prev => !prev); 
        }
    }

    return(
        <Dialog open onOpenChange={ (open) => { if (!open) setDelete(undefined) } }>
            <DialogContent>
                <DialogTitle className="text-sm">Are you sure you want to delete supply <span className="text-darkred">{ toDelete.name }</span></DialogTitle>
                    <div className="flex justify-end items-center gap-4">
                        <DialogClose>Close</DialogClose>
                        <DeleteButton 
                            handleDelete={ handleDelete }
                            onProcess={ onProcess }
                            label="Delete Supply"
                            loadingLabel="Deleting Supply"
                        />
                    </div>
            </DialogContent>
        </Dialog>
    );
}