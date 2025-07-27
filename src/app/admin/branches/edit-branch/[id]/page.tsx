"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PapiverseLoading } from "@/components/ui/loader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { handleChange } from "@/lib/form-handle";
import { BranchService } from "@/services/BranchService";
import { Branch, branchFields, branchInit } from "@/types/branch";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const status = ['Open', 'Under Renovation']  

export default function EditBranch() {
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const [open, setOpen] = useState(false);
    const [branch, setBranch] = useState<Branch>(branchInit);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await BranchService.getBranchById(Number(params.id));
                setBranch(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, []);

    useEffect(() => {
        console.log(branch);
        
    }, [branch])

    async function handleSubmit() {
        try{            
            for (const field of branchFields) {
                if (branch[field] === "" || branch[field] === undefined) {
                    toast.info("Please fill up all fields!");
                    return; 
                }
            }
            const data = await BranchService.addBranch(branch);
            if (data) {
                toast.success("Branch successfully added!");
                setBranch(branchInit);
            }
            
        }
        catch(error){
            console.log(error)
        }
    };

    if (loading) return <PapiverseLoading />
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
                    <div className="font-semibold text-2xl">Edit Branch: <span className="text-darkorange">{ branch.branchName }</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {/* BRANCH NAME */}
                    <div className="flex flex-col gap-1">
                        <div>Branch Name</div>
                        <Input 
                            placeholder="Enter branch name" 
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="branchName"  
                            value={branch.branchName}
                            onChange={ e => handleChange(e, setBranch)}
                        />
                        <div>Select Status</div>
                        <Select 
                            value={ branch.branchStatus ?? "" }
                            onValueChange={ (value) => setBranch(prev => ({
                                ...prev,
                                branchStatus: value
                            }))}
                        >
                            <SelectTrigger className="w-full border-1 border-gray" name="branchStatus">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    status.map((item, index) => (
                                        <SelectItem value={ item } key={ index }>{ item }</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                        <div className="mt-4">Type of Branch</div>
                        <RadioGroup
                            className="mt-2 flex"
                            value={String(branch.isInternal)}              
                            name="isInternal"
                            onValueChange={(value) => {
                                setBranch((prev) => ({
                                ...prev,
                                isInternal: value === "true",           
                                }));
                            }}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" className="border-1 border-dark" id="r1" />
                                <Label htmlFor="r1">Internal Branch</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" className="border-1 border-dark" id="r2" />
                                <Label htmlFor="r2">External False</Label>
                            </div>
                        </RadioGroup>
                        <Button 
                            className="w-fit mt-4"
                            onClick={ () => setOpen(!open) }
                        >
                            Register
                        </Button>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div>Location of the Branch</div>
                        <Input 
                            placeholder="Block/Subdivision/Lot No./Phase" 
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="streetAddress"  
                            value={branch.streetAddress}
                            onChange={ e => handleChange(e, setBranch)}
                        />
                        <div className="grid grid-cols-2 gap-1">
                            <Input 
                                placeholder="Barangay" 
                                className="w-full border-1 border-gray max-md:w-full" 
                                name ="barangay"  
                                value={branch.barangay}
                                onChange={ e => handleChange(e, setBranch)}
                            />
                            <Input 
                                placeholder="Municipality/City" 
                                className="w-full border-1 border-gray max-md:w-full" 
                                name ="city"  
                                value={branch.city}
                                onChange={ e => handleChange(e, setBranch)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <Input 
                                placeholder="Province" 
                                className="w-full border-1 border-gray max-md:w-full" 
                                name ="province"  
                                value={branch.province}
                                onChange={ e => handleChange(e, setBranch)}
                            />
                            <Input 
                                placeholder="Zip Code" 
                                className="w-full border-1 border-gray max-md:w-full" 
                                name ="zipCode"  
                                value={branch.zipCode}
                                onChange={ e => handleChange(e, setBranch)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={ open } onOpenChange={ setOpen }>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle className="text-sm">Are you sure to update branch.</DialogTitle>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">Branch Name: </div>
                        <div className="text-sm font-semibold">{ branch.branchName || (<span className="font-normal text-sxm text-darkred">This field is required</span>) }</div>
                        <div className="text-sm">Branch Address: </div>
                        <div className="text-sm font-semibold">{ branch.streetAddress }, { branch.barangay }, { branch.city }, { branch.province }, { branch.zipCode }</div>
                        <div className="text-sm">Branch Status: </div>
                        <div className="text-sm font-semibold">{ branch.branchStatus }</div>
                        <div className="text-sm">Branch Type: </div>
                        <div className="text-sm font-semibold">{branch.isInternal ? "Internal Branch" : "External Branch" }</div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary"  className="border-1 border-dark bg-white text-xs px-4" onClick={ () => { handleSubmit(); setOpen(!open); }}>Yes, I'm sure.</Button>
                        <Button type="button" className="text-xs px-4" onClick={ () => setOpen(!open) }>Cancel</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}