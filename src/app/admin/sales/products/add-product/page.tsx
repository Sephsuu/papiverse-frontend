"use client"

import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { handleChange } from "@/lib/form-handle";
import { Product, productInit } from "@/types/products";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AddProduct() {
    const [product, setProduct] = useState<Product>(productInit)
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

                <div className="grid grid-cols-2 mt-4">
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
                        <div className="flex justify-between items-center">
                            <div className="text-sm">Select the supplies needed</div>
                            <button className="w-8 h-8 rounded-full p-4"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}