"use client"

import { Button } from "@/components/ui/button";
import { PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { formatToPeso } from "@/lib/formatter";
import { ProductService } from "@/services/ProductService";
import { Product } from "@/types/products";
import { Supply } from "@/types/supply";
import { Download, Funnel, Info, Plus, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductsTable() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [search, setSearch] = useState('');
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
                    <Button className="!bg-darkorange text-light shadow-xs hover:opacity-90">
                        <Plus />
                        <Link href="/admin/sales/products/add-product">Add a product</Link>
                    </Button>
                </div>
            </div>

            
            <div className="grid grid-cols-[20%_12%_15%_auto_auto_auto_10%] data-table-thead mt-2">
                <div className="data-table-th">Product Name</div>
                <div className="data-table-th">Price</div>
                <div className="data-table-th">Category</div>
                <div className="data-table-th col-span-3">Supplies Neede</div>
                <div className="data-table-th">Action</div>
            </div>

            <div className="grid grid-cols-[20%_12%_15%_auto_auto_auto_10%] bg-light rounded-b-sm shadow-xs">
                {products.length > 0 ?
                    filteredProducts.map((item, index) => (
                        <Fragment key={ index }>
                            <div className="data-table-td">{ item.name }</div>
                            <div className="data-table-td">{ formatToPeso(item.price) }</div>
                            <div className="data-table-td">{ item.category }</div>
                            <div className="data-table-td col-span-3">{ "Supplies" }</div>
                            <div className="flex items-center gap-3 data-table-td">
                                <Link href={`/admin/inventory/supplies/edit-supply/${item.id}`}><SquarePen className="w-4 h-4 text-darkgreen" /></Link>
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
            <div className="text-gray text-sm">Showing { filteredProducts.length.toString() } of { filteredProducts.length.toString() } results.</div>

        </section>
    );
}