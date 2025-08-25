"use client"

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { MapPinned, Menu, Plane, Search, UserRound } from "lucide-react";
import { useState } from "react";

export default function Index() {
    const [open, setOpen] = useState(false);
    return(
        <section className="p-4 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-semibold text-xl text-teal-700">Way.<span className="text-black">Farer</span></div>
                </div>
                <div className="flex items-center gap-6 px-8 rounded-full py-2 bg-white w-fit max-md:hidden">
                    <button>Home</button>
                    <button>Tour</button>
                    <button>About Us</button>
                    <button>Contact Us</button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="rounded-full w-8 h-8 p-2 bg-white flex justify-center items-center"><Plane /></div>
                    <div className="rounded-full w-8 h-8 p-2 bg-white flex justify-center items-center"><UserRound /></div>
                    <button
                        onClick={ () => setOpen(!open) } 
                        className="hidden rounded-full w-8 h-8 p-2 bg-white justify-center items-center
                                    max-md:flex"
                    >
                        <Menu />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 mt-12">
                <div className="col-span-8 my-auto max-md:col-span-12">
                    <div className="text-8xl max-md:text-7xl max-md:text-center">Your Next Adventure Awaits</div>
                </div>
                <div className="col-span-4 px-14 my-auto max-md:col-span-12 max-md:flex max-md:items-center max-md:flex-col">
                    <div className="max-md:text-center max-md:mt-4">
                        Explore stinning destinations, unique experiences, and unforgettable journeys with WayFarer.
                    </div>
                    <button className="bg-teal-900 mt-2 text-white rounded-full py-1 px-8">
                        Booking
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <div 
                    className="w-full h-80 rounded-lg bg-no-repeat bg-cover bg-center max-md:h-50"
                    style={{ backgroundImage: "url('https://i.pinimg.com/1200x/c4/78/7e/c4787ec1f53c048accdc5ad229ddbd7c.jpg')" }}
                >
                </div>
                <div className="flex items-center justify-evenly w-[80%] p-8 mx-auto bg-white rounded-lg shadow-sm -mt-12 max-md:overflow-x-auto max-md:gap-8 max-md:w-9/10">
                    <div>
                        <div className="flex items-center gap-2 text-gray"><MapPinned className="w-4 h-4" />Location</div>
                        <div>Rinjani, Indonesia</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-gray"><MapPinned className="w-4 h-4" />Location</div>
                        <div>Rinjani, Indonesia</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-gray"><MapPinned className="w-4 h-4" />Location</div>
                        <div>Rinjani, Indonesia</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-gray"><MapPinned className="w-4 h-4" />Location</div>
                        <div>Rinjani, Indonesia</div>
                    </div>
                    <button className="text-white rounded-full flex justify-center items-center p-2 bg-teal-900">
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <Sheet open={ open } onOpenChange={ setOpen }>
                <SheetContent className="w-4/10 flex flex-col justify-center items-center">
                <SheetTitle></SheetTitle>
                    <button>Home</button>
                    <button>Tour</button>
                    <button>About Us</button>
                    <button>Contact Us</button>
                </SheetContent>
            </Sheet>
        </section>
    );
}