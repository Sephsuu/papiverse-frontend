import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "./dialog"
import { Fragment } from "react"

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
    <div>
      <DialogTitle><Skeleton className="w-2/5 h-5 bg-slate-200" /></DialogTitle>
      <div className="flex justify-between mt-2 items-end">
        <Skeleton className="w-2/5 h-8 bg-slate-200" />
        <Skeleton className="w-1/5 h-5 bg-slate-200" />
      </div>
      <div className="flex justify-between mt-2 items-end">
        <Skeleton className="w-2/5 h-5 bg-slate-200" />
        <Skeleton className="w-1/6 h-5 bg-slate-200" />
      </div>
      <div className="grid grid-cols-2 mt-3 gap-2">
        <Skeleton className="w-4/10 h-5 bg-slate-200" />
        <Skeleton className="w-5/10 h-5 bg-slate-200" />
        <Skeleton className="w-5/10 h-5 bg-slate-200" />
        <Skeleton className="w-6/10 h-5 bg-slate-200" />
        <Skeleton className="w-7/10 h-5 bg-slate-200" />
      </div>
      <div className="grid grid-cols-5 gap-2 mt-4">
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
        <Skeleton className="w-full h-5 bg-slate-200" />
      </div>
    </div>
  )
}

function FullOorderSkeleton() {
  return(
    <div className="w-full py-4 px-2">
      {[0,1].map((i, _) => (
        <Fragment key={_}>
          <Skeleton className="w-2/5 h-5 bg-slate-200" />
          <div className="flex justify-between mt-2 items-end">
            <Skeleton className="w-2/5 h-8 bg-slate-200" />
            <Skeleton className="w-1/5 h-5 bg-slate-200" />
          </div>
          <div className="flex justify-between mt-2 items-end">
            <Skeleton className="w-2/5 h-5 bg-slate-200" />
            <Skeleton className="w-1/6 h-5 bg-slate-200" />
          </div>
          <div className="grid grid-cols-2 mt-3 gap-2">
            <Skeleton className="w-4/10 h-5 bg-slate-200" />
            <Skeleton className="w-5/10 h-5 bg-slate-200" />
            <Skeleton className="w-5/10 h-5 bg-slate-200" />
            <Skeleton className="w-6/10 h-5 bg-slate-200" />
            <Skeleton className="w-7/10 h-5 bg-slate-200" />
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
            <Skeleton className="w-full h-5 bg-slate-200" />
          </div>
        </Fragment>
      ))}
    </div>
  )
}

export { Skeleton, OrderModalSkeleton, FullOorderSkeleton }
