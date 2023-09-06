"use client";
import { ContextStore } from "@/stores/contextStore";
import handleRelewiseClientError from "@/util/handleError";
import {
  BrandResult,
  PopularBrandsRecommendationBuilder,
  ProblemDetailsError
} from "@relewise/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect } from "react";

const Component = () => {
  const [popularBrands, setPopularBrands] = React.useState<
    BrandResult[] | null | undefined
  >();

  useEffect(() => {
    const contextStore = new ContextStore();

    if (!contextStore.isConfigured()) {
      return;
    }

    const builder = new PopularBrandsRecommendationBuilder(
      contextStore.getDefaultSettings()
    );
    contextStore
      .getRecommender()
      .recommendPopularBrands(builder.build())
      .then((result) => {
        setPopularBrands(result?.recommendations);
      })
      .catch((e: ProblemDetailsError) => handleRelewiseClientError(e));
  }, []);

  return (
    <>
      {popularBrands && (
        <>
          <h2 className="text-3xl font-semibold mb-3 mt-10">Popular brands</h2>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-5 mt-3">
            {popularBrands.map((brand, index) => (
              <a
                key={index}
                href={`?Brand=${brand.id}`}
                className="rounded bg-white hover:bg-zinc-200 px-3 py-3"
              >
                {brand.displayName ?? brand.id}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

const PopularBrands = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default PopularBrands;
