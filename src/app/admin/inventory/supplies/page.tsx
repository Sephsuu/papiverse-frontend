"use client"

import { Badge } from "@/components/ui/badge";
import { Button, UpdateButton } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectTrigger } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { formatToPeso } from "@/lib/formatter";
import { BranchService } from "@/services/BranchService";
import { SupplyService } from "@/services/RawMaterialService";
import { UserService } from "@/services/UserService";
import { Branch } from "@/types/branch";
import { Supply } from "@/types/supply";
import { User } from "@/types/user";
import { SelectValue } from "@radix-ui/react-select";
import { BadgeCheck, Download, Funnel, Ham, Info, Plus, Snowflake, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateSupply } from "./_components/CreateSupply";
import { UpdateSupply } from "./_components/UpdateSupply";
import { DeleteSupply } from "./_components/DeleteSupply";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function SuppliesTable() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [onProcess, setProcess] = useState(false);
    const [search, setSearch] = useState('');

    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<Supply>()
    const [toDelete, setDelete] = useState<Supply>();

    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [filteredSupplies, setFilteredSupplies] = useState<Supply[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await SupplyService.getAllSupplies(0, 1000);
                setSupplies(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [reload]);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredSupplies(supplies.filter(
                (i) => i.name!.toLowerCase().includes(find)
            ))
        } else setFilteredSupplies(supplies);
    }, [search, supplies]);

    async function handleDelete() {
        try {
            setProcess(true);
            await SupplyService.deleteSupply(toDelete!.code!);
            toast.success(`Supply ${toDelete?.name} deleted successfully.`);
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setProcess(false); 
            setDelete(undefined);
            setReload(prev => !prev);
        }
    }

    if (loading) return <PapiverseLoading />
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
                <div className="text-xl font-semibold">All Supplies</div>
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
                    placeholder="Search for a supply"
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
                        <Plus />Add a supply
                    </Button>
                </div>
                
            </div>
            <div className="grid grid-cols-6 data-table-thead mt-2">
                <div className="data-table-th">SKU ID</div>
                <div className="data-table-th">Supply Name</div>
                <div className="data-table-th">Unit</div>
                <div className="data-table-th">Internal Price</div>
                <div className="data-table-th">External Price</div>
                <div className="data-table-th">Action</div>
            </div>
            
            {supplies.length > 0 ?
                filteredSupplies.map((item, index) => (
                    <div className="grid grid-cols-6 bg-light border-b-1 shadow-xs" key={ index }>
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
                        <div className="data-table-td">{ `${item.unitQuantity} ${item.unitMeasurement}` }</div>
                        <div className="data-table-td">{ formatToPeso(item.unitPriceInternal!) }</div>
                        <div className="data-table-td">{ formatToPeso(item.unitPriceExternal!) }</div>
                        <div className="flex items-center gap-2 data-table-td">
                            <button onClick={ () => setUpdate(item) }><SquarePen className="w-4 h-4 text-darkgreen" /></button>
                            <button><Info className="w-4 h-4" /></button>
                            <button
                                onClick={ () => setDelete(item) }
                            >
                                <Trash2 className="w-4 h-4 text-darkred" />
                            </button>
                        </div>
                    </div>
                ))
                : (<div className="my-2 text-sm text-center col-span-6">There are no existing users yet.</div>)
            }
            <div className="text-gray text-sm mx-2">Showing { filteredSupplies.length.toString() } of { filteredSupplies.length.toString() } results.</div>

            {open && (
                <CreateSupply 
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toUpdate && (
                <UpdateSupply
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}

            {toDelete && (
                <DeleteSupply
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}

        </section>
    )
}