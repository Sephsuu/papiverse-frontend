"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { handleChange } from "@/lib/form-handle";
import { formatToPeso } from "@/lib/formatter";
import { EmployeeService } from "@/services/EmployeeService";
import { ExpenseService } from "@/services/ExpenseService";
import { Employee, employeeFields, employeeInit } from "@/types/employee";
import { Expense, expenseFields, expenseInit } from "@/types/expense";
import { Supply, supplyFields, supplyInit } from "@/types/supply";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const paymentModes = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer'];

export default function AddExpense() {
    const { claims, loading: authloading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [onProcess, setProcess] = useState(false);
    const [open, setOpen] = useState(false);
    const [expense, setExpense] = useState<Expense>(expenseInit);
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await EmployeeService.getEmployeesByBranch(claims.branch.branchId);
                setEmployees(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }  
        fetchData();
    }, [claims]);

    async function handleSubmit() {
        try {
            setProcess(true);
            for (const field of expenseFields) {
                    if (expense[field] === "" || expense[field] === undefined || expense[field] === 0) {
                        toast.info("Please fill up all fields!");
                        return; 
                    }
                }
            const data = await ExpenseService.createExpense(expense);
            if (data) toast.success(`Expenditure for ${expense.purpose} added successfully.`)
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setProcess(false); 
            setOpen(!open);
            setExpense(expenseInit);
        }
    }

    useEffect(() => {
        console.log(expense);
        
    }, [expense])

    if (loading || authloading) return <PapiverseLoading />
    return(
        <section className="relative flex flex-col w-full h-screen align-center justify-center">
            <Toaster closeButton position="top-center" />
            <div className="w-150 mx-auto shadow-lg mt-[-20px] p-8 bg-white rounded-md max-md:w-full max-md:bg-light max-md:shadow-none">
                <div className="flex items-center gap-2">
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-2xl">Add an Expenditure</div>
                    <Image
                        src="/images/papiverse_logo.png"
                        alt="KP Logo"
                        width={100}
                        height={100}
                        className="ms-auto"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="col-span-2 flex flex-col gap-1">
                        <div>Spender</div>
                        <Select
                            value={ expense.spenderId ? String(expense.spenderId) : "" }
                            onValueChange={ (value) => setExpense(prev => ({
                                ...prev,
                                spenderId: Number(value),
                            }))}
                        >
                            <SelectTrigger className="w-full border-1 border-gray">
                                <SelectValue placeholder="Select an Employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Employees</SelectLabel>
                                    {employees.map((item, index) => (
                                        <SelectItem key={ index } value={ String(item.id) }>{ `${item.firstName} ${item.middleName} ${item.lastName}` }</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Expense</div>
                        <div className="flex border-1 border-gray rounded-md">
                            <input
                                disabled
                                placeholder="₱"
                                className="border-0 w-10 placeholder:text-dark placeholder:text-center"
                            />
                            <Input 
                                className="border-0"
                                type="number"
                                name="expense"
                                value={ expense.expense }
                                onChange={ e => handleChange(e, setExpense) }
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Mode of Payment</div>
                        <Select
                            value={ expense.paymentMode }
                            onValueChange={ (value) => setExpense(prev => ({
                                ...prev,
                                paymentMode: value,
                            }))}
                        >
                            <SelectTrigger className="w-full border-1 border-gray">
                                <SelectValue placeholder="Select Payment Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Payment Methods</SelectLabel>
                                    {paymentModes.map((item, index) => (
                                        <SelectItem key={ index } value={ item }>{ item }</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                        <div>Expenditure Purpose</div>
                        <Textarea 
                            className="border-1 border-gray"
                            name="purpose"
                            value={ expense.purpose }
                            onChange={ e => handleChange(e, setExpense) }
                        />
                    </div>
                </div>
                <Button 
                    className="w-fit mt-4"
                    onClick={ () => setOpen(!open) }
                >
                    Register
                </Button>
            </div>

            <Dialog open={ open } onOpenChange={ setOpen }>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle className="text-sm">Are you sure to add this employee.</DialogTitle>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">Expense: </div>
                        <div className="text-sm font-semibold">{ formatToPeso(expense.expense) || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                        <div className="text-sm">Payment Mode: </div>
                        <div className="text-sm font-semibold">{ expense.paymentMode || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                        <div className="text-sm">Purpose: </div>
                        <div className="text-sm font-semibold">{ expense.purpose || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <DialogClose className="text-sm">Close</DialogClose>
                        <Button 
                            onClick={ handleSubmit }
                            disabled={ onProcess }
                            size="sm"
                            className="!bg-darkgreen hover:opacity-90"
                        >
                            <FormLoader onProcess={ onProcess } label="Yes, I'm sure." loadingLabel="Adding Expenditure" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}