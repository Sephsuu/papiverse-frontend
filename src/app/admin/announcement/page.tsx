import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import { AnnouncementSection } from "./_components/AnnouncementSection";

export default function AnnouncementPage() {
    return(
        <section className="grid grid-cols-4 w-full">
            {/* <Toaster closeButton position="top-center" /> */}
            {/* <div className="absolute flex items-center w-full gap-2 p-4 z-10">
                <Image
                    src="/images/kp_logo.png"
                    alt="KP Logo"
                    width={40}
                    height={40}
                />
                <div className="text-xl font-semibold">Announcements</div>
                <Image
                    src="/images/papiverse_logo.png"
                    alt="KP Logo"
                    width={100}
                    height={100}
                    className="ms-auto"
                />
            </div> */}
            <div className="h-screen col-span-1">
                
            </div>

            <div className="h-screen col-span-2">
              <AnnouncementSection />
            </div>

            <div className="h-screen col-span-1 bg-darkyellow">
              
            </div>
            
        </section>
    );
}