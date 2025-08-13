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
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateInventory({ claims, setOpen, setReload }: Props) {
    const [loading, setLoading] = useState(true);
    const [onProcess, setProcess] = useState(false);
    const [search, setSearch] = useState('');

    const [inventory, setInventory] = useState<Inventory>(inventoryInit);
    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [filteredSupplies, setFilteredSupplies] = useState<Supply[]>([]);
    const [measurement, setMeasurement] = useState('Unit Measurement');

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await SupplyService.getAllSupplies(0, 1000);
                setSupplies(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) } 
        }
        fetchData();
    }, []);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredSupplies(supplies.filter(
                (i) => i.name!.toLowerCase().includes(find) ||
                i.code!.toLowerCase().includes(find)
            ))
        } else setFilteredSupplies(supplies);
    }, [search, supplies]);

    useEffect(() => {
        const matchedSupply = supplies.find(i => i.code === inventory.rawMaterialCode);
        if (matchedSupply && matchedSupply.unitMeasurement) {
            setMeasurement(matchedSupply.unitMeasurement);
        } else {
            setMeasurement('Unit Measurement'); 
        }
    }, [inventory.rawMaterialCode]);

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
                toast.success("Ineventory successfully added!");
                setInventory(inventoryInit);
            }
            
        } catch (error) { toast.error(`${error}`) }
        finally {
            setReload(prev => !prev);
            setProcess(false);
            setOpen(!open);
        }
    };

    return(
        <Dialog open onOpenChange={ setOpen }>
            {loading && (
                <CreateModalSkeleton />
            )}
            {!loading && (
                <DialogContent className="overflow-y-auto">
                    <DialogTitle className="flex items-center gap-2">  
                        <Image
                            src="/images/kp_logo.png"
                            alt="KP Logo"
                            width={40}
                            height={40}
                        />
                        <div className="font-semibold text-xl">Create Product</div>      
                    </DialogTitle>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1 col-span-2">
                            <div>Supply</div>
                            <Select
                                onValueChange={ (value) => setInventory(prev => ({
                                    ...prev,
                                    rawMaterialCode: value,
                                }))}
                            >
                                <SelectTrigger className="w-full border-1 border-gray">
                                    <SelectValue placeholder="Select supply" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <Input
                                            placeholder="Search for a supply"
                                            className="border-1 border-slate-300 h-fit"
                                            onChange={ e => setSearch(e.target.value) }
                                        />
                                        <SelectLabel>All Supplies</SelectLabel>
                                        {filteredSupplies.map((item) => (
                                            <SelectItem key={item.code} value={item.code!}>{item.code} - {item.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select> 
                        </div>
                   
                        <div className="flex flex-col gap-1 col-span-2">
                            <div>Unit Measurement</div>
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
            )}
        </Dialog>
    );
}