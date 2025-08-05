"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { handleChange } from "@/lib/form-handle";
import { InventoryService } from "@/services/InventoryService";
import { SupplyService } from "@/services/RawMaterialService";
import { Inventory, inventoryFields, inventoryInit } from "@/types/inventory";
import { Supply } from "@/types/supply";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AddInventory() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading]  = useState(true);
    const [onProcess, setProcess] = useState(false);
    const [open, setOpen] = useState(false);

    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [inventory, setInventory] = useState<Inventory>(inventoryInit);
    const [measurement, setMeasurement] = useState('Unit Measurement');

    async function handleSubmit() {
        try{            
            for (const field of inventoryFields) {
                if (inventory[field] === "" || inventory[field] === undefined) {
                    toast.info("Please fill up all fields!");
                    return; 
                }
            }
            const data = await InventoryService.createInventoryInput(inventory, claims.branch.branchId);
            if (data) {
                toast.success("Ineventory successfully added!");
                setInventory(inventoryInit);
            }
            
        }
        catch(error){
            console.log(error)
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {   
                const data = await SupplyService.getAllSupplies();
                setSupplies(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }   
        fetchData();
    }, []);

    useEffect(() => {
        const matchedSupply = supplies.find(i => i.code === inventory.rawMaterialCode);
        if (matchedSupply && matchedSupply.unitMeasurement) {
            setMeasurement(matchedSupply.unitMeasurement);
        } else {
            setMeasurement('Unit Measurement'); 
        }
    }, [inventory.rawMaterialCode])

    if (loading || authLoading) return <PapiverseLoading />
    return(
        <section className="relative flex flex-col w-full h-screen align-center justify-center">
            <Toaster closeButton position="top-center" />
            <div className="w-100 mx-auto shadow-lg mt-[-20px] p-8 bg-white rounded-md max-md:w-full max-md:bg-light max-md:shadow-none">

                <div className="flex items-center gap-2">
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-2xl">Inventory Input</div>
                </div>
                
                <div>Branch Name</div>
                <Select
                    onValueChange={ (value) => setInventory(prev => ({
                        ...prev,
                        rawMaterialCode: value,
                    }))}
                >
                    <SelectTrigger className="w-full border-1 border-gray">
                        <SelectValue placeholder="Select a supply" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Supplies</SelectLabel>
                            {supplies.map((item, index) => (
                                <SelectItem key={ index } value={ item.code! }>{ item.name }</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
             
      
                <div>Quantity</div>
                <div className="flex border-1 border-gray rounded-md">
                    <Input 
                        className="border-0"
                        name="changedQuantity"
                        value={ inventory.changedQuantity }
                        onChange={ e => handleChange(e, setInventory) }
                    />
                    <Input 
                        className="border-0 placeholder:!text-dark"
                        placeholder={ measurement || 'Unit Measurement' }
                        disabled
                    />
                </div>

                <Button 
                    className="w-fit mt-6"
                    onClick={ () => setOpen(!open) }
                >
                    Register
                </Button>
            </div>

            <Dialog open={ open } onOpenChange={ setOpen }>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle className="text-sm">Are you sure to add branch.</DialogTitle>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">SKU ID: </div>
                        <div className="text-sm font-semibold">{ inventory.rawMaterialCode || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                        <div className="text-sm">Unit Quantity and Measurement: </div>
                        <div className="text-sm font-semibold">{ `${inventory.changedQuantity} ${measurement}` || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary"  className="border-1 border-dark bg-white text-xs px-4" onClick={ () => { handleSubmit(); setOpen(!open); }}>
                            <FormLoader onProcess={ onProcess } label="Yes, I'm sure." loadingLabel="Loading"  />
                        </Button>
                        <Button type="button" className="text-xs px-4" onClick={ () => setOpen(!open) }>Cancel</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}