"use client"

import { PapiverseLoading } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { SupplyService } from "@/services/RawMaterialService";
import { Supply } from "@/types/supply";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MeatOrderForm } from "./_components/MeatOrderForm";
import { SnowOrderForm } from "./_components/SnowOrderForm";
import { Toaster } from "@/components/ui/sonner";
import { OrderReceipt } from "./_components/OrderReceipt";
import { SupplyItem } from "@/types/supplyOrder";

export default function OrderRequest() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activerForm, setActiveForm] = useState('meat');

    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [selectedItems, setSelectedItems] = useState<SupplyItem[]>([]);

    useEffect(() => {
        console.log(selectedItems);
        
    }, [selectedItems])

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await SupplyService.getAllSupplies();
                const fixedPrice = data.map((supply: Supply) => ({
                    ...supply, unitPrice: claims.branch.isInternal ? supply.unitPriceInternal : supply.unitPriceExternal
                }));
                setSupplies(fixedPrice);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        } 
        fetchData();
    }, []);    

    const handleSelect = async (code: string) => {
        if (!selectedItems.find((item: any) => item.code === code)) {
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
        setSelectedItems(selectedItems.map((item: any) => 
            item.code === code 
                ? { ...item, quantity: quantity || 0 } 
                : item
        ));
    };

    const handleRemove = async (code: string) => {
        setSelectedItems(selectedItems.filter((item: any) => item.code !== code));
    };

    if (loading) return <PapiverseLoading />
    return(
        <section className="w-full px-2 py-4">
            <Toaster closeButton position="top-center" />
            <div className="flex items-center gap-2">
                <Image
                    src="/images/kp_logo.png"
                    alt="KP Logo"
                    width={40}
                    height={40}
                />
                <div className="text-xl font-semibold">Order Request for Supply</div>
                <Image
                    src="/images/papiverse_logo.png"
                    alt="KP Logo"
                    width={100}
                    height={100}
                    className="ms-auto"
                />
            </div>

            {activerForm === 'meat' && <MeatOrderForm
                supplies={ supplies.filter(i => i.category === 'MEAT') } 
                selectedItems={ selectedItems }
                setActiveForm={ setActiveForm }
                onSelect={ handleSelect }
                onQuantityChange={ handleQuantityChange }
                onRemove={ handleRemove }
            />}

            {activerForm === 'snow' && <SnowOrderForm
                supplies={ supplies.filter(i => i.category === 'SNOWFROST') } 
                selectedItems={ selectedItems }
                setActiveForm={ setActiveForm }
                onSelect={ handleSelect }
                onQuantityChange={ handleQuantityChange }
                onRemove={ handleRemove }
            />}

            {activerForm === 'receipt' && <OrderReceipt
                claims={ claims }
                setActiveForm={ setActiveForm }
                selectedItems={ selectedItems }
            />}
          
        </section>
    );
}