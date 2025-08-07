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
import { WeeklyExpenses } from "./_components/WeeklyExpenses";
import { CreateExpense } from "./_components/CreateExpense";
import { UpdateExpense } from "./_components/UpdateExpense";
import { DeleteExpense } from "./_components/DeleteExpense";
import { Branch } from "@/types/branch";
import { BranchService } from "@/services/BranchService";
import { error } from "console";

const tabs = [ 'Weekly', 'Monthly', 'Yearly'];

export default function ExpensesTable() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Weekly');
    const [branch, setBranch] = useState<Branch>();

    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<Expense>();
    const [toDelete, setDelete] = useState<Expense>();
    const [expenses, setExpenses] = useState<Expense[]>([]);

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
        async function getBranch(branchId : number) {
            try{
                const data = await BranchService.getBranchById(branchId);
                if(data) {
                    setBranch(data)
                }
            }
            catch (error) { toast.error(`${error}`) }
        }
        getBranch(claims.branch.branchId)
    }, [claims]) 

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
                    <div className="text-sm -mt-1">Showing all expenses for branch {branch?.branchName }</div>
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
                    placeholder="Search for an expenditure"
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
                        <Plus />Add an expenditure
                    </Button>
                </div>
            </div>
            <div className="flex w-fit rounded-full bg-light shadow-xs my-2">
                {tabs.map((item, index) => (
                    <button 
                        onClick={ () => setActiveTab(item) }
                        key={ index }
                        className={ `w-20 py-0.5 rounded-full text-sm ${activeTab === item && "bg-darkorange text-light"}` }
                    >
                        { item }
                    </button>
                ))}
            </div>
            
            {activeTab === 'Weekly' && (
                <WeeklyExpenses
                    setUpdate={ setUpdate }
                    setDelete={ setDelete }
                    branchId={ claims.branch.branchId }
                    search={ search }
                    reload={ reload }
                    setReload={ setReload }
                />
            )}

            {open && (
                <CreateExpense
                    claims={ claims }
                    setOpen={ setOpen }
                    setReload={ setReload }
                /> 
            )}

            {toUpdate && (
                <UpdateExpense
                    claims={ claims }
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setOpen={ setOpen }
                    setReload={ setReload }
                /> 
            )}

            {toDelete && (
                <DeleteExpense
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}

        </section>
    );
}