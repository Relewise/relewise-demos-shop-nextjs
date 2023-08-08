'use client'
import { FacetResult, ProductFacetResult } from "@relewise/client";
import dynamic from "next/dynamic";

interface CheckListFacetsProps {
    facet: FacetResult
}

const Component = (props: CheckListFacetsProps) => {
    return (

        <div>
            {(props.facet.field == "Category" || props.facet.field == "Brand") &&
                <div>
                   
                </div>

            }
        </div >

    )
}

const CheckListFacet = dynamic(() => Promise.resolve(Component), {
    ssr: false,
})

export default CheckListFacet