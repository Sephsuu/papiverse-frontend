"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Toaster } from "@/components/ui/sonner";
import { ExpenseService } from "@/services/ExpenseService";
import { Expense } from "@/types/expense";
import { Info, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    branchId: number;
    search: string;
}

export function WeeklyExpenses({ branchId, search }: Props) {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [onProcess, setProcess] = useState(false);
    const [toDelete, setDelete] = useState<Expense>();

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await ExpenseService.getExpensesByBranch(branchId);
                setExpenses(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [reload]);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredExpenses(expenses.filter(
                (i) => i.firstName!.toLowerCase().includes(find) ||
                i.lastName!.toLowerCase().includes(find)
            ))
        } else setFilteredExpenses(expenses);
    }, [search, expenses]);

    const groupedExpenses = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
        if (!acc[expense.date]) {
            acc[expense.date] = [];
        }
        acc[expense.date].push(expense);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedExpenses).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const totalExpenses = expenses.reduce((acc, curr) => (
        acc + curr.expense
    ), 0);

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

    if (loading) return <PapiverseLoading className="!h-fit mt-36" />
    return(
        <section className="w-full">
            <Toaster closeButton position="top-center" />
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
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brown text-lg text-light font-semibold">{ `${item.firstName![0]}${item.lastName![0]}` }</div>
                                <div className="font-semibold">{ `${item.firstName}, ${item.lastName}` }</div>
                            </div>
                            <div className="gap-1 text-sm pl-2 py-1.5 border-b-1 !truncate">
                                <div className="truncate">{ item.purpose }</div>
                                <div className="truncate text-gray">{ item.paymentMode }</div>
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