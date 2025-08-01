"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectTrigger } from "@/components/ui/select";
import { BranchService } from "@/services/BranchService";
import { UserService } from "@/services/UserService";
import { Branch } from "@/types/branch";
import { SelectValue } from "@radix-ui/react-select";
import { BadgeCheck, Download, Funnel, Info, Plus, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

export default function BranchesTable() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [onProcess, setProcess] = useState(false);
    const [search, setSearch] = useState('');
    const [toDelete, setDelete] = useState<Branch | undefined>();

    const [branches, setBranches] = useState<Branch[]>([]);
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await BranchService.getAllBranches();
                setBranches(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [reload]);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredBranches(branches.filter(
                (i) => i.branchName!.toLowerCase().includes(find)
            ))
        } else setFilteredBranches(branches);
    }, [search, branches]);

    async function handleDelete() {
        try {
            setProcess(true);
            await BranchService.deleteBranch(toDelete!.branchId!);
            toast.success(`Branch ${toDelete!.branchName} deleted successfully.`)
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setProcess(false); 
            setReload(!reload)
            setDelete(undefined);
        }
    }

    if (loading) return <PapiverseLoading />
    return(
        <section className="w-full py-4 px-2">
            <div className="flex items-center gap-2">
                <Image
                    src="/images/kp_logo.png"
                    alt="KP Logo"
                    width={40}
                    height={40}
                />
                <div className="text-xl font-semibold">All Branches</div>
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
                        <Plus />
                        <Link href="/admin/branches/add-branch">Add a branch</Link>
                    </Button>
                </div>
                
            </div>

            <div className="grid grid-cols-5 bg-slate-200 font-semibold rounded-sm mt-2">
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Branch Name</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50 col-span-2">Full Address</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Branch Type</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Action</div>
            </div>

            <div className="grid grid-cols-5 bg-light rounded-b-sm shadow-xs">
                {branches.length > 0 ?
                    filteredBranches.map((item, index) => (
                        <Fragment key={ index }>
                            <div className="text-sm pl-2 py-1.5 border-b-1">{ item.branchName }</div>
                            <div className="text-sm pl-2 py-1.5 col-span-2 border-b-1 truncate">{ `${item.streetAddress}, ${item.barangay}, ${item.city}, ${item.province}` }</div>
                            <div className="text-sm pl-2 py-1.5 border-b-1">
                                {item.isInternal ? (
                                    <Badge className="text-xs text-darkgreen font-semibold" variant="secondary"><BadgeCheck />Internal Branch</Badge>
                                ): (<Badge className="text-xs text-darkred font-semibold" variant="secondary"><BadgeCheck />External Branch</Badge>)}
                            </div>
                            <div className="flex items-center pl-2 gap-3 border-b-1">
                                <Link href={`/admin/branches/edit-branch/${item.branchId}`}><SquarePen className="w-4 h-4 text-darkgreen" /></Link>
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
            <div className="text-gray text-sm">Showing { filteredBranches.length.toString() } of { filteredBranches.length.toString() } results.</div>

            <Dialog open={ !!toDelete } onOpenChange={ (open) => { if (!open) setDelete(undefined) }}>
                <DialogContent>
                    <DialogTitle className="text-sm">Are you sure you want to delete branch <span className="text-darkred">{ `${toDelete?.branchName}` }</span></DialogTitle>
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
                            <FormLoader onProcess={ onProcess } label="Delete Branch" loadingLabel="Deleting Branch" /> 
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}