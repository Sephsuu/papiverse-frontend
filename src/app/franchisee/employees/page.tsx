"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { EmployeeService } from "@/services/EmployeeService";
import { Employee } from "@/types/employee";
import { Download, Funnel, Info, Mail, Plus, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateEmployee } from "./_components/CreateEmployee";
import { UpdateEmployee } from "./_components/UpdateEmployee";

export default function EmployeesTable() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [onProcess, setProcess] = useState(false);
    const [search, setSearch] = useState('');

    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<Employee>();
    const [toDelete, setDelete] = useState<Employee>();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await EmployeeService.getEmployeesByBranch(claims.branch.branchId);
                setEmployees(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [claims, reload]);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredEmployees(employees.filter(
                (i) => i.firstName.toLowerCase().includes(find) ||
                i.lastName.toLowerCase().includes(find)
            ))
        } else setFilteredEmployees(employees);
    }, [search, employees]);

    async function handleDelete() {
        try {
            setProcess(true);
            await EmployeeService.deleteEmployee(toDelete!.id!);
            toast.success(`Employee ${toDelete?.firstName} ${toDelete?.lastName} deleted successfully.`)
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setProcess(false); 
            setDelete(undefined);
            setReload(!reload); 
        }
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
                <div>
                    <div className="text-xl font-semibold">All Employees</div>
                    <div className="text-sm -mt-1">Showing all employees for branch { "[Branch Name]" }</div>
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
                        onClick={ () => setOpen(!open) }
                        className="!bg-darkorange text-light shadow-xs hover:opacity-90"
                    >
                        <Plus />Add an employee
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-4 bg-slate-200 font-semibold rounded-sm mt-2">
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50 col-span-2">Full Name and Position</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">E-mail Address</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Actions</div>
            </div>
            <div className="grid grid-cols-4 bg-light rounded-b-sm shadow-xs">
                {employees.length > 0 ?
                    filteredEmployees.map((item, index) => (
                        <Fragment key={ index }>
                            <div className="flex items-center gap-2 text-sm col-span-2 pl-2 py-2 border-b-1">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brown text-lg text-light font-semibold">{ `${item.firstName[0]}${item.lastName[0]}` }</div>
                                <div>
                                    <div className="font-semibold">{ `${item.lastName}, ${item.firstName} ${item.middleName}` }</div>
                                    <div className="text-gray">{ item.position }</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm pl-2 py-1.5 border-b-1 !truncate">
                                <div><Mail className="w-4 h-4" /></div>
                                <div className="truncate">{ item.email }</div>
                            </div>
                            <div className="flex items-center pl-2 gap-3 border-b-1">
                                <button onClick={ () => setUpdate(item) }><SquarePen className="w-4 h-4 text-darkgreen" /></button>
                                <button><Info className="w-4 h-4" /></button>
                                <button onClick={ () => setDelete(item) }><Trash2 className="w-4 h-4 text-darkred" /></button>
                            </div>
                        </Fragment>
                    ))
                    : (<div className="my-2 text-sm text-center col-span-6">There are no existing employees yet.</div>)
                }
            </div>
            <div className="text-gray text-sm">Showing { filteredEmployees.length.toString() } of { filteredEmployees.length.toString() } results.</div>

            <Dialog open={ !!toDelete } onOpenChange={ (open) => { if (!open) setDelete(undefined) } }>
                <DialogContent>
                    <DialogTitle className="text-sm">Are you sure you want to delete employee { `${toDelete?.firstName} ${toDelete?.lastName}` }</DialogTitle>
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
                                <FormLoader onProcess={ onProcess } label="Delete Employee" loadingLabel="Deleting Employee" /> 
                            </Button>
                        </div>
                </DialogContent>
            </Dialog>

            {open && (
                <CreateEmployee 
                    claims={ claims }
                    onProcess={ onProcess }
                    setProcess={ setProcess }
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toUpdate && (
                <UpdateEmployee 
                    claims={ claims }
                    onProcess={ onProcess }
                    setProcess={ setProcess }
                    toUpdate={ toUpdate! }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}
        
        </section>
    );
}