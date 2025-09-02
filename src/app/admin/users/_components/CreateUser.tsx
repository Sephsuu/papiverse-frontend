import { AddButton, Button } from "@/components/ui/button";
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
import { Branch } from "@/types/branch";
import { User, userFields, userInit } from "@/types/user";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const genders = ["Male", "Female", "Others"];

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateUser({ setOpen, setReload }: Props) {
    const [loading, setLoading] = useState(true);
    const [onProcess, setProcess] = useState(false);

    const [user, setUser] = useState<User>(userInit);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [date, setDate] = useState<Date | undefined>();
    const [dateOpen, setDateOpen] = useState(false);

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

    useEffect(() => {
        if (date) {
            setUser(prevUser => ({
                ...prevUser,
                dateOfBirth: format(date, "yyyy-MM-dd"),
            }));
        }
    }, [date]);

    async function handleSubmit() {
        try{         
            setProcess(true);
            for (const field of userFields) {
                if (
                    user[field] === "" ||
                    user[field] === null ||
                    user[field] === undefined
                ) {
                    toast.info("Please fill up all fields!");
                return; 
                }
            }
            if (user.password !== user.confirmPassword) {
                toast.info("Passwords do not match!");
                return;
            }

        const data = await AuthService.registerUser(user);
        if (data) toast.success("User registered successfully!");    
        }
        catch(error){ toast.error(`${error}`) }
        finally { 
            setReload(prev => !prev);
            setProcess(false);
            setOpen(!open);
        }
    }

    return(
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent className="h-9/10 overflow-y-auto">
                <DialogTitle className="flex items-center gap-2">  
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-xl">Create User</div>      
                </DialogTitle>
                <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 font-semibold">Account Details</div>
                    <div className="flex flex-col gap-1 col-span-2">
                        <div>Username</div>
                        <Input    
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="username"  
                            value={user.username}
                            onChange={ e => handleChange(e, setUser)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Password</div>
                        <Input    
                            className="w-full border-1 border-gray max-md:w-full" 
                            type="password"
                            name ="password"  
                            value={user.password}
                            onChange={ e => handleChange(e, setUser)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Confirm Password</div>
                        <Input    
                            className="w-full border-1 border-gray max-md:w-full" 
                            type="password"
                            name ="confirmPassword"  
                            value={user.confirmPassword}
                            onChange={ e => handleChange(e, setUser)}
                        />
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                        <div>Position</div>
                        <Input    
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="position"  
                            value={user.position}
                            onChange={ e => handleChange(e, setUser)}
                        />
                    </div>
                    <div className="col-span-2 font-semibold mt-2">Peronal Information</div>
                    <div className="flex flex-col gap-1 col-span-2">
                        <div>First Name</div>
                        <Input    
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="firstName"  
                            value={user.firstName}
                            onChange={ e => handleChange(e, setUser)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Middle Name</div>
                        <Input    
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="middleName" 
                            placeholder="(optional)" 
                            value={user.middleName}
                            onChange={ e => handleChange(e, setUser)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Last Name</div>
                        <Input    
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="lastName"  
                            value={user.lastName}
                            onChange={ e => handleChange(e, setUser)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Date of Birth</div>
                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start text-left font-normal border-1 border-gray",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                <CalendarIcon />
                                {date ? format(date, "PPP") : <span>Date of Birth</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    defaultMonth={date}
                                    selected={date}
                                    required
                                    onSelect={(selectedDate: Date) => {
                                        setDate(selectedDate);
                                        setDateOpen(false);
                                    }}
                                    captionLayout="dropdown"
                                    className="rounded-lg border shadow-sm"
                                />
                            </PopoverContent>
                            <input
                                type="hidden"
                                name="dateOfBirth"
                                value={user.dateOfBirth}
                                required
                            />
                        </Popover>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Gender</div>
                        <Select 
                            value={ user.gender ?? "" }
                            onValueChange={ (value) => setUser(prev => ({
                                ...prev,
                                gender: value
                            }))} 
                        >
                            <SelectTrigger className="w-full border-1 border-gray">
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {genders.map((item, index) => (
                                    <SelectItem value={ item } key={ index }>{ item }</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                        <div>Branch</div>
                        <Select 
                            value={ user.branchId ?? "" }
                            onValueChange={ (value) => setUser(prev => ({
                                ...prev,
                                branchId: value
                            }))} 
                        >
                            <SelectTrigger className="w-full border-1 border-gray">
                                <SelectValue className="block w-[100px] truncate" placeholder="Select Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    branches.map((branch) => (
                                        <SelectItem value={ String(branch.branchId) } key={ branch.branchId! }>
                                            <span>{ branch.branchName } Branch</span>
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-2 font-semibold mt-2">Contact Information</div>
                    <div className="flex flex-col gap-1">
                        <div>E-mail Address</div>
                        <Input    
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="email"  
                            value={user.email}
                            onChange={ e => handleChange(e, setUser)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Contact Number</div>
                        <Input    
                            className="w-full border-1 border-gray max-md:w-full" 
                            name ="contactNumber"  
                            value={user.contactNumber}
                            onChange={ e => handleChange(e, setUser)}
                        />
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
                    <AddButton 
                        handleSubmit={ handleSubmit }
                        onProcess={ onProcess }
                        label="Create User"
                        loadingLabel="Creating User"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}