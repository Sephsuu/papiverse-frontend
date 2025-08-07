"use client";

import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircleFadingArrowUp, Download, Funnel, History } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { SupplyOrderService } from "@/services/SupplyOrderService";
import { SupplyOrder } from "@/types/supplyOrder";
import { PapiverseLoading } from "@/components/ui/loader";
import { Toaster } from "@/components/ui/sonner";
import { ViewFullOrder } from "./_components/ViewFullOrder";
import { PendingOrders } from "./_components/PendingOrders";
import { OrderHistory } from "./_components/OrderHistory";
import { useAuth } from "@/hooks/use-auth";
import { ViewOrderModal } from "./_components/ViewOrderModal";
import AddRemarks from "./_components/AddRemarks";


export default function OrderSupplyTable() {
    const { claims, loading: authLoading} = useAuth();
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false); 
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState(true);

    const [open, setOpen] = useState(false);
    const [toView, setToView] = useState<SupplyOrder | undefined>();
    const [selectedOrder, setSelectedOrder] = useState<SupplyOrder | undefined>();
    const [orders, setOrders] = useState<SupplyOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<SupplyOrder[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data: SupplyOrder[] = await SupplyOrderService.getAllSupply();
                setOrders(data);
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

    if (loading || authLoading) return <PapiverseLoading />
    if (selectedOrder) return <ViewFullOrder 
        claims={ claims }
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
                <div className="text-xl font-semibold">
                    {activeTab ? "Pending Supply Orders" : "Supply Order History"}
                </div>
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
                        onClick={ () => setActiveTab(prev => !prev) }
                        className="!bg-darkorange text-light shadow-xs hover:opacity-90"
                    >
                        {activeTab ? <><History />Order History</> : <><CircleFadingArrowUp />Pending Requests</>}
                    </Button>
                </div>
            </div>

            {activeTab && <PendingOrders 
                filteredOrders={ filteredOrders.filter(i => ["PENDING", "TO FOLLOW"].includes(i.status)) }
                setReload={ setReload }
                setToView={ setToView }
                setSelectedOrder={ setSelectedOrder }
            />}
            {!activeTab && <OrderHistory 
                filteredOrders={ filteredOrders.filter(i => ["APPROVED", "REJECTED", "DELIVERED"].includes(i.status)) }
                setReload={ setReload }
                toView={ toView }
                setToView={ setToView }
                selectedOrder={ selectedOrder }
                setSelectedOrder={ setSelectedOrder }
            />}

            {toView && (
                <ViewOrderModal
                    claims={ claims }
                    toView={ toView }
                    setToView={ setToView }
                    setReload={ setReload }
                />
            )}
            

        </section>
    );
}

