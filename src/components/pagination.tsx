'use client'
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";

interface PaginationProps {
    pageSize: number,
    total: number,
    currentPage: number
}

const Component = (props: PaginationProps) => {

    const pageCount = Math.ceil(props.total / props.pageSize);
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
    
    return (
        <>
            {pageCount > 0 &&
                <div className="flex items-center gap-2">
                    <button disabled={props.currentPage === 1} className="item" >
                        <ChevronLeftIcon className="h-5 w-3" />
                    </button>
                    {pages.map((page, index) =>
                        <button key={index} className={"item" + (page == pageCount ? + " active" : "")}>
                            {page}
                        </button>
                    )}
                    <button disabled={props.currentPage === pageCount} className="item">
                        <ChevronRightIcon className="h-5 w-3" />
                    </button>
                </div>

            }
        </>

    )
}

const Pagination = dynamic(() => Promise.resolve(Component), {
    ssr: false,
})

export default Pagination