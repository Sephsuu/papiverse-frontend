"use client"

import { Button, UpdateButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatToPeso } from "@/lib/formatter";
import { SupplyService } from "@/services/RawMaterialService";
import { SupplyOrderService } from "@/services/SupplyOrderService";
import { Claim } from "@/types/claims";
import { Supply } from "@/types/supply";
import { SupplyItem, SupplyOrder } from "@/types/supplyOrder";
import { Ham, Link, Trash2 } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    claims: Claim;
    order: SupplyOrder;
    setActiveTab: (i: string) => void;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Order {
    code: string;
    quantity: number;
}

export function EditMeatOrder({ order, claims, setActiveTab, setReload }: Props) {
    const [loading, setLoading] = useState(true);
    const [onProcess, setProcess] = useState(false);    
    const [selectedItems, setSelectedItems] = useState<SupplyItem[]>([]);
    const [search, setSearch] = useState("");
    const [supplies, setSupplies] = useState<Supply[]>([])
    const [filteredSupplies, setFilteredSupplies] = useState<Supply[]>([]);

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredSupplies(supplies.filter(
                (i) => i.name?.toLowerCase().includes(find) ||
                i.code?.toLowerCase().includes(find)
            ))
        } else setFilteredSupplies(supplies);
    }, [search, supplies]);

    useEffect(() => {
        async function fetchData() {
            try {
                const supplyItems: SupplyItem[] = order.meatCategory?.meatItems.map(item => ({
                    category: "MEAT",               
                    code: item.rawMaterialCode,
                    name: item.rawMaterialName,
                    quantity: item.quantity,
                    unitMeasurement: item.unitMeasurement,     
                    unitPrice: item.price,
                    unitQuantity: item.quantity  
                })) ?? [];
                const data = await SupplyService.getAllSupplies();
                const fixedPrice = data.filter((i: Supply) => i.category === 'MEAT').map((supply: Supply) => ({
                    ...supply, unitPrice: claims.branch.isInternal ? supply.unitPriceInternal : supply.unitPriceExternal
                }));

                setSelectedItems(supplyItems);
                setSupplies(fixedPrice);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, []);

    const handleSelect = async (code: string) => {
        if (!selectedItems.find((item: SupplyItem) => item.code === code)) {
            const selectedItem = supplies.find(item => item.code === code);
            if (selectedItem) {
            setSelectedItems([
                ...selectedItems,
                { code, name: selectedItem.name, quantity: 1, unitMeasurement: selectedItem.unitMeasurement, unitPrice: selectedItem.unitPrice, category: selectedItem.category }
            ]);
            } else {
            console.warn(`Item with code ${code} not found.`);
            }
        }
    };

    const handleQuantityChange = async (code: string, quantity: number) => {
        setSelectedItems(selectedItems.map((item: SupplyItem) => 
            item.code === code 
                ? { ...item, quantity: quantity || 0 } 
                : item
        ));
    };

    const handleRemove = async (code: string) => {
        setSelectedItems(selectedItems.filter((item: SupplyItem) => item.code !== code));
    };

    async function handleSubmit() {
        try {
            const updatedOrder: Order[] = selectedItems.map(item => ({
                code: item.code!,
                quantity: item.quantity!
            }));
            const data = await SupplyOrderService.updateMeatOrder(updatedOrder, order.meatCategory!.meatOrderId);
            if (data) toast.success('Order updated successfully.')
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setReload(prev => !prev);
            setProcess(false);
            setActiveTab('pending');
        }
    }
    
    if (loading) return <PapiverseLoading />
    return(
        <section className="w-full py-4 px-2">
            <div className="flex items-center gap-2">
                <Ham className="w-5 h-5 text-darkbrown" />
                <div className="font-semibold text-lg">Meat Order Form</div>
            </div>

            <div className="grid grid-cols-8 data-table-thead mt-2">
                <div className="data-table-th">SKU ID</div>
                <div className="data-table-th">Qty</div>
                <div className="data-table-th col-span-2">Supply Name</div>
                <div className="data-table-th">Unit</div>
                <div className="data-table-th">Unit Price</div>
                <div className="data-table-th">Total</div>
                <div className="data-table-th">Remove</div>
            </div>

            <div className="grid grid-cols-8 bg-light rounded-b-sm shadow-xs rounded-sm">
                {selectedItems.map((item, index) => (
                    <Fragment key={ index }>
                        <div className="data-table-td">{ item.code }</div>
                        <div className="data-table-td !p-0">
                            <input 
                                min="1"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.code!, Number(e.target.value))}
                                className="text-[16px] font-semibold w-18 border-0 pl-2"
                            />
                        </div>
                        <div className="data-table-td col-span-2">{ item.name }</div>
                        <div className="data-table-td">{item.unitQuantity} { item.unitMeasurement }</div>
                        <div className="data-table-td">{ formatToPeso(item.unitPrice!) }</div>
                        <div className="data-table-td">{ formatToPeso(item.unitPrice! * item.quantity!) }</div>
                        <div className="flex data-table-td">
                            <Button 
                                type="button"
                                variant="secondary" 
                                size="sm"
                                onClick={() => handleRemove(item.code!)}
                                className="!h-fit py-1 my-auto"
                            >
                                <Trash2 className="text-darkred" />
                            </Button>
                        </div>
                    </Fragment>
                ))}
            </div>

            <div className="grid grid-cols-8 bg-light shadow-sm">
                <Select onValueChange={ handleSelect }>
                    <SelectTrigger className="p-0 pl-2 m-0 border-0 shadow-none mx-auto w-fit">
                        <SelectValue placeholder="Select Item">Select Item</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <Input
                                placeholder="Search for a supply"
                                className="border-1 border-slate-300 h-fit"
                                onChange={ e => setSearch(e.target.value) }
                            />
                            <SelectLabel>Meat Supplies</SelectLabel>
                            {filteredSupplies.map((item) => (
                                <SelectItem key={item.code} value={item.code!}>{item.code} - {item.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full justify-start flex mt-2 gap-2">
                <Button 
                    onClick={ () => setActiveTab('pending') } 
                    variant="secondary"
                >
                    Back to Orders
                </Button>
                <UpdateButton
                    handleSubmit={ handleSubmit }
                    onProcess={ onProcess }
                    label="Update Order"
                    loadingLabel="Update Order"
                />
            </div>
        </section>
    );
}