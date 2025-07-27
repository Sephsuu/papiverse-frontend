"use client";

import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileSpreadsheet, Funnel, History, SquareMinus } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { OrderStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { SupplyOrderService } from "@/services/SupplyOrderService";
import { SupplyOrder } from "@/types/supplyOrder";
import { PapiverseLoading } from "@/components/ui/loader";
import { Toaster } from "@/components/ui/sonner";
import { formatDateToWords, formatToPeso } from "@/lib/formatter";
import { ViewOrderModal } from "./_components/ViewOrderModal";
import { ViewFullOrder } from "./_components/ViewFullOrder";


export default function OrderSupplyTable() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false); 
    const [search, setSearch] = useState('');

    const [toView, setToView] = useState<SupplyOrder>();
    const [selectedOrder, setSelectedOrder] = useState<SupplyOrder>();
    const [orders, setOrders] = useState<SupplyOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<SupplyOrder[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data: SupplyOrder[] = await SupplyOrderService.getAllSupply();
                const pendingOrders = data.filter((i: SupplyOrder) => ['PENDING', 'TO FOLLOW'].includes(i.status));
                setOrders(pendingOrders);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [reload]);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredOrders(orders.filter(
                (i) => i.snowfrostCategory?.snowFrostOrderId.toString().toLowerCase().includes(find) ||
                i.meatCategory?.meatOrderId.toString().toLowerCase().includes(find) ||
                i.branchName.toLowerCase().includes(find)
            ))
        } else setFilteredOrders(orders);
    }, [search, orders]);

    if (loading) return <PapiverseLoading />
    if (selectedOrder) return <ViewFullOrder 
        selectedOrder={ selectedOrder } 
        setSelectedOrder={ setSelectedOrder }
        setReload={ setReload }
    />
    return(
        <section className="w-full px-2 py-4">
            <Toaster closeButton position="top-center" />
            <div className="flex items-center gap-2">
                <Image
                    src="/images/kp_logo.png"
                    alt="KP Logo"
                    width={40}
                    height={40}
                />
                <div className="text-xl font-semibold">Supply Order Requests</div>
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
                    <Button className="!bg-darkorange text-light shadow-xs hover:opacity-90">
                        <History />
                        <Link href="/admin/inventory/order-request/history">Order History</Link>
                    </Button>
                </div>
            </div>

            <div className="flex items-center bg-slate-200 font-semibold rounded-sm mt-2">
                <div className="w-[5%] py-1 border-r-1 border-amber-50"><SquareMinus className="w-4 h-4 mx-auto" strokeWidth={ 3 }/></div>
                <div className="w-[5%] py-1 border-r-1 border-amber-50"><FileSpreadsheet className="w-4 h-4 mx-auto" strokeWidth={ 3 }/></div>
                <div className="grid grid-cols-5 w-full">
                    <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Branch Name</div>
                    <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Date Requested</div>
                    <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Status</div>
                    <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Order ID</div>
                    <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Total Amount</div>
                </div>
            </div>

            
            {orders.length > 0 ?
                filteredOrders.map((item, index) => (
                    <div className="flex items-center bg-light rounded-b-sm shadow-xs" key={ index }>
                        <button 
                            onClick={ () => setSelectedOrder(item) }
                            className="w-[5%] text-xs text-center text-gray hover:text-dark"
                        >
                            View Full
                        </button>
                        <div className="w-[5%] flex justify-center"><button><Download className="w-4 h-4 text-gray" strokeWidth={ 2 }/></button></div>
                        <div className="grid grid-cols-5 w-full">
                                <div className="flex text-sm pl-2 py-1.5 border-b-1">
                                    <button className="my-auto"
                                        onClick={ () => setToView(item) }
                                    >{ item.branchName }</button></div>
                                <div className="flex text-sm pl-2 py-1.5 border-b-1 truncate"><div className="my-auto">{ formatDateToWords(item.orderDate) }</div></div>
                                <div className="flex text-sm pl-2 py-1.5 border-b-1"><div className="my-auto"><OrderStatusBadge status={item.status} /></div></div>
                                <div className="text-sm pl-2 py-1.5 border-b-1 truncate">
                                    <div>{ item.meatCategory?.meatOrderId }</div>
                                    <div>{ item.snowfrostCategory?.snowFrostOrderId }</div>
                                </div>
                                <div className="flex text-sm pl-2 py-1.5 border-b-1"><div className="my-auto">{ formatToPeso(item.completeOrderTotalAmount) }</div></div>
                        </div>
                    </div>
                )) : (<div className="my-2 text-sm text-center col-span-6">There are no existing users yet.</div>)
            }
            <div className="text-gray text-sm ms-2">Showing { filteredOrders.length.toString() } of { filteredOrders.length.toString() } results.</div>

            
            {toView && (
                <ViewOrderModal
                    toView={ toView }
                    setToView={ setToView }
                    setReload={ setReload }
                />
            )}
        </section>
    );
}

