import { LoaderCircle } from "lucide-react";
import Image from "next/image";

interface LoaderProps {
    onProcess: boolean;
    label: string;
    loadingLabel: string;
}

export function FormLoader({ onProcess, label, loadingLabel }: LoaderProps) {
    if (onProcess) return <><LoaderCircle className="w-4 h-4 text-light animate-spin" />{ loadingLabel }</>
    else return <>{ label }</>
}

export function PapiverseLoading({ className }: { className?: string }) {
    return(
        <section className={ `relative w-full h-screen ${className}` }>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
                <Image
                    src="/images/papiverse_logo.png"
                    alt="Papiverse Logo"
                    width={200}
                    height={200}
                />
                <div className="text-lg text-center">LOADING</div>
            </div>
        </section>
    );
}