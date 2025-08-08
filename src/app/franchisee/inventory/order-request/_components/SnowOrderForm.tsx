"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatToPeso } from "@/lib/formatter";
import { Supply } from "@/types/supply";
import { SupplyItem } from "@/types/supplyOrder";
import { Snowflake, Trash2 } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    supplies: Supply[];
    selectedItems: SupplyItem[];
    setActiveForm: (i: string) => void;
    onSelect: (i: string) => void;
    onQuantityChange: (code: string, quantity: number) => void;
    onRemove: (i: string) => void;
}

export function SnowOrderForm({ supplies, selectedItems, setActiveForm, onSelect, onQuantityChange, onRemove }: Props) {
    const [filteredSupplies, setFilteredSupplies] = useState<Supply[]>(supplies);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const find = search.toLowerCase().trim();
        if (find !== '') {
            setFilteredSupplies(supplies.filter(
                (i) => i.name?.toLowerCase().includes(find) ||
                i.code?.toLowerCase().includes(find)
            ))
        } else setFilteredSupplies(supplies);
    }, [search, supplies]);

    const handleSubmit = async () => {
        if (selectedItems.length > 0) {
            setActiveForm("receipt");
        } else {
            toast.info("Please select a supply to order.")
        }
    };

    return(
        <section className="w-full py-2">
            <div className="flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-blue" />
                <div className="font-semibold text-lg">Snow Frost Order Form</div>
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
                {selectedItems.filter(i => i.category === 'SNOWFROST').map((item, index) => (
                    <Fragment key={ index }>
                        <div className="data-table-td">{ item.code }</div>
                        <div className="data-table-td">
                            <input 
                                min="1"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => onQuantityChange(item.code!, Number(e.target.value))}
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
                                onClick={() => onRemove(item.code!)}
                                className="!h-fit py-1 my-auto"
                            >
                                <Trash2 className="text-darkred" />
                            </Button>
                        </div>
                    </Fragment>
                ))}
            </div>

            <div className="grid grid-cols-8 bg-light shadow-sm">
                <Select onValueChange={ onSelect }>
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
                            <SelectLabel>Snow Frost Supplies</SelectLabel>
                            {filteredSupplies.map((item) => (
                                <SelectItem key={item.code} value={item.code!}>{item.code} - {item.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full justify-start flex mt-2 gap-2">
                <Button 
                    variant="secondary"
                    onClick={ () => setActiveForm('meat') } 
                >
                    Back to Meat Order
                </Button>
                <Button 
                    onClick={ () => handleSubmit() } 
                    className="!bg-blue text-light hover:opacity-90"
                >
                    Proceed
                </Button>
            </div>
        </section>
    );
}