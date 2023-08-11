'use client'
import { PriceRangeFacetResult, ProductFacetResult } from "@relewise/client";
import 'next-range-slider/dist/main.css';
import dynamic from "next/dynamic";
import CheckListFacet from "./checkListFacet";
import PriceRangeFacet from "./priceRangeFacet";

interface FacetsProps {
    facets: ProductFacetResult
    setFacet(type: string, value: string): void
    setMinPrice(price: number): void
    setMaxPrice(price: number): void
    minPrice: number | undefined
    maxPrice: number | undefined
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
                        {(facet.field == "Category" || "Brand") &&
                            <CheckListFacet facet={facet} setFacet={props.setFacet} />
                        }
                        {(facet.field == "SalesPrice") &&
                            <PriceRangeFacet facet={facet as PriceRangeFacetResult} maxPrice={props.maxPrice} minPrice={props.minPrice} setMaxPrice={props.setMaxPrice} setMinPrice={props.setMinPrice} />
                        }
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