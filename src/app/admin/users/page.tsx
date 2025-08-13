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
import { CreateUser } from "./_components/CreateUser";
import { UpdateUser } from "./_components/UpdateUser";
import { DeleteUser } from "./_components/DeleteUser";

const columns = [
    { title: "Full Name", style: "" },
    { title: "E-mail Address", style: "" },
    { title: "Username", style: "" },
    { title: "Branch", style: "" },
    { title: "Actions", style: "" },
]

export default function UsersTable() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] =  useState(false);
    const [onProcess, setProcess] = useState(false);
    const [search, setSearch] = useState('');

    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<User | undefined>();
    const [toDelete, setDelete] = useState<User | undefined>();

    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await UserService.getAllUsers(0, 20);
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
                (i) => i.firstName!.toLowerCase().includes(find) ||
                i.lastName!.toLowerCase().includes(find)
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
                    <Button 
                        onClick={ () => setOpen(!open) }
                        className="!bg-darkorange text-light shadow-xs hover:opacity-90"
                    >
                        <Plus /> Add a user
                    </Button>
                </div>
                
            </div>
            <div className="grid grid-cols-5 data-table-thead mt-2">
                {columns.map((item, _) => (
                    <div key={_} className={`data-table-th ${item.style}`}>{ item.title }</div>
                ))}
            </div>
                {users.length > 0 ?
                    filteredUsers.map((item, index) => (
                        <div className="grid grid-cols-5 bg-light rounded-b-sm border-b-1 shadow-xs" key={ index }>
                            <div className="data-table-td">{ `${item.lastName}, ${item.firstName} ${item.middleName}` }</div>
                            <div className="data-table-td">{ item.email }</div>
                            <div className="data-table-td">{ item.username }</div>
                            <div className="data-table-td">{ item.branch?.branchName }</div>
                            <div className="flex items-center gap-2 data-table-td">
                                <button onClick={ () => setUpdate(item) }><SquarePen className="w-4 h-4 text-darkgreen" /></button>
                                <button><Info className="w-4 h-4" /></button>
                                <button onClick={ () => setDelete(item) }><Trash2 className="w-4 h-4 text-darkred" /></button>
                            </div>
                        </div>
                    ))
                    : (<div className="my-2 text-sm text-center col-span-6">There are no existing users yet.</div>)
                }
     
            <div className="text-gray text-sm">Showing { filteredUsers.length.toString() } of { filteredUsers.length.toString() } results.</div>

            {open && (
                <CreateUser 
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toUpdate && (
                <UpdateUser 
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}

            {toDelete && (
                <DeleteUser
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}
        </section>
    )
}