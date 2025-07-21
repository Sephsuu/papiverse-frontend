import { LoaderCircle } from "lucide-react";

interface LoaderProps {
    onProcess: boolean;
    label: string;
    loadingLabel: string;
}

export function FormLoader({ onProcess, label, loadingLabel }: LoaderProps) {
    if (onProcess) return <><LoaderCircle className="w-4 h-4 text-light animate-spin" />{ loadingLabel }</>
    else return <>{ label }</>
}