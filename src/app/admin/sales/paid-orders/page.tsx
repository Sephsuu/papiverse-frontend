"use client"

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Download, Funnel, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { InsertPaidOrdersExcel } from "../_components/InsertPaidOrdersExcel";
import { PaidOrder } from "@/types/sales";
import { PaidOrdersPreview } from "../_components/PaidOrdersPreview";
import { PaidOrdersAccordion } from "../_components/PaidOrdersAccordion";

export default function OrderTransaction() {
    const [paidOrdersPreview, setPaidOrdersPreview] = useState<PaidOrder[]>([]);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        console.log(paidOrdersPreview);
        
    }, [paidOrdersPreview])
    return(
        <section className="w-full py-4 px-2">
            <Toaster closeButton position="top-center" />
            <div className="flex items-center gap-2">
                <Image
                    src="/images/kp_logo.png"
                    alt="KP Logo"
                    width={40}
                    height={40}
                />
                <div className="text-xl font-semibold">Paid Orders</div>
                <Image
                    src="/images/papiverse_logo.png"
                    alt="KP Logo"
                    width={100}
                    height={100}
                    className="ms-auto"
                />
            </div>
            <div className="flex items-center mt-2">
                <input
                    className="py-1 pl-3 rounded-md bg-light shadow-xs w-100"
                    placeholder="Search for a user"
                    onChange={ e => setSearch(e.target.value) }
                />

                <div className="ms-auto flex gap-2">
                    <div className="flex items-center gap-1">
                        <div className="text-sm text-gray">Showing</div>
                        <Select>
                            <SelectTrigger className="bg-light shadow-xs">
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                        </Select>
                    </div>
                    <Select>
                        <SelectTrigger className="bg-light shadow-xs">
                            <Funnel className="text-dark" />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                    </Select>
                    <Button 
                        variant="secondary"
                        className="bg-light shadow-xs"
                    >
                        <Download />
                        Export
                    </Button>
                    <Button 
                        onClick={ () => setOpen(!open) }
                        className="!bg-darkorange text-light shadow-xs hover:opacity-90"
                    >
                        <Plus /> Insert an excel
                    </Button>
                </div>
                
            </div>

            <PaidOrdersAccordion />

            {open && (
                <InsertPaidOrdersExcel 
                    setOpen={ setOpen }
                    setPaidOrdersPreview={ setPaidOrdersPreview }
                />
            )}

            {paidOrdersPreview.length > 0 && (
                <PaidOrdersPreview 
                    paidOrdersPreview={ paidOrdersPreview }
                    setPaidOrdersPreview={ setPaidOrdersPreview }
                />
            )}
        </section>
    )
}