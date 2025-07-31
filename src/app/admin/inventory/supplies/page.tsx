"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { BadgeCheck, Download, Funnel, Info, Plus, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

export default function SuppliesTable() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [onProcess, setProcess] = useState(false);
    const [search, setSearch] = useState('');
    const [toDelete, setDelete] = useState<Supply | undefined>();

    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [filteredSupplies, setFilteredSupplies] = useState<Supply[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await SupplyService.getAllSupplies();
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
                    <Button className="!bg-darkorange text-light shadow-xs hover:opacity-90">
                        <Plus />
                        <Link href="/admin/inventory/supplies/add-supply">Add a supply</Link>
                    </Button>
                </div>
                
            </div>

            <div className="grid grid-cols-6 bg-slate-200 font-semibold rounded-sm mt-2">
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">SKU ID</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Supply Name</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Unit</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Internal Price</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">External Price</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Action</div>
            </div>

            <div className="grid grid-cols-6 bg-light rounded-b-sm shadow-xs">
                {supplies.length > 0 ?
                    filteredSupplies.map((item, index) => (
                        <Fragment key={ index }>
                            <div className="text-sm pl-2 py-1.5 border-b-1">{ item.code }</div>
                            <div className="text-sm pl-2 py-1.5 border-b-1">{ item.name }</div>
                            <div className="text-sm pl-2 py-1.5 border-b-1">{ `${item.unitQuantity} ${item.unitMeasurement}` }</div>
                            <div className="text-sm pl-2 py-1.5 border-b-1">{ formatToPeso(item.unitPriceInternal!) }</div>
                            <div className="text-sm pl-2 py-1.5 border-b-1">{ formatToPeso(item.unitPriceExternal!) }</div>
                            <div className="flex items-center pl-2 gap-3 border-b-1">
                                <Link href={`/admin/inventory/supplies/edit-supply/${item.code}`}><SquarePen className="w-4 h-4 text-darkgreen" /></Link>
                                <button><Info className="w-4 h-4" /></button>
                                <button
                                    onClick={ () => setDelete(item) }
                                >
                                    <Trash2 className="w-4 h-4 text-darkred" />
                                </button>
                            </div>
                        </Fragment>
                    ))
                    : (<div className="my-2 text-sm text-center col-span-6">There are no existing users yet.</div>)
                }
            </div>
            <div className="text-gray text-sm">Showing { filteredSupplies.length.toString() } of { filteredSupplies.length.toString() } results.</div>

            <Dialog open={ !!toDelete } onOpenChange={ (open) => { if (!open) setDelete(undefined) }}>
                <DialogContent>
                    <DialogTitle className="text-sm">Are you sure you want to delete supply { `${toDelete?.name}` }</DialogTitle>
                    <div className="flex justify-end items-end gap-2">
                        <Button 
                            onClick={ () => setDelete(undefined) }
                            variant="secondary"
                        >
                            Close
                        </Button>
                        <Button
                            className="!bg-darkred"
                            onClick={ () => handleDelete() }
                        >
                            {!onProcess && <Trash2 className="w-4 h-4 text-light" />}
                            <FormLoader onProcess={ onProcess } label="Delete Supply" loadingLabel="Deleting Supply" /> 
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}