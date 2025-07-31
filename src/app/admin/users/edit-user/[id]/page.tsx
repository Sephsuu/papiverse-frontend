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
import { BranchService } from "@/services/BranchService";
import { handleChange } from "@/lib/form-handle";
import { Branch } from "@/types/branch";
import { AuthService } from "@/services/AuthService";
import { PapiverseLoading } from "@/components/ui/loader";
import { useParams } from "next/navigation";
import { UserService } from "@/services/UserService";
import { User, userFields, userInit } from "@/types/user";
import Image from "next/image";

const genders = ["Male", "Female", "Gay", "Lesbian", "Others"];

export default function EditUser() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>(userInit);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [updatedUser, setUpdatedUser] = useState({});
    const [open, setOpen] = useState(false);
    const [dateOpen, setDateOpen] = useState(false);
    const [date, setDate] = useState(user.dateOfBirth ? new Date(user.dateOfBirth) : undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await UserService.getUserById(Number(params.id));
                const branchesData = await BranchService.getAllBranches();
                setUser(userData);
                setBranches(branchesData);
            } catch (error) { toast.success }
            finally { 
                setLoading(false); 
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (user.dateOfBirth) {
            setDate(new Date(user.dateOfBirth));
            setUser((prev: User) => ({
                ...prev,
                branchId: String(selectedBranch?.branchId)
            }))
        } else {
            setDate(undefined);
        }
    }, [user.dateOfBirth]);

    const selectedBranch = branches.find(
        (i) => i.branchId === Number(user.branch?.branchId)
    );

    async function handleSubmit() {
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
            const data = await UserService.updateUser(user);
            if (data) {
                toast.success("User updated successfully!");
                setUser(userInit);  
                setDate(undefined);          
            }
       }
       catch(error){ toast.error(`${error}`) }
    }

    if (loading) return <PapiverseLoading />
    return(
        <section className="flex flex-col w-full h-screen align-center justify-center">
                <Toaster closeButton position="top-center" />
            <div className="w-200 mx-auto bg-light shadow-lg rounded-md mt-[-20px] p-8 max-md:w-full max-md:bg-light max-md:shadow-none">
                <div className="flex items-center gap-2">
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-2xl">Edit User: <span className="text-darkorange">{ user.firstName }</span></div>
                    <Image
                        src="/images/papiverse_logo.png"
                        alt="KP Logo"
                        width={100}
                        height={100}
                        className="ms-auto"
                    />
                </div>
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
                        <div className="text-dark">Select a role</div>
                        <RadioGroup  className="mt-2 flex" 
                            value={user.role} name="role" 
                            onValueChange={(value: string) => {
                            setUser((prev: User) => ({
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
                        <Button 
                            className="w-fit mt-8"
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
                            onValueChange={ (value) => setUser((prev: User) => ({
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
                        <Button type="button" variant="secondary"  className="border-1 border-dark bg-white text-xs px-4" onClick={ () => { handleSubmit(); setOpen(!open); }}>Yes, I`&apos;`m sure.</Button>
                        <Button type="button" className="text-xs px-4" onClick={ () => setOpen(!open) }>Cancel</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}