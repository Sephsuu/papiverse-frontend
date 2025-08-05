import { DeleteButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UserService } from "@/services/UserService";
import { User } from "@/types/user";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    toDelete: User;
    setDelete: React.Dispatch<React.SetStateAction<User | undefined>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteUser({ toDelete, setDelete, setReload }: Props) {
    const [onProcess, setProcess] = useState(false);

    async function handleDelete() {
        try {
            setProcess(true);
            await UserService.deleteUser(toDelete.id!);
            toast.success(`Employee ${toDelete?.firstName} ${toDelete.lastName} deleted successfully.`)
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setProcess(false); 
            setDelete(undefined);
            setReload(prev => !prev); 
        }
    }

    return(
        <Dialog open={ !!toDelete } onOpenChange={ (open) => { if (!open) setDelete(undefined) } }>
            <DialogContent>
                <DialogTitle className="text-sm">Are you sure you want to delete user <span className="text-darkred">{ toDelete.username }</span></DialogTitle>
                    <div className="flex justify-end items-center gap-4">
                        <DialogClose>Close</DialogClose>
                        <DeleteButton 
                            handleDelete={ handleDelete }
                            onProcess={ onProcess }
                            label="Delete User"
                            loadingLabel="Deleting User"
                        />
                    </div>
            </DialogContent>
        </Dialog>
    );
}