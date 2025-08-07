import SupplyOrders from "@/app/franchisee/inventory/supply-orders/page";
import { AddButton } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { handleChange } from "@/lib/form-handle";
import { SupplyOrderService } from "@/services/SupplyOrderService";
import { SupplyOrder } from "@/types/supplyOrder";
import { Dialog } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    order: SupplyOrder;
    setOrder: React.Dispatch<React.SetStateAction<SupplyOrder | undefined>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddRemarks({ order, setOrder, setReload }: Props) {
    const [onProcess, setProcess] = useState(false);
    const [remarks, setRemarks] = useState(order.remarks);

    useEffect(() => {
        console.log(remarks);
        
    }, [remarks])

    async function handleSubmit() {
        try {
            setProcess(true);
            const data = await SupplyOrderService.addRemarks(order.orderId!, remarks);
            if (data) toast.success('Remarks added successfully!')
        } catch (error) { toast.error(`${error}`) }
        finally {
            setReload(prev => !prev);
            setOrder(undefined);
        } 
    }

    return(
        <Dialog open onOpenChange={ (open) => { if (!open) { setOrder(undefined) } } }>
            <DialogContent>
                <DialogTitle>Add a Remarks</DialogTitle>
                <div>
                    <Textarea 
                        value={ remarks }
                        className="border-1 border-gray"
                        placeholder="Enter your rremarks for this supply order"
                        onChange={(e) => setRemarks(e.target.value)}
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