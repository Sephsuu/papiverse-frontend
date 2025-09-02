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
import { BadgeCheck, ChevronLeft, ChevronRight, Download, Funnel, Info, Plus, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateBranch } from "./_components/CreateBranch";
import { Toaster } from "@/components/ui/sonner";
import { UpdateBranch } from "./_components/UpdateBranch";
import { Pagination } from "@/components/ui/pagination";

const columns = [
    { title: "Branch Name", style: "" },
    { title: "Full Address", style: "col-span-2" },
    { title: "Branch Type", style: "" },
    { title: "Actions", style: "" },
]

export default function BranchesTable() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [onProcess, setProcess] = useState(false);
    const [search, setSearch] = useState('');
    const [paginationTotal, setPaginationTotal] = useState({totalPage : 0, totalElements : 0});
    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<Branch | undefined>();
    const [toDelete, setDelete] = useState<Branch | undefined>();
    const [pagination, setPagination] = useState({ page: 0, size: 20 , numberOfElements : 0});
    const [shown, setShown] = useState(Number)
    const [branches, setBranches] = useState<Branch[]>([]);
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);

    useEffect(() => {
        async function fetchData(page: number, size: number) {
            try {
                const data = await BranchService.getAllBranches(page, size);
                setBranches(data.content);
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

        fetchData(pagination.page, pagination.size)
    }, [reload, pagination.page]);
    console.log(branches);
    

     useEffect(() => {
       setShown(pagination.page * pagination.size  + pagination.numberOfElements)
    }, [branches]);


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
            <Toaster closeButton position="top-center" />
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
                    placeholder="Search for Branch"
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
                        <Plus />Add a branch
                    </Button>
                </div>
                
            </div>
            <div className="grid grid-cols-5 data-table-thead mt-2">
                {columns.map((item, _) => (
                    <div key={_} className={`data-table-th ${item.style}`}>{ item.title }</div>
                ))}
            </div>
            {branches.length > 0 ?
                filteredBranches.map((item, index) => (
                    <div className="grid grid-cols-5 bg-light border-b-1" key={ index }>
                        <div className="data-table-td">{ item.branchName }</div>
                        <div className="data-table-td col-span-2">{ `${item.streetAddress}, ${item.barangay}, ${item.city}, ${item.province}` }</div>
                        <div className="data-table-td">
                            {item.isInternal ? (
                                <Badge className="text-xs text-darkgreen font-semibold" variant="secondary"><BadgeCheck />Internal Branch</Badge>
                            ): (<Badge className="text-xs text-darkred font-semibold" variant="secondary"><BadgeCheck />External Branch</Badge>)}
                        </div>
                        <div className="flex items-center gap-3 data-table-td">
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
            <Pagination pagination={pagination} paginationTotal={paginationTotal} 
            shown={shown} setPagination={setPagination}/>
           

            {open && (
                <CreateBranch 
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}
            {toUpdate && (
                <UpdateBranch 
                    setOpen={ setOpen }
                    setReload={ setReload }
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                />
            )}

           
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