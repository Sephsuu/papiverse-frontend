"use client"

import { PapiverseLoading } from "@/components/ui/loader";
import { AnnouncementService } from "@/services/AnnouncementService";
import { useEffect, useState } from "react";
import { AnnouncementImages } from './AnnouncementImages';
import { toast } from "sonner";
import { Announcement } from "@/types/announcement";
import { formatDateTime } from "@/lib/formatter";
import { Plus } from "lucide-react";
import { CreateAnnouncement } from "./CreateAnnouncement";

export function AnnouncementSection() {
    const [loading, setLoading] = useState(true);
    const [announcement, setAnnouncement] = useState<Announcement[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await AnnouncementService.getAllAnnouncements();
                console.log(data);
                
                setAnnouncement(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [])

    console.log(announcement);
    

    if (loading)  return <PapiverseLoading />
    return(
        <section className="w-full py-4">
            <button onClick={ () => setOpen(!open) } className="rounded-full w-10 h-10 shadow-sm"><Plus /></button>
            {announcement.map((item, index) => (
                <div className="bg-light rounded-md shadow-sm m-4 pt-4 py-2" key={ index }>
                    <div className="flex items-center gap-2 mb-2 px-4">
                        <div className="w-10 h-10 bg-darkbrown text-light flex justify-center items-center rounded-full">{ `${item.firstName![0]}${item.lastName![0]}` }</div>
                        <div>
                            <div className="font-semibold">{ `${item.firstName} ${item.lastName}` }</div>
                            <div className="text-gray text-sm -mt-1">{ item.branchName }</div>
                        </div>
                    </div>
                    <div className="my-0.5 px-4">{ item.content }</div>
                    <div className="px-2">
                        {item.announcementImages.length > 0 && (
                            <AnnouncementImages images={ item.announcementImages } />
                        )}
                    </div>
                    <div className="text-end text-sm px-2 text-gray my-1">{ formatDateTime(item.datePosted) }</div>
                </div>
            ))}

            {open && (
                <CreateAnnouncement 
                    setOpen={ setOpen }
                />
            )}

            
        </section>
    );
}