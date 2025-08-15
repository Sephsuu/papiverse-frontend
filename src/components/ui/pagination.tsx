import { ChevronLeft, ChevronRight } from "lucide-react"
import React, { useEffect, useState } from "react"
import { PapiverseLoading } from "./loader"

interface Props {
    paginationTotal : {
        totalPage: number,
        totalElements : number
    }
    pagination : {
        page : number,
        size : number,
        numberOfElements : number
    }
    shown: number,
    setPagination : React.Dispatch<React.SetStateAction<{
        page : number,
        size : number,
        numberOfElements :number
    }>>
}

export function Pagination({ paginationTotal, pagination, shown, setPagination }: Props) {

    function handleNext() {
        setPagination(prev => ({
            ...prev,
            page: prev.page + 1
        }))
    }

    return (
        <div className="flex justify-between">
            <div className="text-gray text-sm">
                Showing {shown} of {paginationTotal.totalElements} results.
            </div>
            <div className="mr-10 flex gap-5">
                <button
                    className="text-gray text-sm flex items-center disabled:hover:text-gray hover:text-black transition-colors duration-75 "
                    disabled={pagination.page === 0}
                    onClick={() =>
                        setPagination(prev => ({
                            ...prev,
                            page: prev.page - 1
                        }))
                    }
                >
                    <ChevronLeft /> Back
                </button>
                <h1 className="text-gray text-sm mt-0.5">
                    Page {pagination.page + 1} of {paginationTotal.totalPage}
                </h1>
                <button
                    className="text-gray text-sm flex items-center disabled:hover:text-gray  hover:text-black transition-colors duration-75"
                    disabled={pagination.page + 1 === paginationTotal.totalPage}
                    onClick={handleNext}
                >
                    Next <ChevronRight />
                </button>
            </div>
        </div>
    )
}