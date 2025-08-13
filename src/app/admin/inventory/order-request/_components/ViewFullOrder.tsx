import { OrderStatusLabel, QuantityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormLoader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { FullOorderSkeleton, OrderModalSkeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { formatDateToWords, formatToPeso } from "@/lib/formatter";
import { InventoryService } from "@/services/InventoryService";
import { SupplyOrderService } from "@/services/SupplyOrderService";
import { Claim } from "@/types/claims";
import { Inventory } from "@/types/inventory";
import { SupplyOrder } from "@/types/supplyOrder";
import { Ham, Snowflake } from "lucide-react";
import Image from "next/image";
import { SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    claims: Claim;
    selectedOrder: SupplyOrder;
    setSelectedOrder: (i: SupplyOrder | undefined) => void;
    setReload: React.Dispatch<SetStateAction<boolean>>;
}

export function ViewFullOrder({ claims, selectedOrder, setSelectedOrder, setReload }: Props) {
    const [loading, setLoading] = useState(true);
    const [onProcess, setProcess] = useState(false);
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [meatApproved, setMeatApproved] = useState(selectedOrder.meatCategory?.isApproved);
    const [snowApproved, setSnowApproved] = useState(selectedOrder.snowfrostCategory?.isApproved);

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const data = await InventoryService.getInventoryByBranch(claims.branch.branchId);
    //             setInventory(data);
    //             setLoading(false);
    //         } catch (error) { `${error}` }
    //     }
    //     fetchData();
    // }, []);

    function enableSave(meatApproved: boolean, snowApproved: boolean) {
        if (meatApproved !== selectedOrder.meatCategory!.isApproved || snowApproved !== selectedOrder.snowfrostCategory!.isApproved) {
            return false;
        }
        return true;
    }

    async function handleSubmit(meatApproved: boolean, snowApproved: boolean, isRejected = false) {
        try {
            setProcess(true);
            if (isRejected) {
                await SupplyOrderService.updateOrderStatus(selectedOrder.orderId!, "REJECTED", meatApproved, snowApproved)
                return toast.success(`Order ${selectedOrder.meatCategory!.meatOrderId} and ${selectedOrder.snowfrostCategory!.snowFrostOrderId} updated status to REJECTED`);
            }
            if (meatApproved && snowApproved) {      
                await SupplyOrderService.updateOrderStatus(selectedOrder.orderId!, "APPROVED", meatApproved, snowApproved)
                toast.success(`Order ${selectedOrder.meatCategory!.meatOrderId} and ${selectedOrder.snowfrostCategory!.snowFrostOrderId} updated status to APPROVED`);
                return await InventoryService.createInventoryOrder({
                    "branchId" : claims.branch.branchId,
                    "type" : "OUT",
                    "source" : "ORDER",
                    "orderId" : selectedOrder.orderId
                });
            }
            if (!meatApproved && !snowApproved) {
                await SupplyOrderService.updateOrderStatus(selectedOrder.orderId!, "PENDING", meatApproved, snowApproved)
                return toast.success(`Order ${selectedOrder.meatCategory!.meatOrderId} and ${selectedOrder.snowfrostCategory!.snowFrostOrderId} updated status to PENDING`);
            }
            if (meatApproved || snowApproved) {
                await SupplyOrderService.updateOrderStatus(selectedOrder.orderId!, "TO_FOLLOW", meatApproved, snowApproved)
                return toast.success(`Order ${selectedOrder.meatCategory!.meatOrderId} and ${selectedOrder.snowfrostCategory!.snowFrostOrderId} updated status to TO FOLLOW`);
            }
        } catch (error) { toast.error(`${error}`) } 
        finally {
            setProcess(false);
            setSelectedOrder(undefined);
            setReload(prev => !prev);
        }
    }

    if (loading) return <FullOorderSkeleton />
    return(
        <section className="w-full m-2 pb-20">
            <Toaster closeButton position="top-center" />
            <div className="flex justify-between items-center">
                <OrderStatusLabel status={ selectedOrder.status } />
                <div className="flex  gap-2 my-2">
                    {claims.roles[0] === 'FRANCHISOR' && (
                        <Button className="!bg-darkgreen hover:opacity-90" 
                            disabled={ enableSave(meatApproved!, snowApproved!) }
                            onClick={ () => handleSubmit(meatApproved!, snowApproved!) }
                        >
                            <FormLoader onProcess={ onProcess } label="Save Order" loadingLabel="Saving Order" />
                        </Button>
                    )}
                    <Button onClick={ () => setSelectedOrder(undefined) }>Back to Orders</Button>
                </div>
            </div>
            <div className="relative p-4 bg-white rounded-md shadow-sm">
                {claims.roles[0] === 'FRANCHISOR' && (
                    <div className="top-2 left-2 flex items-center gap-1">
                        <Checkbox id="meat" 
                            className="rounded-full border-gray data-[state=checked]:bg-darkgreen" 
                            checked={ meatApproved }
                            onCheckedChange={(checked: boolean) => setMeatApproved(checked)}
                        />
                        <label htmlFor="meat" className="text-sm font-semibold">
                            {meatApproved ? 'Approved' : 'Approve'}
                        </label>
                    </div>
                )}
                <Image src="/images/kp_logo.png" alt="KP Logo" width={60} height={60} className="top-2 right-2 absolute" />
                <div className="flex justify-center items-center gap-2">
                    <Ham />
                    <div className="font-semibold">Meat Supply Order Receipt</div>
                </div>
                {claims.roles[0] === 'FRANCHISOR' ? <div className="text-center text-sm text-gray">Showing only the order form receipt for this meat order.</div> : <div className="text-center text-sm text-gray">Please review carefully your order form.</div>}
                <div className="grid grid-cols-2 gap-1 mt-2">
                    <div className="text-sm"><span className="font-bold">No: </span>{ selectedOrder.meatCategory!.meatOrderId }</div>
                    <div className="text-sm ms-auto"><span className="font-bold">To: </span>{ "KP Comissary" }</div>
                    <div className="text-sm"><span className="font-bold">Date</span> { formatDateToWords(selectedOrder.orderDate) }</div>
                    <div className="text-sm ms-auto"><span className="font-bold">Tel No: </span>{ "09475453783" }</div>
                    <div className="text-sm col-span-2"><span className="font-bold">Delivery within: </span>{ selectedOrder.branchName }</div>
                </div>
                <div>
                    <div className="grid grid-cols-6 mt-4">
                        <div className="text-sm font-bold mx-auto">No.</div>
                        <div className="text-sm font-bold">SKU ID</div>
                        <div className="text-sm font-bold">Supply Description</div>
                        <div className="text-sm font-bold pl-2">Qty</div>
                        <div className="text-sm font-bold">Unit Price</div>
                        <div className="text-sm font-bold">Total Amount</div>
                    </div>
                    <Separator className="my-2 bg-gray" />
                    {selectedOrder.meatCategory!.meatItems.length > 0 ? 
                        selectedOrder.meatCategory!.meatItems.map((supply, index) => {
                            const currentStock = inventory.find(i => i.code === supply.rawMaterialCode)?.quantity;
                            return(
                                <div className="grid grid-cols-6 my-2" key={ index }>
                                    <div className="text-sm mx-auto">{ index + 1 }</div>
                                    <div className="text-sm">{ supply.rawMaterialCode }</div>
                                    <div className="text-sm">{ supply.rawMaterialName }</div>
                                    <div className="text-sm font-semibold pl-2">{ supply.quantity } <QuantityBadge stock={ currentStock! } className="scale-90" /></div>
                                    <div className="text-sm">{ formatToPeso(supply.price) }</div>
                                    <div className="text-sm">{ formatToPeso(supply.price * supply.quantity) }</div>
                                </div>  
                            )})
                    : (
                        <div className="text-sm text-gray font-semibold text-center py-2">You have no orders for MEAT category.</div>
                    )}
                    <Separator className="my-4 bg-gray" />
                    <div className="grid grid-cols-6 font-bold text-sm mt-4">
                        <div className="col-span-5 text-center">Total</div>
                        <div>{ formatToPeso(selectedOrder.meatCategory!.categoryTotal) }</div>
                    </div>
                </div>
            </div>
            <div className="relative p-4 bg-white rounded-md shadow-sm mt-4">
                {claims.roles[0] === 'FRANCHISOR' && (
                    <div className="flex items-center gap-1">
                        <Checkbox id="snow" 
                            className="rounded-full border-gray data-[state=checked]:bg-darkgreen" 
                            checked={ snowApproved }
                            onCheckedChange={(checked: boolean) => setSnowApproved(checked)}
                        />
                        <label htmlFor="snow" className="text-sm font-semibold">
                            {snowApproved ? 'Approved' : 'Approve'}
                        </label>
                    </div>
                )}
                <Image src="/images/kp_logo.png" alt="KP Logo" width={60} height={60} className="top-2 right-2 absolute" />
                <div className="flex justify-center items-center gap-2">
                    <Snowflake />
                    <div className="font-semibold">Snow Frost Supply Order Receipt</div>
                </div>
                {claims.roles[0] === 'FRANCHISOR' ? <div className="text-center text-sm text-gray">Showing only the order form receipt for this snow frost order.</div> : <div className="text-center text-sm text-gray">Please review carefully your order form.</div>}
                <div className="grid grid-cols-3">
                    <div className="grid gap-1">
                        <div className="text-sm"><span className="font-bold">No: </span>{ selectedOrder.snowfrostCategory!.snowFrostOrderId }</div>
                        <div className="text-sm"><span className="font-bold">Date</span> { formatDateToWords(selectedOrder.orderDate) }</div>
                        <div className="text-sm"><span className="font-bold">Delivery within: </span>{ selectedOrder.branchName }</div>
                    </div>
                    <div className="text-sm mt-auto"><span className="font-bold">To:</span> { "[KP Commisary]" }</div>
                    <div className="text-sm mt-auto"><span className="font-bold">Tel No.</span> { "[0947 545 3783]" }</div>
                </div>
                <div>
                    <div className="grid grid-cols-6 mt-4">
                        <div className="text-sm font-bold mx-auto">No.</div>
                        <div className="text-sm font-bold">SKU ID</div>
                        <div className="text-sm font-bold">Supply Description</div>
                        <div className="text-sm font-bold pl-2">Qty</div>
                        <div className="text-sm font-bold">Unit Price</div>
                        <div className="text-sm font-bold">Total Amount</div>
                    </div>
                    <Separator className="my-2 bg-gray" />
                    {selectedOrder.snowfrostCategory!.snowFrostItems.length > 0 ? 
                        selectedOrder.snowfrostCategory!.snowFrostItems.map((supply, index) => {
                            const currentStock = inventory.find(i => i.code === supply.rawMaterialCode)?.quantity;
                            return(
                                <div className="grid grid-cols-6 my-2" key={ index }>
                                    <div className="text-sm mx-auto">{ index + 1 }</div>
                                    <div className="text-sm">{ supply.rawMaterialCode }</div>
                                    <div className="text-sm">{ supply.rawMaterialName }</div>
                                    <div className="text-sm font-semibold pl-2">{ supply.quantity } <QuantityBadge stock={ currentStock! } className="scale-90" /></div>
                                    <div className="text-sm">{ formatToPeso(supply.price) }</div>
                                    <div className="text-sm">{ formatToPeso(supply.price * supply.quantity) }</div>
                                </div>  
                            )})
                    : (
                        <div className="text-sm text-gray font-semibold text-center py-2">You have no orders for SNOW FROST category.</div>
                    )}
                    <Separator className="my-4 bg-gray" />
                    <div className="grid grid-cols-6 font-bold text-sm mt-4">
                        <div className="col-span-5 text-center">Total</div>
                        <div>{ formatToPeso(selectedOrder.snowfrostCategory!.categoryTotal) }</div>
                    </div>
                </div>
            </div>

            {/* <div className="flex justify-end gap-2 mt-4">
                <Button onClick={ () => setActiveSection("snow-frost-order-form") } className="w-30 border-1 border-dark bg-white text-dark hover:bg-light">Back</Button>
                <Button onClick={ () => handleSubmit() } className="text-sm w-30">Proceed</Button>
            </div> */}

        </section>
    );
}