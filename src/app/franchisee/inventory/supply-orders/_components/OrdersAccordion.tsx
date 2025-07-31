import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { formatToPeso } from "@/lib/formatter";
import { SupplyOrder } from "@/types/supplyOrder";
import { Fragment } from "react";

export function OrdersAccordion({ order }: { order: SupplyOrder}) {
    return(
        <Accordion type="multiple" className="mx-4">
            <AccordionItem value={ String(order.meatCategory!.meatOrderId) }>
                <AccordionTrigger className="h-fit m-0 py-2">
                    <div>Meat Supplies - { order.meatCategory!.meatOrderId }</div>
                    <div className={`text-xs ms-auto ${order.meatCategory!.isApproved ? "text-darkgreen" : "text-darkred"}`}>{order.meatCategory!.isApproved ? "Approved" : "Not Approved"}</div>
                </AccordionTrigger> 
                    {order.meatCategory!.meatItems.length > 0 ? (
                        <AccordionContent className="grid grid-cols-4">
                            <div className="text-sm my-1">SKU ID</div>
                            <div className="text-sm my-1">Item Name</div>
                            <div className="text-sm my-1 text-center">Qty</div>
                            <div className="text-sm my-1">Amount</div>
                        {order.meatCategory!.meatItems.map((item, index) => (
                            <Fragment key={ index }>
                                <div className="text-sm text-gray my-1">{ item.rawMaterialCode }</div>
                                <div className="text-sm text-gray my-1">{ item.rawMaterialName }</div>
                                <div className="text-sm text-gray text-center my-1">{ item.quantity }</div>
                                <div className="text-sm text-gray my-1">{ formatToPeso(item.price) }</div>
                            </Fragment>
                        ))}
                            <Separator className="text-gray col-span-4" />
                            <div className="col-span-3 text-sm text-center mt-2">Total:</div>
                            <div className="mt-2 text-sm">{ formatToPeso(order.meatCategory!.categoryTotal ) }</div>
                        </ AccordionContent>
                    ) : (
                        <AccordionContent className="text-center text-gray py-1 font-semibold">You don't have an order for meat</AccordionContent>
                    )}
            </AccordionItem>
            <AccordionItem value={ String(order.snowfrostCategory!.snowFrostOrderId) }>
                <AccordionTrigger className="h-fit m-0 py-2">
                    <div>Snow Frost Supplies - { order.snowfrostCategory!.snowFrostOrderId }</div>
                    <div className={`text-xs ms-auto ${order.snowfrostCategory!.isApproved ? "text-darkgreen" : "text-darkred"}`}>{order.snowfrostCategory!.isApproved ? "Approved" : "Not Approved"}</div>
                </AccordionTrigger> 
                {order.snowfrostCategory!.snowFrostItems.length > 0 ? (
                    <AccordionContent className="grid grid-cols-4">
                        <div className="font-semibold text-sm my-1">SKU ID</div>
                        <div className="font-semibold text-sm my-1">Item Name</div>
                        <div className="font-semibold text-sm my-1 text-center">Qty</div>
                        <div className="font-semibold text-sm my-1">Amount</div>
                    {order.snowfrostCategory!.snowFrostItems.map((item, index) => (
                        <Fragment key={ index }>
                            <div className="text-sm text-gray my-1">{ item.rawMaterialCode }</div>
                            <div className="text-sm text-gray my-1">{ item.rawMaterialName }</div>
                            <div className="text-sm text-gray text-center my-1">{ item.quantity }</div>
                            <div className="text-sm text-gray my-1">{ formatToPeso(item.price) }</div>
                        </Fragment>
                    ))}
                        <Separator className="text-gray col-span-4" />
                        <div className="col-span-3 text-sm text-center mt-2">Total:</div>
                        <div className="mt-2 text-sm">{ formatToPeso(order.snowfrostCategory!.categoryTotal ) }</div>
                    </ AccordionContent>
                ) : (
                    <AccordionContent className="text-center text-gray py-1 font-semibold">You don't have an order for snow frost</AccordionContent>
                )}
            </AccordionItem>
        </Accordion>
    );
}