'use client'
import { ClientContextStore } from "@/stores/clientContextStore";
import { BrandResult, PopularBrandsRecommendationBuilder, UserFactory } from "@relewise/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect } from "react";

interface PopularBrandsProps {
    displayedAtLocation: string
}

const Component = (props: PopularBrandsProps) => {

    const contextStore = new ClientContextStore();
    if (contextStore.getAppContext().datasets.length < 1) {
        return (<></>)
    }

    const [popularBrands, setPopularBrands] = React.useState<BrandResult[] | null | undefined>();

    useEffect(() => {
        const selectedDataset = contextStore.getSelectedDataset();

        const builder = new PopularBrandsRecommendationBuilder(
            {
                currency: selectedDataset.currencyCode,
                language: selectedDataset.language,
                user: UserFactory.anonymous(),
                displayedAtLocation: props.displayedAtLocation
            }
        )

        contextStore.getRecomender()
            .recommendPopularBrands(builder.build())
            .then((result) => {
                setPopularBrands(result?.recommendations);
            });
    }, [])

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