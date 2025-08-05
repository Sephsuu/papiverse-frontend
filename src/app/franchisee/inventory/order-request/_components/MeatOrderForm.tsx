"use client"

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatToPeso } from "@/lib/formatter";
import { Supply } from "@/types/supply";
import { SupplyItem } from "@/types/supplyOrder";
import { Ham, Trash2 } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

interface Props {
    supplies: Supply[];
    selectedItems: SupplyItem[];
    setActiveForm: (i: string) => void;
    onSelect: (i: string) => void;
    onQuantityChange: (code: string, quantity: number) => void;
    onRemove: (i: string) => void;
}

export function MeatOrderForm({ supplies, selectedItems, setActiveForm, onSelect, onQuantityChange, onRemove }: Props) {
    const handleSubmit = async () => {
        setActiveForm("snow");
    };

    return(
        <section className="w-full py-2">
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
                {selectedItems.filter(i => i.category === 'MEAT').map((item, index) => (
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
                    <SelectTrigger className="p-0 m-0 border-0 shadow-none mx-auto w-fit">
                        <SelectValue placeholder="Select Item">Select Item</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {supplies.map((item) => (
                            <SelectItem key={item.code} value={item.code!}>{item.code} - {item.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full justify-start flex mt-2 gap-2">
                <Link 
                    className="inline-flex items-center justify-center text-sm px-4 bg-light text-dark rounded-md shadow-xs" 
                    href="/inventory?tab=summary"
                >
                    Back to summary
                </Link>
                <Button 
                    onClick={ () => handleSubmit() } 
                    className="!bg-darkbrown text-light hover:opacity-90"
                >
                    Proceed
                </Button>
            </div>
        </section>
    );
}