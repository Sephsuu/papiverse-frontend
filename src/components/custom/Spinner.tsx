import { LoaderCircle } from "lucide-react";

export function Spinner({ className }: { className?: string }) {
  return (
    <LoaderCircle className={`h-4 w-4 animate-spin ${className}`} />
  );
}
