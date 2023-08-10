'use client'
import { FacetResult, ProductFacetResult } from "@relewise/client";
import dynamic from "next/dynamic";

interface CheckListFacetsProps {
    facet: FacetResult
    setFacet(type: string, value: string): void
}

const Component = (props: CheckListFacetsProps) => {

    const elementsToShow = 10;

    const options = () => {
        if (!('available' in props.facet)) return [];

        const sorted = [...(props.facet as any).available].sort((a, b) => a.value?.displayName?.localeCompare(b.value?.displayName ?? '') ?? 0);
        return sorted.slice(0, elementsToShow);
    };

    return (

        <div>
            {(props.facet.field == "Category" || props.facet.field == "Brand") &&
                <ul>
                    {options().map((option, index) =>
                        <div key={index}>
                            {(option.value && typeof option.value === 'object' && 'id' in option.value) &&
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" value={option.value.id} checked={option.selected} className="accent-blue-500 mr-1 h-4 w-4 cursor-pointer" onChange={() => props.setFacet(props.facet.field, option.value.id)} />
                                    {option.value?.displayName ?? option.value.id} <span className="ml-1 text-zinc-400">({option.hits})</span>
                                </label>
                            }
                        </div>
                    )}

                </ul>

            }
        </div >

    )
}

const CheckListFacet = dynamic(() => Promise.resolve(Component), {
    ssr: false,
})

export default CheckListFacet