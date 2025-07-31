"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { formatToPeso } from "@/lib/formatter";
import MeatOrderService from "@/services/MeatOrderService";
import SnowOrderService from "@/services/SnowOrderService";
import { SupplyOrderService } from "@/services/SupplyOrderService";
import { Ham, Snowflake } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    claims: any;
    setActiveForm: (i: string) => void;
    selectedItems: any[];
}

export function OrderReceipt({ claims, setActiveForm, selectedItems }: Props) {
    const [open, setOpen] = useState(false);
    const [onProcess, setProcess] = useState(false);
    const [meatOrder, setMeatOrder] = useState<any>();
    const [snowOrder, setSnowOrder] = useState<any>();
    const meatReceipt = selectedItems.filter((s) => s.category === "MEAT");
    const snowFrostReceipt = selectedItems.filter((s) => s.category === "SNOWFROST");

    const totalMeatAmount = meatReceipt.reduce(
        (acc, supply) => acc + supply.unitPrice * supply.quantity,
        0
    );
    const totalSnowFrostAmount = snowFrostReceipt.reduce(
        (acc, supply) => acc + supply.unitPrice * supply.quantity,
        0
    );

    async function handleSubmit() {
        try {
            setProcess(true);

            const updatedMeatOrder = {...meatOrder, id: "MEAT-053", branchId: claims.branch.branchId, categoryItems: meatReceipt, totalAmount: null};
            const updatedSnowOrder = {...snowOrder, id: "SNOW-053", branchId: claims.branch.branchId, categoryItems: snowFrostReceipt, totalAmount: null};
            
            setMeatOrder(updatedMeatOrder);
            setSnowOrder(updatedSnowOrder);

            await MeatOrderService.createMeatOrder(updatedMeatOrder);
            await SnowOrderService.createSnowOrder(updatedSnowOrder);

            const orderSupply = {
                branchId: claims.branch.branchId,
                remarks: "",
                meatCategoryItemId: updatedMeatOrder.id,
                snowfrostCategoryItemId: updatedSnowOrder.id
            }
            const data = await SupplyOrderService.createSupplyOrder(orderSupply);
            if (data) {
                toast.success("Supply Order Created")
            }
        
        } catch (error) { toast.error(`${error}`) }
        finally { setProcess(false) }
    }

    return(
        <section className="py-2">
            <div className="p-4 bg-white rounded-md shadow-sm relative">
                <Image src="/images/kp_logo.png" alt="KP Logo" width={60} height={60} className="top-2 right-2 absolute" />
                <div className="flex justify-center items-center gap-2">
                    <Ham />
                    <div className="font-semibold">Meat Supply Order Receipt</div>
                </div>
                <div className="text-center text-sm text-gray">Please review carefully your order form.</div>
                <div className="grid grid-cols-3">
                    <div className="grid gap-1">
                        <div className="text-sm"><span className="font-bold">No: </span>{ "PO 34450294MAG2" }</div>
                        <div className="text-sm"><span className="font-bold">Date</span> { new Date().toLocaleDateString()}</div>
                        <div className="text-sm"><span className="font-bold">Delivery within: </span>{ "Maguyan, Silang, Cavite" }</div>
                    </div>
                    <div className="text-sm mt-auto"><span className="font-bold">To:</span> { "[KP Commisary]" }</div>
                    <div className="text-sm mt-auto"><span className="font-bold">Tel No.</span> { "[0947 545 3783]" }</div>
                </div>
                <div>
                    <div className="grid grid-cols-6 mt-4">
                        <div className="text-sm font-bold mx-auto">No.</div>
                        <div className="text-sm font-bold">Supply Description</div>
                        <div className="text-sm font-bold">Qty</div>
                        <div className="text-sm font-bold">Unit</div>
                        <div className="text-sm font-bold">Unit Price</div>
                        <div className="text-sm font-bold">Total Amount</div>
                    </div>
                    <Separator className="my-2 bg-gray" />
                    {meatReceipt.length > 0 ? 
                        meatReceipt.map((supply, index) => (
                            <div className="grid grid-cols-6 my-2" key={ index }>
                                <div className="text-sm mx-auto">{ index + 1 }</div>
                                <div className="text-sm">{ supply.name }</div>
                                <div className="text-sm">{ supply.quantity }</div>
                                <div className="text-sm">{ supply.unitMeasurement }</div>
                                <div className="text-sm">{ formatToPeso(supply.unitPrice) }</div>
                                <div className="text-sm">{ formatToPeso(supply.unitPrice * supply.quantity) }</div>
                            </div>  
                        ))
                    : (
                        <div className="text-sm text-gray font-semibold text-center py-2">You have no orders for MEAT category.</div>
                    )}
                    <Separator className="my-4 bg-gray" />
                    <div className="grid grid-cols-6 font-bold text-sm mt-4">
                        <div className="col-span-5 text-center">Total</div>
                        <div>{formatToPeso(totalMeatAmount)}</div>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-white rounded-md shadow-sm mt-4 relative">
                <Image src="/images/kp_logo.png" alt="KP Logo" width={60} height={60} className="top-2 right-2 absolute" />
                <div className="flex justify-center items-center gap-2">
                    <Snowflake />
                    <div className="font-semibold">Snow Frost Supply Order Receipt</div>
                </div>
                <div className="text-center text-sm text-gray">Please review carefully your order form.</div>
                <div className="grid grid-cols-3">
                    <div className="grid gap-1">
                        <div className="text-sm"><span className="font-bold">No: </span>{ "PO 34450294MAG2" }</div>
                        <div className="text-sm"><span className="font-bold">Date</span> { new Date().toLocaleDateString()}</div>
                        <div className="text-sm"><span className="font-bold">Delivery within: </span>{ "Maguyan, Silang, Cavite" }</div>
                    </div>
                    <div className="text-sm mt-auto"><span className="font-bold">To:</span> { "[KP Commisary]" }</div>
                    <div className="text-sm mt-auto"><span className="font-bold">Tel No.</span> { "[0947 545 3783]" }</div>
                </div>
                <div>
                    <div className="grid grid-cols-6 mt-4">
                        <div className="text-sm font-bold mx-auto">No.</div>
                        <div className="text-sm font-bold">Supply Description</div>
                        <div className="text-sm font-bold">Qty</div>
                        <div className="text-sm font-bold">Unit</div>
                        <div className="text-sm font-bold">Unit Price</div>
                        <div className="text-sm font-bold">Total Amount</div>
                    </div>
                    <Separator className="my-2 bg-gray" />
                    {snowFrostReceipt.length > 0 ? 
                        snowFrostReceipt.map((supply, index) => (
                            <div className="grid grid-cols-6 my-2" key={ index }>
                                <div className="text-sm mx-auto">{ index + 1 }</div>
                                <div className="text-sm">{ supply.name }</div>
                                <div className="text-sm">{ supply.quantity }</div>
                                <div className="text-sm">{ supply.unitMeasurement }</div>
                                <div className="text-sm">{ formatToPeso(supply.unitPrice) }</div>
                                <div className="text-sm">{ formatToPeso(supply.unitPrice * supply.quantity) }</div>
                            </div>  
                        ))
                    : (
                        <div className="text-sm text-gray font-semibold text-center py-2">You have no orders for SNOW FROST category.</div>
                    )}
                    <Separator className="my-4 bg-gray" />
                    <div className="grid grid-cols-6 font-bold text-sm mt-4">
                        <div className="col-span-5 text-center">Total</div>
                        <div>{formatToPeso(totalSnowFrostAmount)}</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button 
                    onClick={ () => setActiveForm("snow") } 
                    variant="secondary"
                    className="px-4"
                >
                    Back to Order Form
                </Button>
                <Button 
                    onClick={ () => setOpen(true) }
                    className="px-4 !bg-darkgreen hover:opacity-90"
                >
                    Order Supplies
                </Button>
            </div>

            <Dialog open={ open } onOpenChange={ setOpen }>
                <DialogContent>
                    <DialogTitle className="text-sm">Are you sure to order the following supplies?</DialogTitle>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={ handleSubmit }
                            className="!bg-darkgreen hover:opacity-90"
                        >
                            <FormLoader onProcess={ onProcess } label="Yes, I'm sure." loadingLabel="Ordering Supplies" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}