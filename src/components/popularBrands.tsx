'use client'
import { ClientContextStore } from "@/stores/clientContextStore";
import { BrandResult, PopularBrandsRecommendationBuilder, UserFactory } from "@relewise/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect } from "react";

const Component = () => {

    const contextStore = new ClientContextStore();

    const [popularBrands, setPopularBrands] = React.useState<BrandResult[] | null | undefined>();

    useEffect(() => {
        if (contextStore.getAppContext().datasets.length < 1) {
            return
        }

        const builder = new PopularBrandsRecommendationBuilder(contextStore.getDefaultSettings())
        contextStore.getRecomender()
            .recommendPopularBrands(builder.build())
            .then((result) => {
                setPopularBrands(result?.recommendations);
            });
    })

    if (contextStore.getAppContext().datasets.length < 1) {
        return (<></>)
    }

    return (
        <>
            <h2 className="text-3xl font-semibold mb-3 mt-10">
                Popular brands
            </h2>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-5 mt-3">
                {popularBrands?.map((brand, index) =>
                    <Link key={index} href={`?brand=${brand.id}`} className="rounded bg-white hover:bg-zinc-200 px-3 py-3">
                        {brand.displayName ?? brand.id}
                    </Link>
                )}
            </div >
        </>

    )
}

const PopularBrands = dynamic(() => Promise.resolve(Component), {
    ssr: false,
})

export default PopularBrands