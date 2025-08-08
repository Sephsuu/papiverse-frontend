"use client"

import { Button } from "@/components/ui/button";
import { PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { formatDateToWords, getWeekday } from "@/lib/formatter";
import { InventoryService } from "@/services/InventoryService";
import { InventoryLog } from "@/types/inventory-log";
import { Download, Funnel } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function InventoryLogs() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [logs, setLogs] = useState<InventoryLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<InventoryLog[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await InventoryService.getInventoryAudits(claims.branch.branchId);
                setLogs(data);                
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [claims]);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredLogs(logs.filter(
                (i) => i.source.toLowerCase().includes(find) ||
                i.orderId!.toString().includes(find)
            ))
        } else setFilteredLogs(logs);
    }, [search, logs]);

    const groupedByDateAndOrder = filteredLogs.reduce<Record<string, Record<string, InventoryLog[]>>>((acc, log) => {
        if (!log.dateTime) {
            return acc; 
        }
        const dateOnly = log.dateTime.slice(0, 10);
        if (!acc[dateOnly]) {
            acc[dateOnly] = {};
        }
        const orderKey = String(log.orderId);
        if (!acc[dateOnly][orderKey]) {
            acc[dateOnly][orderKey] = [];
        }
        acc[dateOnly][orderKey].push(log);
        return acc;
    }, {});
    console.log(groupedByDateAndOrder);
    
    function flattenGroupedLogsWithOrders(
        groupedLogsByDateOrder: Record<string, Record<string, InventoryLog[]>>
        ): { date: string; orders: { orderId: string | null; logs: InventoryLog[] }[] }[] {
        const result: { date: string; orders: { orderId: string | null; logs: InventoryLog[] }[] }[] = [];

        Object.entries(groupedLogsByDateOrder).forEach(([date, orders]) => {
            const ordersList: { orderId: string | null; logs: InventoryLog[] }[] = [];

            Object.entries(orders).forEach(([orderId, logs]) => {
            const parsedOrderId = orderId === "null" ? null : orderId;
            ordersList.push({ orderId: parsedOrderId, logs });
            });

            result.push({ date, orders: ordersList });
        });

        return result;
    }
    if (loading || authLoading) return <PapiverseLoading />
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
                <div className="text-xl font-semibold">Inventory Logs</div>
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
                    placeholder="Search for an inventory log"
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
                    {/* <Button 
                        onClick={ () => setActiveTab(prev => !prev) }
                        className="!bg-darkorange text-light shadow-xs hover:opacity-90"
                    >
                        {activeTab ? <><History />Order History</> : <><CircleFadingArrowUp />Pending Requests</>}
                    </Button> */}
                </div>
            </div>

            {flattenGroupedLogsWithOrders(groupedByDateAndOrder).map((item, index) => (
                <div className="my-1" key={ item.date }>
                    <Accordion type="multiple">
                        <div className="flex gap-2 items-center w-fit font-semibold py-2 px-4 border-1 border-gray-300 shadow-xs bg-light rounded-t-xl z-50">
                            <div>{formatDateToWords(item.date)}</div> 
                            <div className="bg-dark h-fit rounded-sm text-light px-2 font-semibold text-[10px]">{getWeekday(item.date)}</div>
                        </div>
                        {item.orders.map((subItem, index) => (
                            <AccordionItem value={ String(subItem.orderId) } key={ index }>
                                <AccordionTrigger className="rounded-none bg-light px-4 shadow-xs">
                                    <div className="w-full grid grid-cols-4">
                                        <div>Order ID: <span className="font-semibold">{ subItem.orderId || "None" }</span></div>
                                        <div>Source: <span className="font-semibold">{ subItem.logs[0].source }</span></div>
                                        <div>Type: <span className="font-semibold">{ subItem.logs[0].type === "IN" ? "INGOING" : "OUTGOING" }</span></div>
                                        <div className="font-semibold">{ subItem.logs[0].branchName }</div>
                                    </div>
                                </AccordionTrigger> 
                                <AccordionContent className="px-4 bg-light border-b-darkred border-1">
                                    
                                        {subItem.logs.map((subSubItem, index) => (
                                            <Fragment key={ index }>
                                                <div className="grid grid-cols-4 py-2">
                                                    <div>{ subSubItem.rawMaterialCode }</div>
                                                    <div>Qty: { subSubItem.quantityChanged }</div>
                                                    <div>{ subSubItem.rawMaterialName }</div>
                                                    <div>{ subSubItem.dateTime }</div>
                                                </div>
                                                <Separator />
                                            </Fragment>
                                        ))}
                                    
                                </AccordionContent>
                            </AccordionItem>
        
                        ))}
                    </Accordion>
                    
                </div>
            ))}
        </section>
    );
}