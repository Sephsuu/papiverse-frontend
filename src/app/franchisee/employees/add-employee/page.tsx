"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { handleChange } from "@/lib/form-handle";
import { EmployeeService } from "@/services/EmployeeService";
import { Employee, employeeFields, employeeInit } from "@/types/employee";
import { Supply, supplyFields, supplyInit } from "@/types/supply";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AddEmployee() {
    const { claims, loading: authloading } = useAuth();
    const [onProcess, setProcess] = useState(false);
    const [open, setOpen] = useState(false);
    const [employee, setEmployee] = useState<Employee>(employeeInit);

    async function handleSubmit() {
        try {
            setProcess(true);
            for (const field of employeeFields) {
                    if (employee[field] === "" || employee[field] === undefined || employee[field] === 0) {
                        toast.info("Please fill up all fields!");
                        return; 
                    }
                }
            const data = await EmployeeService.createEmployee(employee, claims.branch.branchId);
            if (data) toast.success(`${employee.firstName} ${employee.lastName} added successfully.`)
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setProcess(false); 
            setOpen(!open);
            setEmployee(employeeInit);
        }
    }

    if (authloading) return <PapiverseLoading />
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
                    <div className="font-semibold text-2xl">Add an Employee</div>
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
                        <div>First Name</div>
                        <Input    
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="firstName"  
                            value={employee.firstName}
                            onChange={ e => handleChange(e, setEmployee)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Middle Name</div>
                        <Input 
                            placeholder="(optional)"     
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="middleName"  
                            value={employee.middleName}
                            onChange={ e => handleChange(e, setEmployee)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Last Name</div>
                        <Input     
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="lastName"  
                            value={employee.lastName}
                            onChange={ e => handleChange(e, setEmployee)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>E-mail Address</div>
                        <Input     
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="email"  
                            value={employee.email}
                            onChange={ e => handleChange(e, setEmployee)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Position</div>
                        <Input     
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="position"  
                            value={employee.position}
                            onChange={ e => handleChange(e, setEmployee)}
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
                        <div className="text-sm">Full Name: </div>
                        <div className="text-sm font-semibold">{ `${employee.firstName} ${employee.middleName} ${employee.lastName}` || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                        <div className="text-sm">E-mail Address: </div>
                        <div className="text-sm font-semibold">{ employee.email || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                        <div className="text-sm">Position: </div>
                        <div className="text-sm font-semibold">{ employee.position || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <DialogClose className="text-sm">Close</DialogClose>
                        <Button 
                            onClick={ handleSubmit }
                            disabled={ onProcess }
                            size="sm"
                            className="!bg-darkgreen hover:opacity-90"
                        >
                            <FormLoader onProcess={ onProcess } label="Yes, I'm sure." loadingLabel="Adding Employee" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}