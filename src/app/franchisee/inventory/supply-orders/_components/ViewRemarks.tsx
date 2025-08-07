import { AddButton } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
    remarks: string;
    setRemarks: React.Dispatch<React.SetStateAction<string>>;
}

export default function ViewRemarks({ remarks, setRemarks }: Props) {
    const [onProcess, setProcess] = useState(false);

    async function handleSubmit() {
        try {
            setProcess(true);
        } catch (error) { toast.error(`${error}`) }
    }

    return(
        <Dialog open={Boolean(remarks)} onOpenChange={ (open) => { if (!open) { setRemarks('') } } }>
            <DialogContent>
                <DialogTitle>Remarks</DialogTitle>
                <div>
                    <Textarea 
                        value={ remarks || 'This order has no remarks'}
                        readOnly
                        className="border-1 border-gray"
                        placeholder="Enter your rremarks for this supply order"
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <DialogClose className="text-sm">Close</DialogClose>
                    <AddButton 
                        handleSubmit={ handleSubmit }
                        onProcess={ onProcess }
                        label="Add Remark"
                        loadingLabel="Adding Remark"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );  
}