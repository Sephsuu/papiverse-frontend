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
import { DeleteEmployee } from "./_components/DeleteEmployee";

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
            <div className="grid grid-cols-4 data-table-thead mt-2">
                <div className="data-table-th col-span-2">Full Name and Position</div>
                <div className="data-table-th">E-mail Address</div>
                <div className="data-table-th">Actions</div>
            </div>
            
            {employees.length > 0 ?
                filteredEmployees.map((item, index) => (
                    <div className="grid grid-cols-4 bg-light rounded-b-sm shadow-xs" key={ index }>
                        <div className="flex items-center gap-2 data-table-td col-span-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brown text-lg text-light font-semibold">{ `${item.firstName[0]}${item.lastName[0]}` }</div>
                            <div>
                                <div className="font-semibold">{ `${item.lastName}, ${item.firstName} ${item.middleName}` }</div>
                                <div className="text-gray">{ item.position }</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 data-table-td">
                            <div><Mail className="w-4 h-4" /></div>
                            <div className="text-sm">{ item.email }</div>
                        </div>
                        <div className="flex items-center pl-2 gap-3 border-b-1">
                            <button onClick={ () => setUpdate(item) }><SquarePen className="w-4 h-4 text-darkgreen" /></button>
                            <button><Info className="w-4 h-4" /></button>
                            <button onClick={ () => setDelete(item) }><Trash2 className="w-4 h-4 text-darkred" /></button>
                        </div>
                    </div>
                ))
                : (<div className="my-2 text-sm text-center col-span-6">There are no existing employees yet.</div>)
            }
            <div className="text-gray text-sm mx-2">Showing { filteredEmployees.length.toString() } of { filteredEmployees.length.toString() } results.</div>

            {open && (
                <CreateEmployee 
                    claims={ claims }
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toUpdate && (
                <UpdateEmployee 
                    claims={ claims }
                    toUpdate={ toUpdate! }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}

            {toDelete && (
                <DeleteEmployee 
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}
        
        </section>
    );
}