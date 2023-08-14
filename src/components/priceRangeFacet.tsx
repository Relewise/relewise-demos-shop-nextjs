'use client'
import { PriceRangeFacetResult } from "@relewise/client";
import { RangeSlider } from "next-range-slider";
import 'next-range-slider/dist/main.css';
import dynamic from "next/dynamic";

interface PriceRangeFacetProps {
    facet: PriceRangeFacetResult
    setMinPrice(price: number): void
    setMaxPrice(price: number): void
    minPrice: number | undefined
    maxPrice: number | undefined
}

const Component = (props: PriceRangeFacetProps) => {

    if (!props.facet.available?.value ||
        !props.facet.available.value.lowerBoundInclusive ||
        !props.facet.available.value.upperBoundInclusive) {
        return (<></>)
    }

    const lowerBound = props.facet.available.value.lowerBoundInclusive;
    const upperBound = props.facet.available.value.upperBoundInclusive;

    const actualMinPrice = () => {
        if (!props.minPrice) {
            return lowerBound;
        }

        if (props.minPrice < lowerBound || props.minPrice > upperBound) {
            return lowerBound;
        }

        if (props.maxPrice && props.minPrice > props.maxPrice) {
            return lowerBound;
        }

        return props.minPrice;
    }

    const actualMaxPrice = () => {
        if (!props.maxPrice) {
            return upperBound;
        }

        if (props.maxPrice < lowerBound || props.maxPrice > upperBound) {
            return upperBound;
        }

        if (props.minPrice && props.minPrice > props.maxPrice) {
            return upperBound;
        }

        return props.maxPrice;
    }

    return (
        <>
            <div className="px-3 py-3 bg-white rounded mb-3">
                <div className="font-semibold text-lg mb-2">
                    {props.facet.field}
                </div>
                <div>
                    <div className="w-full flex items-center justify-between mb-5 gap-2">
                        <input
                            value={actualMinPrice()}
                            type="text"
                            className="small"
                            onChange={(e) => { props.setMinPrice(+e.target.value) }}
                        /> -
                        <input
                            value={actualMaxPrice()}
                            type="text"
                            className="small"
                            onChange={(e) => { props.setMaxPrice(+e.target.value) }}
                        />
                    </div>
                    <RangeSlider step={1} min={lowerBound} max={upperBound}
                        options={{
                            leftInputProps: {
                                value: actualMinPrice(),
                                onChange: (e) => {
                                    if (Number(e.target.value) < actualMaxPrice()) {
                                        props.setMinPrice(Number(e.target.value))
                                    }
                                },
                            },
                            rightInputProps: {
                                value: actualMaxPrice(),
                                onChange: (e) => {
                                    if (Number(e.target.value) > actualMinPrice()) {
                                        props.setMaxPrice(Number(e.target.value))
                                    }
                                },
                            },
                        }}
                    />
                </div >
            </div>
        </>
    )
}

const PriceRangeFacet = dynamic(() => Promise.resolve(Component), {
    ssr: false,
})

export default PriceRangeFacet