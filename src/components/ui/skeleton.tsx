import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "./dialog"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

function OrderModalSkeleton() {
  return(
    <Dialog open>
      <DialogContent>
        <DialogTitle>
          <Skeleton className="w-2/5 h-5 bg-slate-200" />
          <div className="justify-between">
            <Skeleton className="w-2/5 h-5 bg-slate-200" />
          </div>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  )
}

export { Skeleton, OrderModalSkeleton }
