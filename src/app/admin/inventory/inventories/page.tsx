"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectTrigger } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { formatToPeso } from "@/lib/formatter";
import { InventoryService } from "@/services/InventoryService";
import { SupplyService } from "@/services/RawMaterialService";
import { Inventory } from "@/types/inventory";
import { SelectValue } from "@radix-ui/react-select";
import { Download, Funnel, Ham, Info, Plus, Snowflake, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateInventory } from "./_components/CreateInventory";
import { Pagination } from "@/components/ui/pagination";

export default function InventoryTable() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [onProcess, setProcess] = useState(false);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [pagination, setPagination] = useState({ page: 0, size: 20 , numberOfElements : 0});
    const [paginationTotal, setPaginationTotal] = useState({totalPage : 0, totalElements : 0});
    const [toDelete, setDelete] = useState<Inventory | undefined>();

    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [filteredInventories, setFilteredInventories] = useState<Inventory[]>([]);

    useEffect(() => {
        async function fetchData(page : number, size : number) {
            try {
                const data = await InventoryService.getInventoryByBranch(claims.branch.branchId, page, size);
                setInventories(data.content);
                 setPaginationTotal(prev =>  ({
                    ...prev,
                    totalPage : data.totalPages,
                    totalElements: data.totalElements
                }))
                setPagination(prev =>  ({
                    ...prev,
                    numberOfElements : data.numberOfElements
                }))
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData(pagination.page, pagination.size);
    }, [claims, reload, pagination]);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredInventories(inventories.filter(
                (i) => i.name!.toLowerCase().includes(find)
            ))
        } else setFilteredInventories(inventories);
    }, [search, inventories]);

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
                <div className="text-xl font-semibold">All Inventories</div>
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
                    placeholder="Search for an inventory"
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
                        onClick={ () => setOpen(!open) }
                        className="!bg-darkorange text-light shadow-xs hover:opacity-90"
                    >
                        <Plus /> Add an inventory
                    </Button>
                </div>
                
            </div>
            <div className="grid grid-cols-5 bg-slate-200 font-semibold rounded-sm mt-2">
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">SKU ID</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Supply Name</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Stock <span className="font-normal">(qty |unit)</span></div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Unit Price</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Action</div>
            </div>
            <div className="grid grid-cols-5 bg-light rounded-b-sm shadow-xs">
                {inventories.length > 0 ?
                    filteredInventories.map((item, index) => (
                        <Fragment key={ index }>
                            <div className="data-table-td">{ item.code }</div>
                            <div className="data-table-td flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger>
                                        {item.category === 'MEAT' ? <Ham className="w-4 h-4 text-darkbrown"/> : <Snowflake className="w-4 h-4 text-blue" />}
                                    </TooltipTrigger>
                                    <TooltipContent>{ item.category === 'MEAT' ? "MEAT Category" : "SNOW FROST Category"}</TooltipContent>
                                </Tooltip>
                                <div>{ item.name }</div>
                            </div>
                            <div className="flex items-center data-table-td">
                                <div className="w-15 text-end pr-3">{ item.quantity }</div>
                                <div>{ item.unitMeasurement }</div>
                            </div>
                            <div className="data-table-td">{ formatToPeso(item.unitPrice!) }</div>
                            <div className="flex items-center gap-3 data-table-td">
                                <button onClick={ () => setOpen(!open) }><SquarePen className="w-4 h-4 text-darkgreen" /></button>
                                <button><Info className="w-4 h-4" /></button>
                                <button
                                    onClick={ () => setDelete(item) }
                                >
                                    <Trash2 className="w-4 h-4 text-darkred" />
                                </button>
                            </div>
                        </Fragment>
                    ))
                    : (<div className="my-2 text-sm text-center col-span-6">There are no existing inventories yet.</div>)
                }
            </div>
           <Pagination pagination={pagination} paginationTotal={paginationTotal} setPagination={setPagination}/>
            {open && (
                <CreateInventory 
                    claims={ claims }
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}
        </section>
    )
}