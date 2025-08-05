import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { handleChange } from "@/lib/form-handle";
import { EmployeeService } from "@/services/EmployeeService";
import { Claim } from "@/types/claims";
import { Employee, employeeFields, employeeInit } from "@/types/employee";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
    claims: Claim;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateEmployee({ claims, setOpen, setReload }: Props) {
    const [onProcess, setProcess] = useState(false);
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
            setReload(prev => !prev);
            setProcess(false); 
            setOpen(!open);
        }
    }
    return(
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent>
                <DialogTitle className="flex items-center gap-2">  
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-xl">Add an Employee</div>      
                </DialogTitle>
                <div className="grid grid-cols-2 gap-2">
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
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="middleName"  
                            placeholder="(optional)"
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
                <div className="flex justify-end gap-4">
                    <DialogClose className="text-sm">Close</DialogClose>
                    <AddButton 
                        handleSubmit={ handleSubmit }
                        onProcess={ onProcess }
                        label="Add Employee"
                        loadingLabel="Adding Employee"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}