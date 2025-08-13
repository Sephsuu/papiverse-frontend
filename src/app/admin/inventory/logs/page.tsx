"use client"

import { Button } from "@/components/ui/button";
import { PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { InventoryService } from "@/services/InventoryService";
import { InventoryLog } from "@/types/inventory-log";
import { Download, Funnel } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OrderLogs } from "./_components/OrderLogs";
import { InputLogs } from "./_components/InputLogs";

const tabs = ['Order Logs', 'Input Logs'];

export default function InventoryLogs() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [logs, setLogs] = useState<InventoryLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<InventoryLog[]>([]);
    const [activeTab, setActiveTab] = useState('Input Logs');

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await InventoryService.getInventoryAudits(claims.branch.branchId, 0, 1000);
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
                (i.orderId !== null && i.orderId !== undefined && i.orderId.toString().includes(find)) ||
                i.rawMaterialCode.toLowerCase().includes(find) ||
                i.rawMaterialName.toLowerCase().includes(find)
            ))
        } else setFilteredLogs(logs);
    }, [search, logs]);
    
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
            <div className="flex w-fit rounded-full bg-light shadow-xs my-2">
                {tabs.map((item, index) => (
                    <button 
                        onClick={ () => setActiveTab(item) }
                        key={ index }
                        className={ `w-30 py-0.5 rounded-full text-sm ${activeTab === item && "bg-darkorange text-light"}` }
                    >
                        { item }
                    </button>
                ))}
            </div>

            {activeTab === 'Order Logs' && (
                <OrderLogs logs={ filteredLogs.filter(i => i.source === 'ORDER') } />
            )}
            {activeTab === 'Input Logs' && (
                <InputLogs logs={ filteredLogs.filter(i => i.source === 'INPUT') } />
            )}

            
        </section>
    );
}