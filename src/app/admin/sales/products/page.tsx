"use client"

import { Button, DeleteButton } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { formatToPeso } from "@/lib/formatter";
import { ProductService } from "@/services/ProductService";
import { Product } from "@/types/products";
import { Supply } from "@/types/supply";
import { Download, Funnel, Info, Plus, SquarePen, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateProduct } from "./_components/CreateProduct";
import { DeleteProduct } from "./_components/DeleteProduct";
import { UpdateProduct } from "./_components/UpdateProduct";

export default function ProductsTable() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [onProcess, setProcess] = useState(false);
    const [search, setSearch] = useState('');

    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<Product>();
    const [toDelete, setDelete] = useState<Product>();

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await ProductService.getAllProducts();
                setProducts(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [reload]);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredProducts(products.filter(
                (i) => i.name!.toLowerCase().includes(find)
            ))
        } else setFilteredProducts(products);
    }, [search, products]);

    async function handleDelete() {
            try {
                setProcess(true);
                toast.success(`Product ${toDelete?.name} deleted successfully.`)
                await ProductService.deleteProduct(toDelete!.id!);
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
                <div className="text-xl font-semibold">All Products</div>
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
                    placeholder="Search for a product"
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
                        <Plus />Add a product
                    </Button>
                </div>
            </div>    
            <div className="grid grid-cols-5 data-table-thead mt-2">
                <div className="data-table-th">Product Name</div>
                <div className="data-table-th">Price</div>
                <div className="data-table-th">Category</div>
                <div className="data-table-th">Supplies Neede</div>
                <div className="data-table-th">Action</div>
            </div>
            {products.length > 0 ?
                filteredProducts.map((item, index) => (
                    <div className="grid grid-cols-5 bg-light border-b-1 shadow-xs" key={ index }>
                        <div className="data-table-td">{ item.name }</div>
                        <div className="data-table-td">{ formatToPeso(item.price) }</div>
                        <div className="data-table-td">{ item.category }</div>
                        <Select>
                            <SelectTrigger className="w-full">
                                <div className="text-dark font-semibold underline">Supplies Needed</div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Supplies needed for { item.name }</SelectLabel>
                                    {item.itemsNeeded.map((subItem, index) => (
                                        <SelectItem 
                                            key={ index } 
                                            value={ subItem.code! }
                                            className="flex"
                                        >
                                            <div className="text-sm">{ subItem.name }</div>
                                            <div className="text-sm flex items-center ms-auto"><X /><div>{ `${subItem.quantity} ${subItem.unitMeasurement}` }</div></div>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-3 data-table-td">
                            <button onClick={ () => setUpdate(item) }><SquarePen className="w-4 h-4 text-darkgreen" /></button>
                            <button><Info className="w-4 h-4" /></button>
                            <button onClick={ () => setDelete(item) }><Trash2 className="w-4 h-4 text-darkred" /></button>
                        </div>
                    </div>
                ))
                : (<div className="my-2 text-sm text-center col-span-6">There are no existing products yet.</div>)
            }
            <div className="text-gray text-sm mx-2">Showing { filteredProducts.length.toString() } of { filteredProducts.length.toString() } results.</div>

            {open && (
                <CreateProduct
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toUpdate && (
                <UpdateProduct 
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}

            {toDelete && (
                <DeleteProduct
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}
        </section>
    );
}