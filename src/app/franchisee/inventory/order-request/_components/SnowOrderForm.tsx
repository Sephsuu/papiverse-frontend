"use client"

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatToPeso } from "@/lib/formatter";
import { Supply } from "@/types/supply";
import { Ham, Snowflake, Trash2 } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { toast } from "sonner";

interface Props {
    supplies: Supply[];
    selectedItems: any[];
    setActiveForm: (i: string) => void;
    onSelect: (i: string) => void;
    onQuantityChange: (code: string, quantity: number) => void;
    onRemove: (i: string) => void;
}

export function SnowOrderForm({ supplies, selectedItems, setActiveForm, onSelect, onQuantityChange, onRemove }: Props) {
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

            <div className="grid grid-cols-8 bg-slate-200 font-semibold rounded-sm mt-2">
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">SKU ID</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Qty</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50 col-span-2">Supply Name</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Unit</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Unit Price</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50">Total</div>
                <div className="text-sm my-auto pl-2 py-1 border-r-1 border-amber-50"></div>
            </div>

            <div className="grid grid-cols-8 bg-light rounded-b-sm shadow-xs rounded-sm">
                {selectedItems.filter(i => i.category === 'SNOWFROST').map((item, index) => (
                    <Fragment key={ index }>
                        <div className="text-sm pl-2 py-1.5 border-b-1 truncate">{ item.code }</div>
                        <div className="pl-2 py-1 border-b-1">
                            <input 
                                min="1"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => onQuantityChange(item.code, Number(e.target.value))}
                                className="text-sm w-18 border-0 pl-2"
                            />
                        </div>
                        <div className="text-sm pl-2 py-1.5 border-b-1 truncate col-span-2">{ item.name }</div>
                        <div className="text-sm pl-2 py-1.5 border-b-1 truncate">{item.unitQuantity} { item.unitMeasurement }</div>
                        <div className="text-sm pl-2 py-1.5 border-b-1 truncate">{ formatToPeso(item.unitPrice) }</div>
                        <div className="text-sm pl-2 py-1.5 border-b-1 truncate">{ formatToPeso(item.unitPrice * item.quantity) }</div>
                        <div className="flex pl-2 border-b-1">
                            <Button 
                                type="button"
                                variant="secondary" 
                                size="sm"
                                onClick={() => onRemove(item.code)}
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