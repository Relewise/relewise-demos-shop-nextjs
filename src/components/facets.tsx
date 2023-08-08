'use client'
import { ProductFacetResult } from "@relewise/client";
import dynamic from "next/dynamic";

interface FacetsProps {
    facets: ProductFacetResult
}

const Component = (props: FacetsProps) => {
    console.log(props.facets)
    return (
        <div>
            {props.facets.items?.map((facet, index) =>
                <div key={index}>
                    <div key="index" className="px-3 py-3 bg-white rounded mb-3">
                        <div className="font-semibold text-lg mb-2">
                            {facet.field}
                        </div>

                        {/* <CheckListFacet
                            v-if="((facet.field == 'Category' && showCategoryFacet) || facet.field == 'Brand') && 'available' in facet && Array.isArray(facet.available)"
                    :facet="facet" 
                    @search="applyFacet"/> */}
                        {/* <div v-else-if="facet.field === 'SalesPrice'">
                            <div class="w-full flex items-center justify-between mb-5 gap-2">
                                <input v-model="filters.price[0]" type="text" class="small" @keypress.enter="priceChange"> - <input
                                    v-model="filters.price[1]"
                                    type="text"
                                    class="small"
                            @keypress.enter="priceChange">
                            </div>
                            <div v-if="'available' in facet && facet.available && 'value' in facet.available"
                                class="px-1">
                                <Slider v-model="filters.price"
                                :tooltips="false"
                                :max="facet.available?.value?.upperBoundInclusive"
                                :min="facet.available?.value?.lowerBoundInclusive"
                                @update="priceChange"/>
                            </div>
                        </div> */}
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