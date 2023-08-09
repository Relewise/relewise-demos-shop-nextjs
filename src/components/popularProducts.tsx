'use client'
import { ContextStore } from "@/stores/clientContextStore";
import { PopularProductsBuilder, ProductResult, UserFactory } from "@relewise/client";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import ProductTile from "./product/productTile";

const Component = () => {

    const contextStore = new ContextStore();

    const [popularProducts, setPopularProducts] = React.useState<ProductResult[] | null | undefined>();

    useEffect(() => {
        if (!contextStore.isConfigured()) {
            return;
        }

        const builder = new PopularProductsBuilder(contextStore.getDefaultSettings())
            .setSelectedProductProperties(contextStore.getProductSettings());

        contextStore.getRecomender()
            .recommendPopularProducts(builder.build())
            .then((result) => {
                setPopularProducts(result?.recommendations);
            });
    }, [])

    if (!contextStore.isConfigured()) {
        return (<></>)
    }

    return (
        <>
            <h2 className="text-3xl font-semibold mb-3">
                Popular products
            </h2>
            <div className="grid gap-3 grid-cols-5 mt-3">
                {popularProducts?.map((product, index) =>
                    <ProductTile key={index} product={product} />
                )}
            </div>
        </>

    )
}

const PopularProducts = dynamic(() => Promise.resolve(Component), {
    ssr: false,
})

export default PopularProducts