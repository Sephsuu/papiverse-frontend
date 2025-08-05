"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar1Icon, House, Lock, MapPinned, Pencil, Save } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";


import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { handleChange, handleChangeSolo } from "@/lib/form-handle";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/AuthService";
import { UserService } from "@/services/UserService";
import { User, userInit } from "@/types/user";
import FieldSkeleton from "@/components/custom/FieldSkeleton";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";


export function AvatarDemo() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-lg">
        <AvatarImage
          src="https://github.com/evilrabbit.png"
          alt="@evilrabbit"
        />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}


const genders = ["Male", "Female", "Gay", "Lesbian", "Others"];


export default function MyProfilePage(){
  const [editUser, setEditUser] = useState<User>({})
  const { claims, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User>(userInit);
  const [date, setDate] = useState(editUser.dateOfBirth ? new Date(editUser.dateOfBirth) : undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const [credentials, setCredentials] = useState<User>({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()
  


    useEffect(() => {
    const fetchUser = async () => {
        try {
        const newClaims = await AuthService.getCookie();

        if (!newClaims || !newClaims.userId) {
            console.warn('No valid userId in cookie.');
            return;
        }

        const data = await UserService.getUserById(newClaims.userId);

        if (data) {
            setUser(data);
        }

        } catch (err) {
        console.error("Failed to fetch user:", err);
        }
    };

    if (!authLoading) {
        fetchUser();
    }
    }, [refresh, claims, authLoading]);


    useEffect(() => {
    if (!authLoading && user) {
        setCredentials({
            id: user.id,
            username: user.username,
            email: user.email,
            password: "",
            role: user.role
        });

        setEditUser({
                id : user.id,
                firstName : user.firstName,
                middleName : user.middleName,
                lastName : user.lastName,
                contactNumber : user.contactNumber,
                gender : user.gender,
                position : user.position,
                dateOfBirth :  user.dateOfBirth
            })
    }
  }, [user, refresh]);

    useEffect(() => {
        if (editUser.dateOfBirth) {
            setDate(new Date(editUser.dateOfBirth));
        }
    }, [editUser.dateOfBirth]);

    const handleChangeSelect = (name : string ,
                                value : string
     ) => {
        setEditUser( prev => ({   
            ...prev,
            [name] : value
        }));
    }

    const handleSubmit = async () => {
        try {
            const finalUser = {
                ...editUser,
                dateOfBirth: date?.toLocaleDateString('en-CA')
            }
            
            const data = await UserService.updateUser(finalUser);
            if(data){
                toast.success(`User ${user.firstName} ${user.lastName} was updated successfully.`);;
            }
        } catch(e) {
            toast.error(`${e}`);
        }
        finally {
            setOpenEdit(!openEdit)
            setRefresh(!refresh)
        }
    }
    

    function returnInitialEdit() {
        setOpenEdit(!openEdit)
        setEditUser(user)
    }
     function returnInitial() {
        setOpen(!open)
        setCredentials(user)
    }

    const handleSubmitAccount = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        const updatedCredentials = {
            id: credentials.id,
            username: credentials.username,
            password: newPassword,
            email: credentials.email
        };
        try {
            console.log(updatedCredentials)
            const data = await AuthService.updateCredentials(updatedCredentials);
            if (data) {
                toast.success("Account credentials updated successfully!");

                setUser(prev => ({
                    ...prev,
                    username: updatedCredentials.username,
                    email: updatedCredentials.email
                }));

            
            }

        } catch (e) {
            toast.error(`${e}`);
        } finally {
            await AuthService.deleteCookie()
            setTimeout(() => {router.push("/auth")}, 2000)
        }
    };


    const handleFileUpload = async (file : File, userId : number) => {
        try {
            const data = await UserService.fileUpload(file, userId)
            if (data) {
                  toast.success("Account Profile Picture updated successfully!");
            }

        } catch (e) {
            toast.error(`${e}`)
        }
    };
    return (
        <SidebarProvider >
            <Toaster position="top-center"/>
            <div className="w-full h-fit my-5 mx-5 ">
                <div className="">
                    <div className="m-5 mb-0 text-2xl flex flex-col pl-3 ">
                        <h3 className="text-amber-500 font-bold items-center">My Account</h3>
                        <Separator className=""/>
                    </div>
                </div>

                <div className="profile m-5 h-fit bg-white border border-gray-200 p-7 rounded-3xl shadow-inner flex">
                 <div className="relative w-35 h-35">
                    <Avatar className="w-full h-full bg-amber-400">
                        <AvatarImage
                        src={user?.imageUrl ? `https://395z4m7f-8080.asse.devtunnels.ms${user.imageUrl}` : ""}
                        className="h-full w-full object-cover rounded-full"
                        />
                    </Avatar>
                    
                    <label className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l12-12a2.828 2.828 0 00-4-4L5 17v4z"
                        />
                        </svg>
                        <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], claims.userId);
                            }
                        }}
                        />
                    </label>
                    </div>
                    
                    <div className="basic-info  ml-5 w-100 p-5  mt-0">
                        <h1 className="name text-3xl font-semibold text-amber-500 mb-1"> <FieldSkeleton text={!authLoading ? user.firstName : ''} width="w-60" /></h1>
                        <h1 className="position text-lg font-extralight text-gray-500 mb-1"> <FieldSkeleton text={!authLoading ? user.position : ''} width="w-40" /></h1>
                        <h1 className="branch text-lg font-extralight text-gray-500">{ <FieldSkeleton text={!authLoading ? user.branch?.branchName : ''} width="w-40" />}</h1>
                        
                    </div>
                </div>
                <div className="profile-information m-5 h-fit bg-white border border-gray-200 p-7 rounded-3xl shadow-inner">
                    
                    <Dialog open={openEdit} onOpenChange={returnInitialEdit}>
                        <div className="header flex justify-between w-full ">
                            <h1 className="text-amber-500 text-xl font-semibold">Personal Information</h1>
                            <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md shadow transition"
                                onClick={() => setOpenEdit(!openEdit)}>
                                            Edit
                                            <Pencil className="w-5 h-5" />
                                        </button>
                        </div>

                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Edit Personal Information</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here.
                            </DialogDescription>
                            </DialogHeader>

                            <div className="updateForm">
                                <label>First Name:</label>
                                <input type="text" className="border p-2 rounded w-full my-2" name="firstName" value={editUser && editUser.firstName} onChange={ e => handleChange(e, setEditUser)}/>
                                <label>Middle Name:</label>
                                <input type="text" className="border p-2 rounded w-full my-2" name="middleName"value={editUser && editUser.middleName} onChange={e => handleChange(e, setEditUser)} />
                                <label>Last Name:</label>
                                <input type="text" className="border p-2 rounded w-full my-2" name="lastName" value={editUser && editUser.lastName} onChange={e => handleChange(e, setEditUser)}/>
                                <label>Phone Number:</label>
                                <input type="text" className="border p-2 rounded w-full my-2" name="contactNumber" value={editUser && editUser.contactNumber} onChange={e => handleChange(e, setEditUser)}/>
                                <label>Gender</label>
                                <Select onValueChange={(value) => handleChangeSelect('gender', value)} value={editUser && editUser.gender? editUser && editUser.gender : "Select a Gender"}>
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
                                <label>Birthdate: </label>
                                <div>
                                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "justify-start text-left font-normal border-1 border-dark w-full",
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
                                                onSelect={(selectedDate) => {
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
                                            value={date ? date.toISOString().slice(0, 10) : ""}
                                            required
                                        />
                                    </Popover>
                                </div>
                               
                                <div className="mt-5">
                                    <button className="w-full flex justify-center p-2 gap-2 rounded-2xl bg-blue-400" onClick={handleSubmit}>
                                       <h1 className="text-white flex gap-2"><Save/> Save Changes</h1>
                                    </button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Separator className="mt-3" />
                    <div className="info-container w-full h-full  flex">
                        <div className="sub-con1 w-full ">
                            <div className="m-5">
                                <h1 className="text-md text-gray font-semilight">First name</h1>
                                <FieldSkeleton text={!authLoading ? user.firstName : ''} width="w-40" />

                            </div>

                            <div className="m-5">
                                <h1 className="text-md text-gray font-semilight">Birthdate</h1>
                                <FieldSkeleton text={!authLoading ? user.dateOfBirth : ''} width="w-40" />
                            </div>
                        </div>

                        <div className="sub-con2  w-full ">
                            <div  className="m-5">
                                <h1 className="text-md text-gray font-semilight">Last Name</h1>
                                <FieldSkeleton text={!authLoading ? user.lastName : ''} width="w-40" />
                            </div>

                            <div className="m-5">
                                <h1 className="text-md text-gray font-semilight">Phone Number </h1>
                                <FieldSkeleton text={!authLoading ? user.contactNumber : ''} width="w-40" />
                            </div>
                        </div>

                        <div className="sub-con3  w-full">
                             <div  className="m-5">
                                <h1 className="text-md text-gray font-semilight">Middle Name</h1>
                                <FieldSkeleton text={!authLoading ? user.middleName : ''} width="w-40" />
                            </div>

                            <div className="m-5">
                                <h1 className="text-md text-gray font-semilight">Gender </h1>
                                <FieldSkeleton text={!authLoading ? user.gender : ''} width="w-40" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="branch-container flex">
                    <div className="branchInfo m-5 h-full w-full flex-1/4 bg-white border border-gray-200 p-7 rounded-3xl shadow-inner">
                        <div className="header flex justify-between w-full ">
                            <h1 className="text-amber-500 text-xl font-semibold">Branch Information </h1>
                        </div>
                        <Separator className="mt-2" />
                        
                        <div className="flex justify-between p-2">
                            <div className="w-full flex flex-col mt-5">
                                <div className="branchDetails flex gap-2 mb-5">
                                    <House />
                                    <FieldSkeleton text={!authLoading ? user.branch?.branchName : ''} width="w-40" />
                                </div>
                                <div className="flex gap-2 ">
                                    <MapPinned />
                                    <FieldSkeleton
                                        text={
                                            !authLoading
                                            ? [user.branch?.streetAddress, user.branch?.barangay, user.branch?.city, user.branch?.province]
                                                .filter(Boolean)
                                                .join(', ')
                                            : ''
                                        }
                                        width="w-40"
                                    />
                                </div>
                            </div>
                             <div className="w-full  flex justify-evenly">  
                                <div className="branchDetails  flex flex-col gap-2  ml-5 justify-center items-center">
                                    <h1 className="font-semibold">Internal Branch: </h1>
                                    <FieldSkeleton
                                        text={
                                            !authLoading && typeof user.branch?.isInternal === 'boolean'
                                            ? user.branch.isInternal
                                                ? 'Yes'
                                                : 'No'
                                            : ''
                                        }
                                        width="w-40"
                                        />
                                </div>
                                <div className="flex gap-2 flex-col   mr-5 justify-center items-center">
                                    <h1 className="font-semibold">Status</h1>
                                    <FieldSkeleton text={!authLoading ? user.branch?.branchStatus : ''} width="w-40" />
                                </div>
                            </div>
                            
                        </div>
                        
                        
                        
                    </div>

                    <div className="branchExtra m-5 h-full w-full flex-1/6 bg-white border border-gray-200 p-7 rounded-3xl shadow-inner">
                        <Dialog open={open} onOpenChange={returnInitial}>
                            <div className="header flex justify-between w-full">
                                <h1 className="text-amber-500 text-xl font-semibold">Account Information</h1>
                                <button
                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md shadow transition"
                                onClick={() => setOpen(!open)}
                                >
                                Update
                                <Pencil className="w-5 h-5" />
                                </button>
                            </div>

                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Edit Account Credentials</DialogTitle>
                                <DialogDescription>
                                    Make changes to your Account here. <br/>
                                </DialogDescription>
                                </DialogHeader>

                                <div className="updateForm">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    className="border p-2 rounded w-full my-2"
                                    name="username"
                                    value={credentials.username}
                                    onChange={e => handleChange(e, setCredentials)}
                                />

                                <label>User Role:</label>
                                <div className="relative w-full my-2">
                                    <input
                                    type="text"
                                    className="border p-2 rounded w-full pr-10 text-gray-600"
                                    value={credentials.role}
                                    disabled
                                    />
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>

                                <label>Email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    className="border p-2 rounded w-full my-2"
                                    value={credentials.email}
                                    onChange={e => handleChange(e, setCredentials)}
                                />

                                <label>New Password:</label>
                                <input
                                    type="password"
                                    name = "newPassword"
                                    className="border p-2 rounded w-full my-2"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={e => handleChangeSolo(e, setNewPassword)}
                                />

                                <label>Confirm New Password:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="border p-2 rounded w-full my-2"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={e => handleChangeSolo(e, setConfirmPassword)}
                                />

                                {errorMessage && (
                                    <p className="text-red-500 text-sm my-2">{errorMessage}</p>
                                )}

                                <div className="mt-5">
                                    <button
                                        className="w-full flex justify-center p-2 gap-2 rounded-2xl bg-blue-400"
                                        onClick={() => setShowConfirm(true)}
                                        >
                                        <h1 className="text-white flex gap-2">
                                            <Save /> Save Changes
                                        </h1>
                                    </button>
                                </div>
                                <div className="300 flex justify-center">
                                     <h1 className="mt-2 font-sm">Note: Re-login is required when changing account information</h1>
                                </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Confirm Account Changes</DialogTitle>
                            <DialogDescription>
                                You are about to update the following account information. This action will require you to re-login.
                            </DialogDescription>
                            </DialogHeader>

                            <div className="text-sm space-y-2">
                            <p><strong>Username:</strong> {credentials.username}</p>
                            <p><strong>Email:</strong> {credentials.email}</p>
                            {newPassword ? (
                            <div className="flex items-center gap-2 w-full justify-between">
                                <div className="gap-2 flex">  
                                    <strong>Password:</strong>
                                    <input
                                    type={showPassword ? "text" : "password"}
                                    readOnly
                                    value={newPassword}
                                    className="text-sm bg-transparent border-none p-0 focus:outline-none"
                                    />
                                </div>
                                
                                <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="text-gray-600 hover:text-gray-800 mr-5"
                                >
                                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                            </div>
                            ) : (
                            <p><strong>Password:</strong> Not Changed</p>
                            )}

                            <p><strong>Role:</strong> {credentials.role}</p>
                            </div>

                            <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-700 text-white"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700"
                                onClick={() => {
                                setShowConfirm(false);
                                handleSubmitAccount();
                                }}
                            >
                                Confirm & Save
                            </button>
                            </div>
                        </DialogContent>
                        </Dialog>

                        <Separator className="mt-2" />
                        <div className="flex w-full gap-4 p-5" >
                            <div className="acc_info flex gap-5 h-full justify-between w-full">
                                 <div className=" flex flex-col items-start">
                                    <h1 className="text-md text-gray font-semilight mb-1">Username:</h1>
                                    <FieldSkeleton text={!authLoading ? user.username : ''} width="w-40" />
                                </div>
                                <div className=" flex flex-col items-start">
                                    <h1  className="text-md text-gray font-semilight mb-1">User Role:</h1>
                                    <FieldSkeleton text={!authLoading ? user.role : ''} width="w-40" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <h1  className="text-md text-gray font-semilight mb-1">Email</h1>
                                    <FieldSkeleton text={!authLoading ? user.email : ''} width="w-40" />
                                </div>
                            </div>
                           
                        </div>
                    
                    </div>
                </div>  
            </div>
         
           
        </SidebarProvider>
    )
}