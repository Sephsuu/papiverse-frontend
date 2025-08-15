import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateModalSkeleton } from "@/components/ui/skeleton";
import { handleChange } from "@/lib/form-handle";
import { InventoryService } from "@/services/InventoryService";
import { ProductService } from "@/services/ProductService";
import { SupplyService } from "@/services/RawMaterialService";
import { Claim } from "@/types/claims";
import { Inventory, inventoryFields, inventoryInit } from "@/types/inventory";
import { Supply } from "@/types/supply";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    claims: Claim,
    toUpdate: Inventory
    setToUpdate: React.Dispatch<React.SetStateAction<Inventory | undefined>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateInventory({ claims, setToUpdate, setReload, toUpdate}: Props) {
    const [onProcess, setProcess] = useState(false);
    const [inventory, setInventory] = useState<Inventory>({
        rawMaterialCode : toUpdate.code,
        branchId : claims.branch.branchId,
        changedQuantity : 1,
        type : "IN",
        source : "INPUT"
    });


    useEffect(() => {
        console.log(inventory)
    }, [inventory.changedQuantity])
   

    async function handleSubmit() {
        try{            
            setProcess(true);
            for (const field of inventoryFields) {
                if (inventory[field] === "" || inventory[field] === undefined) {
                    toast.info("Please fill up all fields!");
                    return; 
                }
            }
            const data = await InventoryService.createInventoryInput(inventory, claims.branch.branchId);
            if (data) {
                toast.success(`Added ${inventory.changedQuantity} ${toUpdate.unitMeasurement} to ${toUpdate.name}`);
                setInventory(inventoryInit);
            }
            
        } catch (error) { toast.error(`${error}`) }
        finally {
            setReload(prev => !prev);
            setProcess(false);
            setToUpdate(undefined)
        }
    };

    return(
        <Dialog open onOpenChange={(open) => {if(!open) {
            setToUpdate(undefined)
        }}  }>
            <DialogContent className="overflow-y-auto">
                <DialogTitle className="flex items-center gap-2">  
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-xl">Add Inventory Count</div>      
                </DialogTitle>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 col-span-2">
                        <div>Supply Name</div>
                        <Input 
                            className="border-1 border-gray"
                            type="text"
                            value={toUpdate.name} 
                            readOnly
                        />
                    </div>
                
                    <div className="flex flex-col gap-1 col-span-2">
                        <div>Changed Quantity</div>
                        <div className="flex border-1 border-gray rounded-md">
                            <Input 
                                className="border-0"
                                name="changedQuantity"
                                type="number"
                                min={1}
                                value={ inventory.changedQuantity }
                                onChange={e => setInventory(prev => ({
                                    ...prev,
                                    changedQuantity : Number(e.target.value)
                                }))}
                            />
                            <Input 
                                className="border-0 placeholder:!text-dark"
                                value={toUpdate.unitMeasurement}
                                readOnly
                            />
                        </div>
                    </div>

                </div>
                <div className="flex justify-end gap-4">
                    <DialogClose className="text-sm">Close</DialogClose>
                    <AddButton 
                        handleSubmit={ handleSubmit }
                        onProcess={ onProcess }
                        label="Add Inventory"
                        loadingLabel="Adding Inventory"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}