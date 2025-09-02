import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PaidOrder } from "@/types/sales";
import Image from "next/image";
import { Dispatch, Fragment, SetStateAction } from "react";

interface Props {
    paidOrdersPreview: PaidOrder[];
    setPaidOrdersPreview: Dispatch<SetStateAction<PaidOrder[]>>;
}

export function PaidOrdersPreview({ paidOrdersPreview, setPaidOrdersPreview }: Props) {
    return(
        <Dialog open onOpenChange={ (open) => { if (!open) setPaidOrdersPreview([]) }}>
            <DialogContent>
                <DialogTitle className="flex items-center gap-2">
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-xl">Confirm Insertion of Paid Orders?</div>   
                </DialogTitle>
                <div className="w-full h-[70vh] overflow-auto">
                    <div className="min-w-[1000px] grid grid-cols-6 data-table-thead sticky top-0 z-10">
                        <div className="data-table-th sticky left-0 bg-[#e2e8f0]">Order ID</div>
                        <div className="data-table-th">Type</div>
                        <div className="data-table-th">Status</div>
                        <div className="data-table-th">Total Paid</div>
                        <div className="data-table-th">Products</div>
                        <div className="data-table-th">Payment Time</div>
                    </div>
                    
                        {paidOrdersPreview.map((item, index) => (
                            <div 
                                className="min-w-[1000px] grid grid-cols-6 border-b-1 border-dark"
                                key={ index }
                            >
                                <div 
                                    className="flex center px-2 sticky left-0 shadow-md bg-white" 
                                    key={ index }
                                >
                                    <div className="text-sm px-2">{ item.orderId }</div>
                                </div>
                                <div className="data-table-td px-2">{ item.type }</div>
                                <div className="data-table-td px-2">{ item.status }</div>
                                <div className="data-table-td px-2">{ item.totalPaid }</div>
                                <div>
                                    {item.products.map((subItem, _) => (
                                        <div 
                                            className={`p-2 text-sm ${_ % 2 == 0 ? "bg-[#F5F5F5]" : "bg-[#FCFCFC]"}`}
                                            key={_}
                                        >
                                            { `${subItem.productName} x ${subItem.qty}` }
                                        </div>  
                                    ))}
                                </div>
                                <div className="data-table-td px-2 border-b-1">{ item.paymentTime }</div>
                            </div>
                        ))}
                   
                </div>
            </DialogContent>
        </Dialog>
    );
}