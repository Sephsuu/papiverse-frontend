import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"

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
    setPagination : React.Dispatch<React.SetStateAction<{
        page : number,
        size : number,
        numberOfElements :number
    }>>
}


export function Pagination({paginationTotal, pagination, setPagination} : Props){
    return(
        <div className="flex justify-between">   
                 <div className="text-gray text-sm">Showing {pagination.page *  pagination.size + pagination.numberOfElements } of {paginationTotal.totalElements} results.</div>
                <div className="mr-10 flex gap-5">
                    <button className="text-gray text-sm flex items-center hover:text-black transition-colors duration-75"
                    disabled={pagination.page === 0}
                   onClick={() =>
                    setPagination(prev => ({
                        ...prev,
                        page: prev.page - 1
                    }))
                    }><ChevronLeft/> Back
                    </button>
                    <h1 className="text-gray font-sm"> Page {pagination.page + 1} of {paginationTotal.totalPage}</h1>
                    <button className="text-gray text-sm flex items-center hover:text-black transition-colors duration-75"
                    disabled={pagination.page + 1 === paginationTotal.totalPage}
                    onClick={() => setPagination(prev => ({
                        ...prev,
                        page : prev.page + 1
                    }))}>
                        Next <ChevronRight/>
                    </button>
                </div>
            </div>
    )
}