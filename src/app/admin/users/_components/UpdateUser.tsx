import { AddButton, Button, UpdateButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleChange } from "@/lib/form-handle";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/AuthService";
import { BranchService } from "@/services/BranchService";
import { UserService } from "@/services/UserService";
import { Branch } from "@/types/branch";
import { updateUserFields, User, userFields, userInit } from "@/types/user";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const genders = ["Male", "Female", "Others"];

interface Props {
    toUpdate: User;
    setUpdate: React.Dispatch<React.SetStateAction<User | undefined>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdateUser({ toUpdate, setUpdate, setReload }: Props) {
    const [loading, setLoading] = useState(true);
    const [onProcess, setProcess] = useState(false);

    const [user, setUser] = useState<User>(toUpdate);
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await BranchService.getAllBranches(0, 1000);
                if (res) {
                    setBranches(res);
                }
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchBranches();
    }, []);

    const selectedBranch = branches.find(
        (i) => i.branchId === Number(user.branch!.branchId)
    );

    useEffect(() => {
        if (branches.length > 0 && user.branch) {
            const foundBranch = branches.find(b => b.branchId === user.branch!.branchId);
            if (foundBranch) {
                setUser(prev => ({
                    ...prev,
                    branchId: String(foundBranch.branchId),
                    role: user.role
                }));
            }
        }
    }, [branches, user.branch]);

    async function handleSubmit() {
        try{         
            setProcess(true);
            const finalUser =  {
                id : user.id,
                branchId: Number(user.branchId),
                role: user.role
            }

            const data = await UserService.adminUpdate(finalUser);
            if (data) toast.success("User updated successfully!");    
        }
        catch(error){ toast.error(`${error}`) }
        finally { 
            setReload(prev => !prev);
            setProcess(false);      
            setUpdate(undefined);
        }
    }

    useEffect(() => {
        console.log(user)
    }, [user])
    return(
        <Dialog open onOpenChange={ (open) => { if (!open) setUpdate(undefined) } }>
            <DialogContent className="overflow-y-auto">
                <DialogTitle className="flex items-center gap-2">  
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-xl">Edit <span className="text-darkorange">{ `${toUpdate.firstName} ${toUpdate.lastName}` }</span></div>      
                </DialogTitle>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 col-span-2">
                        <div>Branch</div>
                        <Select 
                            value={ user.branchId ?? "" }
                            onValueChange={ (value) => setUser((prev: User) => ({
                                ...prev,
                                branchId: value
                            }))} 
                        >
                            <SelectTrigger className="w-full border-1 border-dark">
                                <SelectValue 
                                    className="block w-[100px] truncate"
                                    placeholder={selectedBranch ? `${selectedBranch.branchName} Branch` : "Select Branch"}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((branch) => (
                                    <SelectItem value={ String(branch.branchId) } key={ branch.branchId! }>
                                        <span>{ branch.branchName } Branch</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                        <div className="font-semibold mt-2">Select Role</div>
                        <RadioGroup  className="mt-2 flex" 
                            value={user.role} name="role" 
                            onValueChange={(value: string) => {
                            setUser((prev) => ({
                                ...prev,
                                role : value
                            }))
                        }}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="FRANCHISOR" className="border-1 border-gray" id="r1" />
                                <Label htmlFor="r1">Franchisor</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="FRANCHISEE" className="border-1 border-gray" id="r2" />
                                <Label htmlFor="r2">Franchisee</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <DialogClose className="text-sm">Close</DialogClose>
                    <UpdateButton 
                        handleSubmit={ handleSubmit }
                        onProcess={ onProcess }
                        label="Update User"
                        loadingLabel="Updating User"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}