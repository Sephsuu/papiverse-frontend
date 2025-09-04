import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { paidOrders } from "@/lib/data-array";
import { formatToPeso } from "@/lib/formatter";

export function PaidOrdersAccordion() {
    // Calculate total of all paid orders
    const grandTotal = paidOrders.reduce((acc, order) => acc + order.totalPaid, 0);

    return(
        <section>
            <Accordion type="multiple">
                <AccordionItem value="1">
                    <AccordionTrigger className="flex justify-between bg-white p-4 !h-fit border-1 shadow-sm font-semibold">
                        <div>September 30, 2004</div>
                        <div className="font-medium">Total Orders: <span className="font-semibold">35</span></div>
                        <div className="font-medium">Total Sales: <span className="font-semibold">{ formatToPeso(grandTotal) }</span></div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white p-4">
                        <div className="grid grid-cols-5 data-table-thead">
                            <div className="data-table-th">Order ID</div>
                            <div className="data-table-th">Products</div>
                            <div className="data-table-th">Total Paid</div>
                            <div className="data-table-th">Type</div>
                            <div className="data-table-th">Payment Time</div>
                        </div>
                        {paidOrders.map((item, index) => (
                            <div className="grid grid-cols-5 border-b-1 border-dark" key={ index }>
                                <div className="data-table-td px-2">{ item.orderId }</div>
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
                                <div className="data-table-td px-2">{ formatToPeso(item.totalPaid) }</div>
                                <div className="data-table-td px-2">{ item.status }</div>
                                <div className="data-table-td px-2">{ item.paymentTime }</div>

                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>
    );
}