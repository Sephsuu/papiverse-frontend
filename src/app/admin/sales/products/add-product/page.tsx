"use client"

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { handleChange } from "@/lib/form-handle";
import { SupplyService } from "@/services/RawMaterialService";
import { Product, productInit } from "@/types/products";
import { Supply } from "@/types/supply";
import { SupplyItem } from "@/types/supplyOrder";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AddProduct() {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<Product>(productInit);
    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [selectedItems, setSelectedItems] = useState<SupplyItem[]>([]);

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

    const handleSelect = async (code: string) => {
        if (!selectedItems.find((item: SupplyItem) => item.code === code)) {
            const selectedItem = supplies.find(item => item.code === code);
            if (selectedItem) {
            setSelectedItems([
                ...selectedItems,
                { code, name: selectedItem.name, quantity: 1, unitMeasurement: selectedItem.unitMeasurement, unitPrice: selectedItem.unitPrice, category: selectedItem.category }
            ]);
            } else {
            console.warn(`Item with code ${code} not found.`);
            }
        }
    };

    const handleQuantityChange = async (code: string, quantity: number) => {
        setSelectedItems(selectedItems.map((item: SupplyItem) => 
            item.code === code 
                ? { ...item, quantity: quantity || 0 } 
                : item
        ));
    };

    const handleRemove = async (code: string) => {
        setSelectedItems(selectedItems.filter((item: SupplyItem) => item.code !== code));
    };

    return(
        <section className="relative flex flex-col w-full h-screen align-center justify-center">
            <Toaster closeButton position="top-center" />
            <div className="w-180 mx-auto shadow-lg mt-[-20px] p-8 bg-white rounded-md max-md:w-full max-md:bg-light max-md:shadow-none">
                <div className="flex items-center gap-2">
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-2xl">Register New Product</div>
                    <Image
                        src="/images/papiverse_logo.png"
                        alt="KP Logo"
                        width={100}
                        height={100}
                        className="ms-auto"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex flex-col gap-1">
                        <div>Branch Name</div>
                        <Input 
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="name"  
                            value={product.name}
                            onChange={ e => handleChange(e, setProduct)}
                        />
                        <div>Price</div>
                        <div className="flex border-1 border-gray rounded-md">
                            <input 
                                placeholder="₱"
                                readOnly
                                className="w-10 placeholder:text-center placeholder:text-dark"
                            />
                            <Input 
                                className="w-full border-0" 
                                type="number"
                                name ="price"  
                                value={product.price}
                                onChange={ e => handleChange(e, setProduct)}
                            />
                        </div>
                        <div>Branch Name</div>
                        <Input 
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="name"  
                            value={product.name}
                            onChange={ e => handleChange(e, setProduct)}
                        />
                    </div>
                    <div>
                        <Select onValueChange={ handleSelect }>
                            <SelectTrigger className="border-1 border-gray w-full">
                                <SelectValue placeholder="Select needed supplies" />
                            </SelectTrigger>
                            <SelectContent>
                                {supplies.map((item) => (
                                    <SelectItem key={item.code} value={item.code!}>{item.code} - {item.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Separator className="mt-2" />
                        <ScrollArea className="h-5/6 bg-slate-100 rounded-md p-4 shadow-sm">
                            <div className="grid grid-cols-[auto_auto_auto]">
                                {selectedItems.map((item, index) => (
                                    <Fragment key={ index }>
                                        <div className="data-table-td">{ item.name }</div>
                                        <div className="data-table-td">
                                            <input 
                                                min="1"
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.code!, Number(e.target.value))}
                                                className="text-sm w-18 border-0 pl-2"
                                            />
                                        </div>
                                        <button onClick={ () => handleRemove(item.code!) }><X className="w-4 h-4 text-darkred" /></button>
                                    </Fragment>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </section>
    );
}