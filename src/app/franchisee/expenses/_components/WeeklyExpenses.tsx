"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Toaster } from "@/components/ui/sonner";
import { formatDateToWords, formatToPeso, getWeekday } from "@/lib/formatter";
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
                i.lastName!.toLowerCase().includes(find) ||
                i.purpose!.toLowerCase().includes(find)
            ))
        } else setFilteredExpenses(expenses);
    }, [search, expenses]);

    const groupedExpenses = filteredExpenses.reduce<Record<string, Expense[]>>((acc, expense) => {
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
            
            {sortedDates.map((date) => {
                const totalForDate = groupedExpenses[date].reduce((sum, expense) => sum + expense.expense, 0);
                return(
                    <div key={ date }>
                        <div className="grid bg-slate-200 py-2 px-4 rounded-sm shadow-sm">
                            <div className="flex justify-between">
                                <div className="flex gap-1 items-center">
                                    <div className="font-bold text-md">{formatDateToWords(date)}</div>
                                    <div className="bg-dark h-fit rounded-sm text-light px-2 font-semibold text-[10px]">{ getWeekday(date) }</div>
                                </div>
                                <div className="mr-4 font-semibold">Total: <span className="text-darkred">{ formatToPeso(totalForDate) }</span></div>
                            </div>

                            {groupedExpenses[date].map((expense, index) => (
                                <div key={index} className="grid grid-cols-7 px-4 py-2 bg-gray-100 rounded-sm my-0.5 shadown-sm">
                                    <div className="flex gap-2 items-center col-span-2">
                                        <div className="w-8 h-8 bg-brown text-light flex items-center justify-center rounded-full font-semibold">{ expense.firstName![0] }{ expense.lastName![0] }</div>
                                        <div className="font-semibold text-sm">{ expense.firstName } { expense.lastName }</div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="text-md text-sm font-semibold">{expense.purpose}</div>
                                        <div className="text-xs text-gray font-semibold">{expense.paymentMode}</div>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-start">
                                        <div className="font-semibold">{ formatToPeso(expense.expense) }</div>
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        {/* <button onClick={ () => { setToUpdate(expense); setUpdate(!update) }}><SquarePen className="w-4 h-4 text-darkgreen"/></button>
                                        <button onClick={ () => { setDelete(expense.id); setDestroy(!destroy) } }><Trash2 className="w-4 h-4 text-darkred"/></button>
                                        <button><Info className="w-4 h-4"/></button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

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