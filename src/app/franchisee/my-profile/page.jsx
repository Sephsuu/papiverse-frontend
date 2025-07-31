"use client"
import {useEffect, useState}  from "react"
import { Navigation } from "@/components/custom/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Dialog, 
    DialogContent,
    DialogTrigger,
    DialogDescription,
    DialogTitle,
    DialogHeader
} from "@/components/ui/dialog";

import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator";
import { House, Lock, MapPinned, Pencil, Save } from "lucide-react";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import UserService from "../service/UserService";
import AuthService from "../service/AuthService";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";

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
  const [claims, setClaims] = useState(null);
  const [user, setUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const [credentials, setCredentials] = useState({
    "userId" : "",
    "username": "",
    "email": "",
    "password": "",
  })
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

   useEffect(() => {
        const loggedUserString = localStorage.getItem("loggedUser");
        if (loggedUserString) {
            setClaims(JSON.parse(loggedUserString));
        }
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await UserService.findUser(claims.userId);
                setUser(data)
                setEditUser(data)

            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
        
    }, [claims, refresh]);

    console.log(user)

    useEffect(() => {
    if (user) {
      setCredentials({
        userId: claims.userId,
        username: user.username || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

    const handleChangeSelect = (name, value) => {
        setEditUser( prev => ({   
            ...prev,
            [name] : value
        }));
    }


     const handleChange = (e) => {
        const { name, value } = e.target;
        setEditUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
             const data = await UserService.updateUser(editUser);
            if(data){
                toast.success(`User ${user.firstName} ${user.lastName} was updated successfully.`);;
            }
        } catch(error) {
             console.log(error);
            toast.error('Something went wrong. Could not update user.');
        }
        finally {
            setOpen(!open)
            setRefresh(!refresh)
        }
    }
    

    function returnInitial() {
        setOpen(!open)
        setEditUser(user)
    }

    const handleSubmitAccount = async () => {
        if (newPassword !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
        }

        setErrorMessage("");

        const updatedCredentials = {
        ...credentials,
        password: newPassword,
        };

        try {
        const data = AuthService.updateCredentials(updatedCredentials)
        if(data){
             toast.success("Account credentials updated successfully!");
        }
        } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
        }
    };

    const handleFileUpload = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`http://localhost:8080/api/v1/user/${user.id}/profile-picture`, {
        method: "POST",
        body: formData,
        });

        if (!response.ok) {
        const error = await response.json();
        console.error("Upload failed:", error);
        return;
        }

        const updatedUser = await response.json();
        setUser(updatedUser);

    } catch (err) {
        console.error("Upload failed:", err);
    }
    };




    return (
        <SidebarProvider >
            <Toaster position="top-center"/>
            <Navigation />
            <div className="w-full h-full my-5 mx-5">
                <div className="">
                    <div className="m-5 mb-0 text-2xl flex flex-col pl-3 ">
                        <h3 className="text-amber-500 font-bold items-center">My Account</h3>
                        <Separator className=""/>
                    </div>
                </div>

                <div className="profile m-5 h-full bg-white border border-gray-200 p-7 rounded-3xl shadow-inner flex">
                 <div className="relative w-35 h-35">
                    <Avatar className="w-full h-full bg-amber-400">
                        <AvatarImage
                        src={user?.imageUrl ? `http://localhost:8080${user.imageUrl}` : ""}
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
                            handleFileUpload(e.target.files[0]);
                            }
                        }}
                        />
                    </label>
                    </div>
                    
                    <div className="basic-info  ml-5 w-100 p-5  mt-0">
                        <h1 className="name text-3xl font-semibold text-amber-500 mb-1">{user && user.firstName}</h1>
                        <h1 className="position text-xl font-light mb-1">{user && user.position}</h1>
                        <h1 className="branch text-xl font-light">{ user && user.branch.branchName }</h1>
                        
                    </div>
                </div>
                <div className="profile-information m-5 h-full bg-white border border-gray-200 p-7 rounded-3xl shadow-inner">
                    
                    <Dialog open={open} onOpenChange={returnInitial}>
                        <div className="header flex justify-between w-full ">
                            <h1 className="text-amber-500 text-xl font-semibold">Personal Information</h1>
                            <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md shadow transition"
                                onClick={() => setOpen(!open)}>
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
                                <input type="text" className="border p-2 rounded w-full my-2" name="firstName" value={editUser && editUser.firstName} onChange={handleChange}/>
                                <label>Middle Name:</label>
                                <input type="text" className="border p-2 rounded w-full my-2" name="middleName"value={editUser && editUser.middleName} onChange={handleChange} />
                                <label>Last Name:</label>
                                <input type="text" className="border p-2 rounded w-full my-2" name="lastName" value={editUser && editUser.lastName} onChange={handleChange}/>
                                <label>Phone Number:</label>
                                <input type="text" className="border p-2 rounded w-full my-2" name="contactNumber" value={editUser && editUser.contactNumber} onChange={handleChange}/>
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
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <button className="w-full px-4 py-2 border rounded-md text-left">
                                            {editUser&& editUser.dateOfBirth ? format(new Date(editUser && editUser.dateOfBirth), "PPP") : "Pick a date"}
                                        </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            defaultMonth={editUser && editUser.dateOfBirth}
                                            selected={editUser && editUser.dateOfBirth}
                                            captionLayout="dropdown"
                                             onSelect={(date) => {
                                                setEditUser(prev => ({
                                                ...prev,
                                                dateOfBirth: date
                                                }));
                                            }}
                                            className="rounded-lg border shadow-sm"
                                        />
                                    </PopoverContent>
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
                                <h1 className="text-lg font-semilight">{user && user.firstName}</h1>
                            </div>

                            <div className="m-5">
                                <h1 className="text-md text-gray font-semilight">Birthdate</h1>
                                <h1 className="text-lg font-semilight">{user && user.dateOfBirth}</h1>
                            </div>
                        </div>

                        <div className="sub-con2  w-full ">
                            <div  className="m-5">
                                <h1 className="text-md text-gray font-semilight">Last Name</h1>
                                <h1 className="text-lg font-semilight">{user && user.lastName}</h1>
                            </div>

                            <div className="m-5">
                                <h1 className="text-md text-gray font-semilight">Phone Number </h1>
                                <h1 className="text-lg font-semilight">{user && user.contactNumber}</h1>
                            </div>
                        </div>

                        <div className="sub-con3  w-full">
                             <div  className="m-5">
                                <h1 className="text-md text-gray font-semilight">Middle Name</h1>
                                <h1 className="text-lg font-semilight">{user && user.middleName}</h1>
                            </div>

                            <div className="m-5">
                                <h1 className="text-md text-gray font-semilight">Gender </h1>
                                <h1 className="text-lg font-semilight">{user && user.gender}</h1>
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
                        
                        <div className="flex justify-between ">
                            <div className="w-full flex flex-col mt-7">
                                <div className="branchDetails flex gap-2 mb-5">
                                    <House />
                                    <h1 className="text-lg px-2">{user && user.branch.branchName}</h1>
                                </div>
                                <div className="flex gap-2 ">
                                    <MapPinned />
                                    <h1 className="text-lg px-2">{user && user.branch.streetAddress + ", " + user.branch.barangay + ", " +  user.branch.city 
                                        + ", " + user.branch.province}</h1>
                                </div>
                            </div>
                             <div className="w-full  flex justify-evenly">  
                                <div className="branchDetails  flex flex-col gap-2  ml-5 justify-center items-center">
                                    <h1 className="font-semibold">Internal Branch: </h1>
                                    <h1>{user && user.branch.isInternal ? "Yes" : "No"}</h1>
                                </div>
                                <div className="flex gap-2 flex-col   mr-5 justify-center items-center">
                                    <h1 className="font-semibold">Status</h1>
                                    <h1>{user && user.branch.branchStatus}</h1>
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
                                    Make changes to your Account here.
                                </DialogDescription>
                                </DialogHeader>

                                <div className="updateForm">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    className="border p-2 rounded w-full my-2"
                                    value={credentials.username}
                                    onChange={(e) =>
                                    setCredentials({ ...credentials, username: e.target.value })
                                    }
                                />

                                <label>User Role:</label>
                                <div className="relative w-full my-2">
                                    <input
                                    type="text"
                                    className="border p-2 rounded w-full pr-10 text-gray-600"
                                    value={user?.role || ""}
                                    disabled
                                    />
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>

                                <label>Email:</label>
                                <input
                                    type="text"
                                    className="border p-2 rounded w-full my-2"
                                    value={credentials.email}
                                    onChange={(e) =>
                                    setCredentials({ ...credentials, email: e.target.value })
                                    }
                                />

                                <label>New Password:</label>
                                <input
                                    type="password"
                                    className="border p-2 rounded w-full my-2"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />

                                <label>Confirm New Password:</label>
                                <input
                                    type="password"
                                    className="border p-2 rounded w-full my-2"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />

                                {errorMessage && (
                                    <p className="text-red-500 text-sm my-2">{errorMessage}</p>
                                )}

                                <div className="mt-5">
                                    <button
                                    className="w-full flex justify-center p-2 gap-2 rounded-2xl bg-blue-400"
                                    onClick={handleSubmitAccount}
                                    >
                                    <h1 className="text-white flex gap-2">
                                        <Save /> Save Changes
                                    </h1>
                                    </button>
                                </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Separator className="mt-2" />
                        <div className="flex w-full gap-4 p-5" >
                            <div className="acc_info flex gap-5 h-full justify-between w-full">
                                 <div className=" flex flex-col items-start">
                                    <h1 className="text-md text-gray font-semilight mb-1">Username:</h1>
                                    <h1 className="text-lg font-semilight">{user && user.username}</h1>
                                </div>
                                <div className=" flex flex-col items-start">
                                    <h1  className="text-md text-gray font-semilight mb-1">User Role:</h1>
                                    <h1 className="text-lg font-semilight">{user && user.role}</h1>
                                </div>
                                <div className="flex flex-col items-start">
                                    <h1  className="text-md text-gray font-semilight mb-1">Email</h1>
                                    <h1 className="text-lg font-semilight">{user && user.email}</h1>
                                </div>
                            </div>
                           
                        </div>
                    
                    </div>
                </div>  
            </div>
         
           
        </SidebarProvider>
    )
}