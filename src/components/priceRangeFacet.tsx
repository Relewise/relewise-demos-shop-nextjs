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

    const lowerBound = () => {
        return props.facet.available?.value?.lowerBoundInclusive ?? 0
    }

    const upperBound = () => {
        return props.facet.available?.value?.upperBoundInclusive ?? 10000
    }

    const actualMinPrice = () => {

        if (!props.minPrice) {
            return lowerBound();
        }

        if (props.minPrice < lowerBound() || props.minPrice > upperBound()) {
            return lowerBound();
        }

        if (props.maxPrice && props.minPrice > props.maxPrice) {
            return lowerBound();
        }

        return props.minPrice;
    }

    const actualMaxPrice = () => {
        if (!props.maxPrice) {
            return upperBound();
        }

        if (props.maxPrice < lowerBound() || props.maxPrice > upperBound()) {
            return upperBound();
        }

        if (props.minPrice && props.minPrice > props.maxPrice) {
            return upperBound();
        }

        return props.maxPrice;
    }

    return (
        <div>
            <div className="w-full flex items-center justify-between mb-5 gap-2">
                <input value={actualMinPrice()} type="text" className="small" onChange={(e) => { props.setMinPrice(+e.target.value) }} /> -
                <input value={actualMaxPrice()} type="text" className="small" onChange={(e) => { props.setMaxPrice(+e.target.value) }} />
            </div>
            <RangeSlider step={1} min={lowerBound()} max={upperBound()}
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

    )
}

const PriceRangeFacet = dynamic(() => Promise.resolve(Component), {
    ssr: false,
})

export default PriceRangeFacet