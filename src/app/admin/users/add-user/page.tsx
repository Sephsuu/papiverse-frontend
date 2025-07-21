"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar1Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { userFields, userInit } from "@/lib/form-init";
import { BranchService } from "@/services/BranchService";
import { handleChange } from "@/lib/form-handle";
import { Branch } from "@/types/branch";
import { AuthService } from "@/services/AuthService";

const genders = ["Male", "Female", "Gay", "Lesbian", "Others"];

export default function AdminRegisterUser() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(userInit);
    const [date, setDate] = useState<Date | undefined>();
    const [dateOpen, setDateOpen] = useState(false);

    // Fetching all branches on component mount
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await BranchService.getAllBranches();
                if (response) {
                    setBranches(response);
                }
            } catch (error) {
                console.error("Error fetching branches:", error);
            }
        }
        fetchBranches();
    }, []);

    // Changes the date of birth in the user object when the date is selected
    useEffect(() => {
        if (date) {
            setUser(prevUser => ({
                ...prevUser,
                dateOfBirth: format(date, "yyyy-MM-dd"),
            }));
        }
    }, [date]);

    useEffect(() => {
        console.log(user);
        
    }, [user])

    // Handle form submission
    const handleSubmit = async () => {
       try{        
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
        if (data) {
            toast.success("User registered successfully!");
            setUser(userInit);  
            setDate(undefined);          
        }
       }
       catch(error){ toast.error(`${error}`) }
    }
    
    return(
        <section className="flex flex-col w-full h-screen align-center justify-center">
            <Toaster closeButton position="top-center" />
            <div className="w-200 mx-auto bg-light shadow-lg rounded-md mt-[-20px] p-8 max-md:w-full max-md:bg-light max-md:shadow-none">
                <div className="font-semibold text-2xl mb-[-10px] mx-auto">Register New User</div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="flex flex-col gap-1">
                        {/* ACCOUNT DETAILS */}
                        <div className="m-1 text-dark">Account Details</div>
                        <Input 
                            placeholder="Enter username" 
                            className="border-1 border-dark max-md:w-full max-md:mb-4" 
                            name="username"
                            value={ user.username } 
                            onChange={ e => handleChange(e, setUser) }
                        />
                        <Input 
                            placeholder="Enter password" 
                            type="password"
                            className="border-1 border-dark max-md:w-full max-md:mb-4" 
                            name="password" 
                            value={ user.password }
                            onChange={ e => handleChange(e, setUser) }
                        />
                        <Input 
                            placeholder="Re-type password" 
                            type="password"
                            className="border-1 border-dark max-md:w-full max-md:mb-4" 
                            name="confirmPassword"
                            value={ user.confirmPassword }
                            onChange={ e => handleChange(e, setUser) }
                        />
                        {/* CONTACT INFORMATION */}
                        <div className="m-1 text-dark">Contact Information</div>
                        <Input 
                            placeholder="E-mail Address" 
                            className="border-1 border-(--dark)"
                            name= "email" 
                            value={ user.email }
                            onChange={ e => handleChange(e, setUser) }
                        />
                        <Input 
                            placeholder="Contact Number" 
                            className="border-1 border-(--dark)"
                            name= "contactNumber" 
                            value={ user.contactNumber }
                            onChange={ e => handleChange(e, setUser) }
                        />
                        <Button 
                            className="w-fit mt-4"
                            onClick={ () => setOpen(!open) }
                        >
                            Register
                        </Button>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="m-1 text-dark">Personal Information</div>
                        <Input 
                            placeholder="First Name" 
                            className="border-1 border-dark max-md:w-full max-md:mb-4" 
                            name="firstName" 
                            value={ user.firstName }
                            onChange={ e => handleChange(e, setUser) }
                        />
                        <Input 
                            placeholder="Middle Name" 
                            className="border-1 border-dark max-md:w-full max-md:mb-4"
                            name="middleName" 
                            value={ user.middleName }
                            onChange={ e => handleChange(e, setUser) }
                        />
                        <Input 
                            placeholder="Last Name" 
                            className="border-1 border-dark max-md:w-full max-md:mb-4"
                            name="lastName" 
                            value={ user.lastName }
                            onChange={ e => handleChange(e, setUser) }
                        />
                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start text-left font-normal border-1 border-dark",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                <Calendar1Icon />
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
                        <Select 
                            value={ user.gender ?? "" }
                            onValueChange={ (value) => setUser(prev => ({
                                ...prev,
                                gender: value
                            }))} 
                        >
                            <SelectTrigger className="w-full border-1 border-dark">
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    genders.map((item, index) => (
                                        <SelectItem value={ item } key={ index }>{ item }</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                        <Select 
                            value={ user.branchId ?? "" }
                            onValueChange={ (value) => setUser(prev => ({
                                ...prev,
                                branchId: value
                            }))} 
                        >
                            <SelectTrigger className="w-full border-1 border-dark">
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
                        <div className="text-dark">Select a role</div>
                        <RadioGroup  className="mt-2 flex" 
                            value={user.role} name="role" 
                            onValueChange={(value: string) => {
                            setUser((prev) => ({
                                ...prev,
                                role : value
                            }))
                        }}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="FRANCHISOR" className="border-1 border-(--dark)" id="r1" />
                                <Label htmlFor="r1">Franchisor</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="FRANCHISEE" className="border-1 border-(--dark)" id="r2" />
                                <Label htmlFor="r2">Franchisee</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>`

            <Dialog open={ open } onOpenChange={ setOpen }>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle className="text-sm">
                        Are you sure to add user.
                    </DialogTitle>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">Full Name: </div>
                        <div className="text-sm font-semibold">
                            {
                            (user.firstName && user.lastName)
                                ? `${user.firstName} ${user.middleName} ${user.lastName}`.trim()
                                : <span className="text-darkred font-normal">This field is required</span>
                            }
                        </div>
                        <div className="text-sm">Date of Birth: </div>
                        <div className="text-sm font-semibold">{ user.dateOfBirth || (<span className="text-darkred font-normal">This field is required</span>) }</div>
                        <div className="text-sm">Gender: </div>
                        <div className="text-sm font-semibold">{ user.gender || (<span className="text-darkred font-normal">This field is required</span>) }</div>
                        <div className="text-sm">E-mail Address: </div>
                        <div className="text-sm font-semibold">{ user.email || (<span className="text-darkred font-normal">This field is required</span>) }</div>
                        <div className="text-sm">Contact Number: </div>
                        <div className="text-sm font-semibold">{ user.contactNumber || (<span className="text-darkred font-normal">This field is required</span>) }</div>
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