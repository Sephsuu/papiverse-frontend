"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormLoader } from "@/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { handleChange } from "@/lib/form-handle";
import { SupplyService } from "@/services/RawMaterialService";
import { Supply, supplyFields, supplyInit } from "@/types/supply";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const categories = ["MEAT", "SNOWFROST"];
const units = ["kilograms", "grams", "milligrams", "piece", "oz"]

export default function AddSupply() {
    const [onProcess, setProcess] = useState(false);
    const [open, setOpen] = useState(false);
    const [supply, setSupply] = useState<Supply>(supplyInit);

    async function handleSubmit() {
        try {
            setProcess(true);
            for (const field of supplyFields) {
                    if (supply[field] === "" || supply[field] === undefined || supply[field] === 0) {
                        toast.info("Please fill up all fields!");
                        return; 
                    }
                }
            const data = await SupplyService.addSupply(supply);
            if (data) toast.success(`${supply.name} added successfully.`)
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setProcess(false); 
            setOpen(!open);
            setSupply(supplyInit);
        }
    }

    useEffect(() => {
        console.log(supply);
        
    }), [supply]

    return(
        <section className="relative flex flex-col w-full h-screen align-center justify-center">
            <Toaster closeButton position="top-center" />
            <div className="w-150 mx-auto shadow-lg mt-[-20px] p-8 bg-white rounded-md max-md:w-full max-md:bg-light max-md:shadow-none">
                <div className="flex items-center gap-2">
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-2xl">Register New Supply</div>
                    <Image
                        src="/images/papiverse_logo.png"
                        alt="KP Logo"
                        width={100}
                        height={100}
                        className="ms-auto"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                    <div>
                        <div>SKU ID</div>
                        <Input 
                            placeholder="e.g. RAW001" 
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="code"  
                            value={supply.code}
                            onChange={ e => handleChange(e, setSupply) }
                        />
                    </div>
                    <div>
                        <div>Supply Name</div>
                        <Input 
                            placeholder="Enter supply name" 
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="name"  
                            value={supply.name}
                            onChange={ e => handleChange(e, setSupply) }
                        />
                    </div>
                    <div>
                        <div>Category</div>
                        <Select
                            value={ supply.category }
                            onValueChange={ (value) => setSupply(prev => ({
                                ...prev,
                                category: value
                            })) }
                        >
                            <SelectTrigger className="w-full border-1 border-gray">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((item, index) => (
                                    <SelectItem value={ item } key={ index }>{ item }</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <div>Unit Measurement</div>
                        <div className="flex border-1 border-gray rounded-md">
                            <Input 
                                placeholder="Enter supply name" 
                                className="w-1/2 max-md:w-full border-0" 
                                name ="unitQuantity"  
                                value={supply.unitQuantity}
                                onChange={ e => handleChange(e, setSupply) }
                            />
                            <Select
                                value={ supply.unitMeasurement }
                                onValueChange={ (value) => setSupply(prev => ({
                                    ...prev,
                                    unitMeasurement: value
                                })) }
                            >
                                <SelectTrigger className="w-1/2 border-0">
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((item, index) => (
                                        <SelectItem value={ item } key={ index }>{ item }</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <div>Internal Price</div>
                        <div className="flex border-1 border-gray rounded-md">
                            <input disabled placeholder="₱" className="w-10 placeholder:text-center" /> 
                            <Input 
                                type="number"
                                className="w-full max-md:w-full" 
                                name ="unitPriceInternal"  
                                value={supply.unitPriceInternal}
                                onChange={ e => handleChange(e, setSupply) }
                            />
                        </div>
                    </div>
                    <div>
                        <div>External Price</div>
                        <div className="flex border-1 border-gray rounded-md">
                            <input disabled placeholder="₱" className="w-10 placeholder:text-center" /> 
                            <Input 
                                type="number"
                                className="w-full max-md:w-full" 
                                name ="unitPriceExternal"  
                                value={supply.unitPriceExternal}
                                onChange={ e => handleChange(e, setSupply) }
                            />
                        </div>
                    </div>
                    <Button 
                        className="w-fit mt-4"
                        onClick={ () => setOpen(!open) }
                    >
                        Register
                    </Button>
                </div>
            </div>

            <Dialog open={ open } onOpenChange={ setOpen }>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle className="text-sm">Are you sure to update supply.</DialogTitle>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">SKU ID: </div>
                        <div className="text-sm font-semibold">{ supply.code || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                        <div className="text-sm">Supply Name: </div>
                        <div className="text-sm font-semibold">{ supply.name || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                        <div className="text-sm">Unit Measurement: </div>
                        <div className="text-sm font-semibold">{ `${supply.unitQuantity} ${supply.unitMeasurement}` || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                        <div className="text-sm">Category: </div>
                        <div className="text-sm font-semibold">{ supply.category || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                        <div className="text-sm">Internal Price: </div>
                        <div className="text-sm font-semibold">{ supply.unitPriceInternal || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                        <div className="text-sm">External Price: </div>
                        <div className="text-sm font-semibold">{ supply.unitPriceExternal || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <DialogClose className="text-sm">Close</DialogClose>
                        <Button 
                            onClick={ handleSubmit }
                            size="sm"
                        >
                            <FormLoader onProcess={ onProcess } label="Yes, I,m sure." loadingLabel="Adding Supply" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}