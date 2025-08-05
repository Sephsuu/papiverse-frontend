import { Button, DeleteButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader } from "@/components/ui/loader";
import { EmployeeService } from "@/services/EmployeeService";
import { Employee } from "@/types/employee";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    toDelete: Employee;
    setDelete: React.Dispatch<React.SetStateAction<Employee | undefined>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteEmployee({ toDelete, setDelete, setReload }: Props) {
    const [onProcess, setProcess] = useState(false);

    async function handleDelete() {
        try {
            setProcess(true);
            await EmployeeService.deleteEmployee(toDelete.id!);
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
                <DialogTitle className="text-sm">Are you sure you want to delete employee <span className="text-darkred">{ `${toDelete?.firstName} ${toDelete?.lastName}` }</span></DialogTitle>
                    <div className="flex justify-end items-center gap-4">
                        <DialogClose>Close</DialogClose>
                        <DeleteButton 
                            handleDelete={ handleDelete }
                            onProcess={ onProcess }
                            label="Delete Employee"
                            loadingLabel="Deleting Employee"
                        />
                    </div>
            </DialogContent>
        </Dialog>
    );
}