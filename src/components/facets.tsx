'use client'
import { ProductFacetResult } from "@relewise/client";
import { RangeSlider } from "next-range-slider";
import 'next-range-slider/dist/main.css';
import dynamic from "next/dynamic";
import CheckListFacet from "./checkListFacet";

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
                            <>
                                {('available' in facet && facet.available && 'value' in facet.available) &&
                                    <>
                                        <div className="w-full flex items-center justify-between mb-5 gap-2">
                                            <input value={props.minPrice ?? facet.available?.value?.lowerBoundInclusive ?? 0} type="text" className="small" onChange={(e) => props.setMinPrice(+e.target.value)} /> -
                                            <input value={props.maxPrice ?? facet.available?.value?.upperBoundInclusive ?? 10000} type="text" className="small" onChange={(e) => props.setMaxPrice(+e.target.value)} />
                                        </div>
                                        <RangeSlider step={1} min={facet.available?.value?.lowerBoundInclusive ?? 0} max={facet.available?.value?.upperBoundInclusive ?? 10000}
                                            options={{
                                                leftInputProps: {
                                                    value: props.minPrice ?? facet.available?.value?.lowerBoundInclusive ?? 0,
                                                    onChange: (e) => props.setMinPrice(Number(e.target.value)),
                                                },
                                                rightInputProps: {
                                                    value: props.maxPrice ?? facet.available?.value?.upperBoundInclusive ?? 10000,
                                                    onChange: (e) => props.setMaxPrice(Number(e.target.value)),
                                                },
                                            }}
                                        />
                                    </>
                                }
                            </>
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