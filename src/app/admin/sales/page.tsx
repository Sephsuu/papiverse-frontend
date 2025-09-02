"use client"

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { brownColors, sales, topSelling } from "@/lib/data-array";
import { formatDateTime, formatDateToWords, formatToPeso } from "@/lib/formatter"
import { SelectValue } from "@radix-ui/react-select";
import { NotepadText } from "lucide-react";
import { Fragment, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartTabs = ['Daily', 'Weekly', 'Monthly']

export default function SalesPage() {
    const [chartTab, setChartTab] = useState('Daily')
    const summary = [
        { title: 'Total Orders', date: formatDateTime('2025-08-21 22:45:19'), count: 78  },
        { title: 'Payment Methods', date: formatDateTime('2025-08-21 22:45:19'), count: 78, type: "Cash"  },
        { title: 'Payment Methods', date: formatDateTime('2025-08-21 22:45:19'), count: 78, type: "G-cash"  },
        { title: 'Type of Orders', date: formatDateTime('2025-08-21 22:45:19'), count: 78, type: "Dine in"  },
        { title: 'Type of Orders', date: formatDateTime('2025-08-21 22:45:19'), count: 78, type: "Take out"  },
        { title: 'Total Income', date: formatDateTime('2025-08-21 22:45:19'), count: formatToPeso(12000.00)  },
    ]
    const grouped = summary.reduce((acc, item) => {
        if (!acc[item.title]) {
            acc[item.title] = [];
        }
        acc[item.title].push(item);
        return acc;
    }, {} as Record<string, typeof summary>);

    console.log(grouped['Total Orders'][0].count);
    
    return(
        <section className="flex flex-col gap-2 w-full py-4 px-2">
            <div className="flex items-stretch gap-2">
                {Object.entries(grouped).map(([key, value]) => (
                    <div 
                        className="flex flex-col gap-2 flex-1 w-full p-4 bg-white shadow-sm rounded-md"
                        key={key}
                    >
                        <div className="font-semibold flex items-center justify-between">
                            <div className="text-sm">{ key }</div>
                            <div className="w-6 h-6 flex justify-center items-center rounded-full bg-darkorange text-light"><NotepadText className="w-4 h-4"/></div>
                        </div>
                        <div className="grid grid-cols-2 flex-1">
                        {value.map((item, index) => (
                            <Fragment key={ index }>
                                {item.type ? (
                                    <div>
                                        <div className="text-xs">{ item.type }</div>
                                        <div className="ml-3 text-2xl font-semibold scale-x-120 text-darkbrown">{item.count}</div>
                                    </div>                                            
                                ) : (<div className="ml-3 text-2xl font-semibold scale-x-120 text-darkbrown">{item.count}</div>)}
                            </Fragment>
                        ))}
                        </div>
                       <div className="text-xs text-gray">As of { grouped[key][0].date }</div>
                    </div>
                ))}
            </div>

            <div className="relative rounded-md shadow-sm bg-white p-4">
                <div className="absolute z-50 top-3 left-5 w-full flex items-center justify-between">
                    <div className="text-lg scale-x-110 font-semibold">Sales Revenue</div>
                    <div className="flex items-center gap-4 mr-12">
                        {chartTabs.map((item, index) => (
                            <button
                                onClick={ () => setChartTab(item) }
                                className={`text-sm text-gray ${chartTab === item && "!text-dark font-semibold"}`}
                                key={ index }
                            >
                                { item }
                            </button>
                        ))}
                    </div>
                    
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={sales} margin={{ top: 40, right: 10, left: 10, bottom: 0 }}>
                        <XAxis 
                            dataKey="date" 
                            tickFormatter={(dateStr) => {
                                const date = new Date(dateStr);
                                const monthName = date.getMonth() + 1
                                const day = date.getDate();
                                return `${monthName}/${day}`; 
                            }}
                            tick={
                                {fontSize: 12}
                            }
                        />
                        <YAxis 
                            tickFormatter={(sales) => (sales === 0 ? "" : formatToPeso(sales))}
                            tick={
                                {fontSize: 12}
                            }
                        />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip 
                            formatter={(value: number) => [`${formatToPeso(value)}`, "Sales"]} 
                            labelFormatter={(date: string) => formatDateToWords(date) }
                            contentStyle={{ fontSize: 12, backgroundColor: "#fff", border: "1px solid #ccc" }} 
                            itemStyle={{ fontSize: 12, color: "#8884d8" }}
                        />
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area 
                            type="linear" 
                            dataKey="sales" 
                            stroke="#8884d8"     
                            strokeWidth={3} 
                            fill="url(#colorSales)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-10 gap-2">
                <div className="relative col-span-3 border-1 flex flex-col justify-center items-center bg-white shadow-sm rounded-md">
                    <div className="absolute top-2 text-lg scale-x-110 font-semibold">Top Selling Summary</div>
                    <PieChart width={300} height={300} className="mt-2">
                        <Pie
                            data={topSelling}
                            dataKey="orders"
                            nameKey="name"
                            innerRadius={60}
                            cx="50%"
                            cy="50%"
                            fill="#8884d8"
                        >
                            {topSelling.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={brownColors[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    <div className="mx-auto -mt-4">
                        {topSelling.map((item, index) => (
                            <div className="flex items-center gap-1 my-1" key={ index }>
                                <div 
                                    className={`rounded-full w-3 h-3`}
                                    style={{ backgroundColor: brownColors[index] }}
                                ></div>
                                <div className="text-xs">{ item.name }</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-7 border-1 bg-white shadow-sm rounded-md">
                    <div className="flex justify-between p-2">
                        <div className="text-lg scale-x-110 font-semibold ml-2">Top Selling Products</div>
                    </div>
                    <div className="grid grid-cols-3">
                        <div className="data-table-th bg-slate-200 font-semibold">Product Name</div>
                        <div className="data-table-th bg-slate-200 font-semibold">Price</div>
                        <div className="data-table-th bg-slate-200 font-semibold">Orders</div>
                        {topSelling.map((item, index) => (
                            <Fragment key={ index }>
                                <div className="data-table-td">{ item.name }</div>
                                <div className="data-table-td">{ "Price" }</div>
                                <div className="data-table-td">{ item.orders }</div>
                            </Fragment>
                        ))}
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </section>
    )
}