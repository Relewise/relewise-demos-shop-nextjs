'use client'
import { ProductFacetResult } from "@relewise/client";
import dynamic from "next/dynamic";
import CheckListFacet from "./checkListFacet";

interface FacetsProps {
    facets: ProductFacetResult
    setFacet(type: string, value: string): void
}

const Component = (props: FacetsProps) => {
    return (
        <div>
            {props.facets.items?.map((facet, index) =>
                <div key={index}>
                    <div key="index" className="px-3 py-3 bg-white rounded mb-3">
                        <div className="font-semibold text-lg mb-2">
                            {facet.field}
                        </div>
                        <CheckListFacet facet={facet} setFacet={props.setFacet}/>
                    </div>
                </div>
            )
            }
        </div >

    )
}

const Facets = dynamic(() => Promise.resolve(Component), {
    ssr: false,
})

export default Facets