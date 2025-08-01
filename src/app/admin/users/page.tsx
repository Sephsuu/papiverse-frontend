"use client"

import { Button, DeleteButton } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectTrigger } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { UserService } from "@/services/UserService";
import { User } from "@/types/user";
import { SelectValue } from "@radix-ui/react-select";
import { Download, Funnel, Info, Plus, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

export default function UsersTable() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] =  useState(false);
    const [onProcess, setProcess] = useState(false);
    const [search, setSearch] = useState('');
    const [toDelete, setDelete] = useState<User | undefined>();

    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await UserService.getAllUsers();
                setUsers(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [reload]);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredUsers(users.filter(
                (i) => i.firstName.toLowerCase().includes(find) ||
                i.lastName.toLowerCase().includes(find)
            ))
        } else setFilteredUsers(users);
    }, [search, users]);

    async function handleDelete() {
        try {
            setProcess(true);
            toast.success(`User ${toDelete?.firstName} ${toDelete?.lastName} deleted successfully.`)
            await UserService.deleteUser(toDelete!.id!);
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setReload(!reload);
            setProcess(false); 
            setDelete(undefined);
        }
    }

    if (loading) return <PapiverseLoading />
    return(
        <section className="w-full py-4 px-2">
            <Toaster closeButton position="top-center" />
            <div className="flex items-center gap-2">
                <Image
                    src="/images/kp_logo.png"
                    alt="KP Logo"
                    width={40}
                    height={40}
                />
                <div className="text-xl font-semibold">All Users</div>
                <Image
                    src="/images/papiverse_logo.png"
                    alt="KP Logo"
                    width={100}
                    height={100}
                    className="ms-auto"
                />
            </div>

            <div className="flex items-center mt-2">
                <input
                    className="py-1 pl-3 rounded-md bg-light shadow-xs w-100"
                    placeholder="Search for a user"
                    onChange={ e => setSearch(e.target.value) }
                />

                <div className="ms-auto flex gap-2">
                    <div className="flex items-center gap-1">
                        <div className="text-sm text-gray">Showing</div>
                        <Select>
                            <SelectTrigger className="bg-light shadow-xs">
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                        </Select>
                    </div>
                    <Select>
                        <SelectTrigger className="bg-light shadow-xs">
                            <Funnel className="text-dark" />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                    </Select>
                    <Button 
                        variant="secondary"
                        className="bg-light shadow-xs"
                    >
                        <Download />
                        Export
                    </Button>
                    <Button className="!bg-darkorange text-light shadow-xs hover:opacity-90">
                        <Plus />
                        <Link href="/admin/users/add-user">Add a user</Link>
                    </Button>
                </div>
                
            </div>

            <div className="grid grid-cols-6 bg-slate-200 font-semibold rounded-sm mt-2">
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50 col-span-2">Full Name</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">E-mail Address</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Username</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Branch Name</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Action</div>
            </div>

            <div className="grid grid-cols-6 bg-light rounded-b-sm shadow-xs">
                {users.length > 0 ?
                    filteredUsers.map((item, index) => (
                        <Fragment key={ index }>
                            <div className="text-sm col-span-2 pl-2 py-1.5 border-b-1">{ `${item.lastName}, ${item.firstName} ${item.middleName}` }</div>
                            <div className="text-sm pl-2 py-1.5 border-b-1 truncate">{ item.email }</div>
                            <div className="text-sm pl-2 py-1.5 border-b-1">{ item.username }</div>
                            <div className="text-sm pl-2 py-1.5 border-b-1 truncate">{ item.branch?.branchName }</div>
                            <div className="flex items-center pl-2 gap-3 border-b-1">
                                <Link href={`/admin/users/edit-user/${item.id}`}><SquarePen className="w-4 h-4 text-darkgreen" /></Link>
                                <button><Info className="w-4 h-4" /></button>
                                <button
                                    onClick={ () => setDelete(item) }
                                >
                                    <Trash2 className="w-4 h-4 text-darkred" />
                                </button>
                            </div>
                        </Fragment>
                    ))
                    : (<div className="my-2 text-sm text-center col-span-6">There are no existing users yet.</div>)
                }
            </div>
            <div className="text-gray text-sm">Showing { filteredUsers.length.toString() } of { filteredUsers.length.toString() } results.</div>

            <Dialog open={ !!toDelete } onOpenChange={ (open) => { if (!open) setDelete(undefined) }}>
                <DialogContent>
                    <DialogTitle className="text-sm">Are you sure you want to delete <span className="text-darkred">{ `${toDelete?.firstName} ${toDelete?.lastName}` }</span></DialogTitle>
                    <div className="flex justify-end items-end gap-2">
                        <Button 
                            onClick={ () => setDelete(undefined) }
                            variant="secondary"
                        >
                            Close
                        </Button>
                        <DeleteButton 
                            handleDelete={ handleDelete } 
                            onProcess={ onProcess }
                            label="Delete User"
                            loadingLabel="Delete User"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}