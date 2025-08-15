"use client"

import { OrderStatusBadge } from "@/components/ui/badge";
import { PapiverseLoading } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { barData, lowStocks } from "@/lib/data-array";
import { formatDateToWords } from "@/lib/formatter";
import { InventoryService } from "@/services/InventoryService";
import { SupplyOrderService } from "@/services/SupplyOrderService";
import { Inventory } from "@/types/inventory";
import { SupplyOrder } from "@/types/supplyOrder";
import { Ham, HandCoins, List, PackageCheck, PackageMinus, PackagePlus, Snowflake } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts';



const barSections = [
    { title: "all", icon: List, bg: "bg-[linear-gradient(270deg,hsla(23,64%,39%,1)_0%,hsla(24,100%,14%,1)_99%)]" },
    { title: "meat", icon: Ham, bg: "bg-[linear-gradient(315deg,_#DB4E08,_#FF9244)]" },
    { title: "snowfrost", icon: Snowflake, bg: "bg-[linear-gradient(270deg,_hsla(213,62%,45%,1)_0%,_hsla(203,50%,64%,1)_100%)]" }
];


export default function InventoryOverview() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [barSection, setBarSection] = useState("all")
    const [orders, setOrders] = useState<SupplyOrder[]>([]);
    const [inventories, setInventorories] = useState<Inventory[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const orderRes = await SupplyOrderService.getSupplyOrderByBranch(claims.branch.branchId);
                const inventoryRes = await InventoryService.getInventoryByBranch(claims.branch.branchId, 0, 1000);
                setInventorories(inventoryRes.data);
                setOrders(orderRes);
            } catch (error) { `${error}` }
            finally { setLoading(false) }
        }
        fetchData();
    }, [claims]);

    const meat = inventories.filter(i => i.category === 'MEAT');
    const snow = inventories.filter(i => i.category === 'SNOWFROST');

    const meatStock = meat.reduce((acc, curr) => acc + curr.quantity!, 0);
    const snowStock = snow.reduce((acc, curr) => acc + curr.quantity!, 0);
    
    const tabs = [
        { title: "Meat Stock", count: meatStock, icon: Ham },
        { title: "Snow Frost Stock", count: snowStock, icon: Snowflake },
        { title: "Low of Stock", count: inventories.filter(i => i.quantity! < 15).length, icon: PackageMinus },
        { title: "Pending Orders", count: orders.filter(i => ['PENDING', 'TO FOLLOW'].includes(i.status)).length, icon: PackagePlus }
    ];

    if (loading || authLoading) return <PapiverseLoading />
    return(
        <section className="w-full py-4 px-2">
            <div className="flex w-full gap-2 max-md:overflow-x-auto">
                {tabs.map((tab, index) => (
                    <Link href="inventory/supply-orders" className="py-3 px-5 flex gap-2 items-center bg-[#183040] text-light rounded-lg shadow-sm hover:opacity-70" key={ index }>
                        <tab.icon className="w-10 h-10" />
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-center">{ tab.count }</h1>
                            <p className="font-sm">{ tab.title }</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-4 my-3 gap-2">
                <div className="relative col-span-2  rounded-sm">
                    <ResponsiveContainer height={300} className="z-50">
                        <BarChart data={barData} margin={{ top: 55, right: 5, left: 5, bottom: 0 }}>
                            <XAxis className="text-xs font-semibold" dataKey="day" />
                            <Tooltip />
                            <Bar dataKey="prevStock" fill="#cd853f" radius={[5, 5, 0, 0]} />
                            <Bar dataKey="stock" fill="#8b4513" radius={[5, 5, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="absolute top-0 left-0 !z-10 px-2 flex justify-between w-full">
                        <div>
                            <div className="text-xs text-gray font-semibold">Total Stocks</div>
                            <div className="flex ml-2 gap-3">
                                <div className="text-3xl text-dark font-bold transform scale-x-120">{ meatStock + snowStock }</div>
                                <div className="text-darkred text-[10px] py-0.5 px-2 rounded-sm bg-red-100 font-semibold h-fit">- 7.01%</div>
                            </div>
                            <div className="text-xs text-gray">Stock Yesterday: <span className="text-dark font-bold text-md">1289</span></div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2.5 h-2.5 bg-[#cd853f] mx-1"></div>
                            <div className="text-xs font-semibold mr-2">Today</div>
                            <div className="w-2.5 h-2.5 bg-[#8b4513] mx-1"></div>
                            <div className="text-xs font-semibold">Yesterday</div>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-white">
                                {barSections.map((item, index) => (
                                    <button 
                                        onClick={ () => setBarSection(item.title) } 
                                        className={ `p-1.5 rounded-sm text-dark ${barSection === item.title && item.bg + " text-light"}` }
                                        key={ index }
                                    >
                                        <item.icon className="w-5 h-5" key={ index }/>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <ScrollArea className="col-span-1 bg-white shadow-sm rounded-sm p-3 h-[300px]">
                    <div className="font-semibold">Low Stock Items</div>
                    {inventories.filter(i => i.quantity! < 15).length > 0 ? (
                        inventories.filter(i => i.quantity! < 15).map((item, index) => (
                            <Fragment key={ index }>
                                <div className="grid grid-cols-2 w-full">
                                    <div className="text-sm text-gray my-2 text-center">{ item.name }</div>
                                    <div className="text-sm font-semibold text-center my-auto">{ item.quantity }</div>
                                </div>
                                <Separator />
                            </Fragment>
                        ))
                    ) : (
                        <div className="flex flex-col items-center mt-8">
                            <PackageCheck className="w-20 h-20 text-slate-300" strokeWidth={2.5} />
                            <div className="text-xs text-gray text-center font-semibold">Good job! Your branch don't have low stock items as of now.</div>
                        </div>
                    )}  
                </ScrollArea>
                <ScrollArea className="col-span-1 bg-white shadow-sm rounded-sm p-3 h-[300px]">
                    <div className="flex justify-between font-semibold mb-2">
                        <div>Order Transactions</div>
                        <Link href="inventory/supply-orders" className="text-xs text-gray">View All</Link>
                    </div>
                    {orders.length > 0 ? (
                        orders.map((item, index) => (
                            <Fragment key={ index }>
                                <div className="grid grid-cols-2 gap-2" key={ index }>
                                    <div className="my-1"><OrderStatusBadge status={ item.status } /></div>
                                    <div className="text-sm text-gray my-1">{ formatDateToWords(item.orderDate) }</div>
                                </div>
                                <Separator />
                            </Fragment>
                        ))
                    ) : (
                        <div className="flex flex-col items-center mt-8">
                            <HandCoins className="w-20 h-20 text-slate-300" strokeWidth={2.5} />
                            <div className="text-xs text-gray text-center font-semibold">Your branch don't have any pending orders as of now <Link href="/inventory?tab=order-supply" className="text-dark font-semibold underline">click here</Link> to order.</div>
                        </div>
                    )} 
                </ScrollArea>
            </div>

            <div className="w-full grid grid-cols-2 max-md:grid-cols-1 gap-2">
                <div className="w-full">
                    <div className="h-fit">
                        <div className="font-semibold">Meat Stocks</div>
                        <div className="text-xs text-gray">Showing items that has MEAT category.</div>
                    </div>
                    <ScrollArea className="h-[60vh] mt-2">
                        <div className="grid grid-cols-5 w-full bg-[linear-gradient(315deg,_#DB4E08,_#FF9244)] rounded-lg py-3">
                            <div className="text-light font-semibold text-center text-sm">SUID</div>
                            <div className="text-light font-semibold text-center text-sm">Item Name</div>
                            <div className="text-light font-semibold text-center text-sm col-span-2">Current Stock</div>
                            <div className="text-light font-semibold text-center text-sm">Unit Price</div>
                        </div>
                        {meat.map((item, index) => (
                            <div className="grid grid-cols-5 w-full bg-white my-1.5 py-3 rounded-lg shadow-sm" key={ index }>
                                <div className="data-table-td text-center">{ item.code }</div>
                                <div className="data-table-td text-center">{ item.name }</div>
                                <div className="data-table-td text-center col-span-2">{ item.quantity } { item.unitMeasurement }</div>
                                <div className="data-table-td text-center">P 400.00</div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                <div className="w-full">
                    <div className="h-fit">
                        <div className="font-semibold">Snow Frost Stocks</div>
                        <div className="text-xs text-gray">Showing items that has SNOW FROST category.</div>
                    </div>
                    <ScrollArea className="h-[60vh] mt-2">
                        <div className="grid grid-cols-5 w-full bg-[linear-gradient(270deg,_hsla(213,62%,45%,1)_0%,_hsla(203,50%,64%,1)_100%)] rounded-lg py-3 sticky top-0">
                            <div className="text-light font-semibold text-center text-sm">SUID</div>
                            <div className="text-light font-semibold text-center text-sm">Item Name</div>
                            <div className="text-light font-semibold text-center text-sm col-span-2">Current Stock</div>
                            <div className="text-light font-semibold text-center text-sm">Unit Price</div>
                        </div>
                        {snow.map((item, index) => (
                            <div className="grid grid-cols-5 w-full bg-white my-1 py-1 rounded-lg shadow-sm" key={ index }>
                                <div className="data-table-td text-center">{ item.code }</div>
                                <div className="data-table-td text-center">{ item.name }</div>
                                <div className="data-table-td text-center col-span-2">{ item.quantity } { item.unitMeasurement }</div>
                                <div className="data-table-td text-center">P 400.00</div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

            </div>
        </section>
    );
}