import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { handleChange } from "@/lib/form-handle";
import { ProductService } from "@/services/ProductService";
import { SupplyService } from "@/services/RawMaterialService";
import { Product, productFields, productInit } from "@/types/products";
import { Supply } from "@/types/supply";
import { SupplyItem } from "@/types/supplyOrder";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

const categories = ["MEAT", "SNOWFROST"];
const units = ["kilograms", "grams", "milligrams", "piece", "oz"]

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateProduct({ setOpen, setReload }: Props) {
    const [loading, setLoading] = useState(true);
    const [onProcess, setProcess] = useState(false);

    const [product, setProduct] = useState<Product>(productInit);
    const [supplies, setSupplies] = useState<Supply[]>([]);
    
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

    return(
        <Dialog open onOpenChange={ setOpen }>
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
                        <div>Product Name</div>
                        <Input    
                            className="w-full border-1 border-gray rounded-md max-md:w-full" 
                            name ="name"  
                            value={product.name}
                            onChange={ e => handleChange(e, setProduct)}
                        />  
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Category</div>
                        <Input    
                            className="w-full border-1 border-gray rounded-md max-md:w-full" 
                            name ="category"  
                            value={product.category}
                            onChange={ e => handleChange(e, setProduct)}
                        />  
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Price</div>
                        <div className="flex border-1 border-gray rounded-md max-md:w-full">
                            <input disabled value="₱" className="text-center w-10" />
                            <Input    
                                className="w-full border-0" 
                                type="number"
                                name ="price"  
                                value={product.price}
                                onChange={ e => handleChange(e, setProduct)}
                            /> 
                        </div>  
                    </div>

                </div>
                <div className="flex justify-end gap-4">
                    <DialogClose className="text-sm">Close</DialogClose>
                    {/* <AddButton 
                        handleSubmit={ handleSubmit }
                        onProcess={ onProcess }
                        label="Add Product"
                        loadingLabel="Adding Product"
                    /> */}
                </div>
            </DialogContent>
        </Dialog>
    );
}