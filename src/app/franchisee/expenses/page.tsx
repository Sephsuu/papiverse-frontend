"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { ExpenseService } from "@/services/ExpenseService";
import { Expense } from "@/types/expense";
import { Download, Funnel, Info, Mail, Plus, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ExpensesTable() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [onProcess, setProcess] = useState(false);
    const [search, setSearch] = useState('');
    const [toDelete, setDelete] = useState<Expense>();

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await ExpenseService.getExpensesByBranch(claims.branch.branchId);
                setExpenses(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [claims, reload]);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredExpenses(expenses.filter(
                (i) => i.firstName.toLowerCase().includes(find) ||
                i.lastName.toLowerCase().includes(find)
            ))
        } else setFilteredExpenses(expenses);
    }, [search, expenses]);

    async function handleDelete() {
        try {
            setProcess(true);
            await ExpenseService.deleteExpense(toDelete?.id!);
            toast.success(`Expense ${toDelete?.purpose} deleted successfully.`)
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
                    <div className="text-xl font-semibold">All Expenses</div>
                    <div className="text-sm -mt-1">Showing all expenses for branch { "[Branch Name]" }</div>
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
                    placeholder="Search for an expense"
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
                        <Link href="/franchisee/employees/add-employee">Add an employee</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 bg-slate-200 font-semibold rounded-sm mt-2">
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Spender</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Purpose & Payment Method</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Actions</div>
            </div>

            <div className="grid grid-cols-3 bg-light rounded-b-sm shadow-xs">
                {expenses.length > 0 ?
                    filteredExpenses.map((item, index) => (
                        <Fragment key={ index }>
                            <div className="flex items-center gap-2 pl-2 py-2 border-b-1">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brown text-lg text-light font-semibold">{ `${item.firstName[0]}${item.lastName[0]}` }</div>
                                <div className="font-semibold">{ `${item.firstName}, ${item.lastName}` }</div>
                            </div>
                            <div className="flex flex-col items-center gap-1 text-sm pl-2 py-1.5 border-b-1 !truncate">
                                <div className="truncate">{ item.purpose }</div>
                                <div className="truncate">{ item.paymentMode }</div>
                            </div>
                            <div className="flex items-center pl-2 gap-3 border-b-1">
                                <Link href={`/franchisee/expenses/edit-expense/${item.id}`}><SquarePen className="w-4 h-4 text-darkgreen" /></Link>
                                <button><Info className="w-4 h-4" /></button>
                                <button
                                    onClick={ () => setDelete(item) }
                                >
                                    <Trash2 className="w-4 h-4 text-darkred" />
                                </button>
                            </div>
                        </Fragment>
                    ))
                    : (<div className="my-2 text-sm text-center col-span-6">There are no existing expenses yet.</div>)
                }
            </div>
            <div className="text-gray text-sm">Showing { filteredExpenses.length.toString() } of { filteredExpenses.length.toString() } results.</div>

            <Dialog open={ !!toDelete } onOpenChange={ (open) => { if (!open) setDelete(undefined) } }>
                <DialogContent>
                    <DialogTitle className="text-sm">Are you sure you want to delete expense { toDelete?.purpose }</DialogTitle>
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
                                <FormLoader onProcess={ onProcess } label="Delete Expense" loadingLabel="Deleting Expense" /> 
                            </Button>
                        </div>
                </DialogContent>
            </Dialog>
        
        </section>
    );
}