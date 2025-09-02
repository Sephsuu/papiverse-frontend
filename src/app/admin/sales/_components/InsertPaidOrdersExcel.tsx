"use client"

import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { displayCurrentDate } from "@/lib/formatter";
import { SalesService } from "@/services/SalesService";
import { PaidOrder } from "@/types/sales";
import { FileSpreadsheet, Upload } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
    setOpen: Dispatch<SetStateAction<boolean>>;
    setPaidOrdersPreview: Dispatch<SetStateAction<PaidOrder[]>>;
}

export function InsertPaidOrdersExcel({ setOpen, setPaidOrdersPreview }: Props)  {
    const [onProcess, setProcess] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        } else {
            setFile(null);
            setFileName("No excel file selected");
        }
    };

    const handleSubmit = async () => {
        try {
            setProcess(true);
            const data = await SalesService.readPaidOrders(file!);
            setPaidOrdersPreview(data);
            if (data) toast.success('Excel Read Success!');
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setProcess(false); 
            setOpen(!open);
        }
    } 

    return(
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent>
                <DialogTitle className="flex items-center gap-2">
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-xl">Insert Paid Orders Excel</div>   
                </DialogTitle>
                <div className="flex border-1 border-gray rounded-md">
                    <input 
                        className="w-30 px-2 text-sm"
                        value="Paid order for:" 
                        readOnly 
                    />
                    <Input 
                        className="w-full border-0"
                        value={ displayCurrentDate()  }
                        readOnly
                    />
                </div>
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button 
                    onClick={ handleButtonClick }
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                >
                    {fileName ? (
                        <FileSpreadsheet className="h-10 w-10 text-dark mx-auto mb-2" />
                    ) : (
                        <Upload className="h-10 w-10 text-gray mx-auto mb-2" />
                    )}
                    <p className={`text-gray text-sm mb-1 ${fileName && "!text-dark font-semibold"}`}>{ fileName ?? "No excel file selected" }</p>
                    <p className="text-xs text-gray">
                    Click "Add Images" to upload multiple images (max 10MB each)
                    </p>
                </button>

                <div className="flex justify-end gap-4">
                    <DialogClose className="text-sm">Close</DialogClose>
                    <AddButton 
                        handleSubmit={ handleSubmit }
                        onProcess={ onProcess }
                        label="Insert Paid Orders"
                        loadingLabel="Inserting Paid orders"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}