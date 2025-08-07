"use client";

import { Download, FileSpreadsheet, SquareMinus, Truck } from "lucide-react";
import { SetStateAction } from "react";
import { OrderStatusBadge } from "@/components/ui/badge";
import { SupplyOrder } from "@/types/supplyOrder";
import { formatDateToWords, formatToPeso } from "@/lib/formatter";
import { ViewOrderModal } from "@/app/admin/inventory/order-request/_components/ViewOrderModal";
import { ViewFullOrder } from "@/app/admin/inventory/order-request/_components/ViewFullOrder";
import { OrdersAccordion } from "./OrdersAccordion";
import { SupplyOrderService } from "@/services/SupplyOrderService";
import { InventoryService } from "@/services/InventoryService";
import { Checkbox } from "@/components/ui/checkbox";
import { Claim } from "@/types/claims";

interface Props {
    claims: Claim;
    filteredOrders: SupplyOrder[];
    setToEdit: (i: SupplyOrder | undefined) => void;
    setReload: React.Dispatch<SetStateAction<boolean>>;
    setActiveTab: (i: string) => void;
    selectedOrder: SupplyOrder | undefined;
    setSelectedOrder: (i: SupplyOrder | undefined) => void;
}

export function PendingOrders({ claims, filteredOrders, setToEdit, setReload, setActiveTab, selectedOrder, setSelectedOrder }: Props) {
    async function handleReceived(id: number, meatApproved: boolean, snowApproved: boolean) {
        try {
            await SupplyOrderService.updateOrderStatus(id, "DELIVERED", meatApproved, snowApproved);
            await InventoryService.createInventoryOrder({
                branchId: claims.branch.branchId,
                type: "IN",
                source: "ORDER",
                orderId: id,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setReload(prev => !prev);
        }
    }
    if (selectedOrder) return <ViewFullOrder 
        claims={ claims }
        selectedOrder={ selectedOrder } 
        setSelectedOrder={ setSelectedOrder }
        setReload={ setReload }
    />
    return(
        <section>
            <div className="flex items-center bg-slate-200 font-semibold rounded-sm mt-2">
                <div className="w-15 py-1 border-r-1 border-amber-50"><SquareMinus className="w-4 h-4 mx-auto" strokeWidth={ 3 }/></div>
                <div className="w-15 py-1 border-r-1 border-amber-50"><FileSpreadsheet className="w-4 h-4 mx-auto" strokeWidth={ 3 }/></div>
                <div className="w-35 text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Status</div>
                <div className="grid grid-cols-5 w-full">
                    <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50 col-span-3">Orders</div>
                    <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Total Amount</div>
                    <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Order Date</div>
                </div>
            </div>

            {filteredOrders.length > 0 ?
                filteredOrders.map((item, index) => (
                    <div className="flex items-center bg-light rounded-b-sm shadow-xs" key={ index }>
                        <button 
                            onClick={ () => setSelectedOrder(item) }
                            className="w-15 text-xs text-center text-gray hover:text-dark"
                        >
                            View Full
                        </button>
                        <div className="w-15 flex justify-center"><button><Download className="w-4 h-4 text-gray" strokeWidth={ 2 }/></button></div>
                        <div className="w-35 flex text-sm pl-2 py-1.5 border-b-1">
                            <div className="my-auto"><OrderStatusBadge status={item.status} /></div>
                        </div>
                        <div className="grid grid-cols-5 w-full">
                            <div className="col-span-3">
                                <OrdersAccordion 
                                    order={ item } 
                                    setActiveTab={ setActiveTab }
                                    setSelectedOrder={ setToEdit }
                                />
                            </div>
                            <div className="flex text-sm pl-2 py-1.5 border-b-1">
                                <div className="my-auto">{ formatToPeso(item.completeOrderTotalAmount) }</div>
                            </div>
                            <div className="flex text-sm pl-2 py-1.5 border-b-1">
                                <div className="my-auto">{ formatDateToWords(item.orderDate) }</div>
                            </div>
                        </div>
                    </div>
                )) : (<div className="my-2 text-sm text-center col-span-6">There are no previous orders yet.</div>)
            }
            <div className="text-gray text-sm ms-2">Showing { filteredOrders.length.toString() } of { filteredOrders.length.toString() } results.</div>

        </section>
    );
}

