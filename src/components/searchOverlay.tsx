"use client";
import { ContextStore } from "@/stores/clientContextStore";
import generateFacetQueryString from "@/util/generateFacetQueryString";
import getFacetsByType from "@/util/getFacetsByType";
import {
  ProductRecommendationResponse,
  ProductSearchBuilder,
  ProductSearchResponse,
  SearchCollectionBuilder,
  SearchTermBasedProductRecommendationBuilder,
  SearchTermPredictionBuilder,
  SearchTermPredictionResponse,
  SearchTermPredictionResult
} from "@relewise/client";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import Facets from "./facets";
import Pagination from "./pagination";
import ProductTile from "./product/productTile";

interface SearchOverlayProps {
  input: string;
  setInput(input: string): void;
}

const Component = (props: SearchOverlayProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageSize = 28;

  const currentSelectedBrands = searchParams.get("Brand")?.split(",");
  const currentSelectedSubCategories = searchParams.get("Category")?.split(",");
  const currentSelectedMinPrice = searchParams.get("MinPrice");
  const currentSelectedMaxPrice = searchParams.get("MaxPrice");

  const [minPrice, setMinPrice] = React.useState<number | undefined>(
    currentSelectedMinPrice ? +currentSelectedMinPrice : undefined
  );
  const [maxPrice, setMaxPrice] = React.useState<number | undefined>(
    currentSelectedMaxPrice ? +currentSelectedMaxPrice : undefined
  );
  const [products, setProducts] = React.useState<
    ProductSearchResponse | undefined
  >();
  const [fallbackProducts, setFallbackProducts] = React.useState<
    ProductRecommendationResponse | undefined
  >();
  const [predictions, setPredictions] = React.useState<
    SearchTermPredictionResult[]
  >([]);

  const [selectedFacets, setSelectedFacets] = React.useState<
    Record<string, string[]>
  >({
    Category: currentSelectedSubCategories ?? [],
    Brand: currentSelectedBrands ?? []
  });
  const [page, setPage] = React.useState(1);

  const isSearching = () => {
    return props.input.length > 0;
  };

  const setQueryString = React.useCallback(() => {
    const facetParams = generateFacetQueryString(
      searchParams,
      selectedFacets,
      minPrice,
      maxPrice
    );

    router.push("?" + facetParams.toString());
  }, [maxPrice, minPrice, router, searchParams, selectedFacets]);

  useEffect(() => {
    const contextStore = new ContextStore();
    if (!contextStore.isConfigured()) {
      return;
    }

    const mainContainer = document.querySelector("#main-container");
    if (!mainContainer) {
      return;
    }

    if (props.input.length < 1) {
      mainContainer.classList.remove("hidden");
      return;
    }

    mainContainer.classList.add("hidden");
    setQueryString();
    const searchCollectionBuilder = new SearchCollectionBuilder()
      .addRequest(
        new ProductSearchBuilder(contextStore.getDefaultSettings())
          .setSelectedProductProperties(contextStore.getProductSettings())
          .setSelectedVariantProperties({ allData: true })
          .setTerm(props.input.length > 0 ? props.input : null)
          .facets((f) =>
            f
              .addCategoryFacet(
                "ImmediateParent",
                getFacetsByType(selectedFacets, "Category")
              )
              .addBrandFacet(getFacetsByType(selectedFacets, "Brand"))
              .addSalesPriceRangeFacet("Product", minPrice, maxPrice)
          )
          .pagination((p) => p.setPageSize(pageSize).setPage(page))
          .build()
      )
      .addRequest(
        new SearchTermPredictionBuilder(contextStore.getDefaultSettings())
          .addEntityType("Product")
          .setTerm(props.input)
          .take(5)
          .build()
      );

    const searcher = contextStore.getSearcher();
    searcher.batch(searchCollectionBuilder.build()).then((response) => {
      if (response && response.responses) {
        const productResult = response.responses[0] as ProductSearchResponse;
        setProducts(productResult);
        setPredictions(
          (response.responses[1] as SearchTermPredictionResponse)
            ?.predictions ?? []
        );

        if (productResult.hits < 1) {
          const searchTermBasedProductRecommendationBuilder =
            new SearchTermBasedProductRecommendationBuilder(
              contextStore.getDefaultSettings()
            )
              .setSelectedProductProperties(contextStore.getProductSettings())
              .setSelectedVariantProperties({ allData: true })
              .setTerm(props.input)
              .setNumberOfRecommendations(40);

          const recommender = contextStore.getRecommender();

          recommender
            .recommendSearchTermBasedProducts(
              searchTermBasedProductRecommendationBuilder.build()
            )
            .then((response) => {
              setFallbackProducts(response);
            });
        }
      }
    });
  }, [maxPrice, minPrice, page, props.input, selectedFacets, setQueryString]);

  return isSearching() && document != undefined
    ? createPortal(
        <>
          {products && (
            <div className="modal">
              <div className="container mx-auto pt-3 pb-10">
                <div className="flex gap-3">
                  <div className="w-1/5">
                    {predictions.length > 0 && (
                      <div className="p-3 bg-white mb-3">
                        <span className="font-semibold">Suggestions</span>
                        {predictions.map((prediction, index) => (
                          <a
                            className="mb-1 block cursor-pointer"
                            key={index}
                            onClick={() => {
                              props.setInput(prediction.term ?? "");
                            }}
                          >
                            {prediction.term}
                          </a>
                        ))}
                      </div>
                    )}
                    {products?.facets && (
                      <Facets
                        facets={products?.facets}
                        selectedFacets={selectedFacets}
                        setSelectedFacets={setSelectedFacets}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        setMinPrice={setMinPrice}
                        setMaxPrice={setMaxPrice}
                      />
                    )}
                  </div>
                  <div className="w-4/5">
                    <div className="flex gap-6 items-end p-3 bg-white rounded mb-3">
                      <h2 v-if="filters.term" className="text-3xl">
                        Showing results for <strong>{props.input}</strong>
                      </h2>
                      <span v-if="result.hits > 0">
                        Showing {page * pageSize - 29} -{" "}
                        {products?.hits < pageSize
                          ? products?.hits
                          : page * pageSize}{" "}
                        of {products?.hits}
                      </span>
                    </div>
                    {products.redirects && products.redirects.length > 0 && (
                      <div className="mb-3 p-3 bg-white">
                        <h2 className="text-xl font-semibold mb-2">
                          Redirect(s)
                        </h2>
                        {products.redirects?.map((redirect, index) => (
                          <div
                            key={index}
                            className="mb-1 pb-1 flex border-b border-solid border-gray-300"
                          >
                            {redirect.destination}
                          </div>
                        ))}
                      </div>
                    )}
                    {products.hits < 1 ? (
                      <div className="p-3 text-xl bg-white">
                        No products found
                      </div>
                    ) : (
                      <div>
                        <div className="grid gap-3 grid-cols-4">
                          {products?.results?.map((product, index) => (
                            <ProductTile key={index} product={product} />
                          ))}
                        </div>
                        <div className="py-3 flex justify-center">
                          <Pagination
                            currentPage={page}
                            total={products.hits}
                            pageSize={pageSize}
                            goToPage={(newPage) => {
                              setPage(newPage);
                              window.scrollTo(0, 0);
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {fallbackProducts &&
                      fallbackProducts.recommendations &&
                      fallbackProducts.recommendations.length > 0 && (
                        <div className="w-full p-3 bg-white rounded mb-6">
                          <h2 className="text-xl">You may like</h2>
                          <div className="grid gap-3 grid-cols-4">
                            {fallbackProducts.recommendations?.map(
                              (fallbackProduct, index) => (
                                <ProductTile
                                  key={index}
                                  product={fallbackProduct}
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>,
        document.body
      )
    : null;
};

const SearchOverlay = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default SearchOverlay;
