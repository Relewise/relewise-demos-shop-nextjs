"use client";
import { ContextStore } from "@/stores/clientContextStore";
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
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import ProductTile from "./product/productTile";
import dynamic from "next/dynamic";

interface SearchOverlayProps {
  input: string;
}

const Component = (props: SearchOverlayProps) => {
  const [products, setProducts] = React.useState<
    ProductSearchResponse | undefined
  >();
  const [fallbackProducts, setFallbackProducts] = React.useState<
    ProductRecommendationResponse | undefined
  >();
  const [predictions, setPredictions] = React.useState<
    SearchTermPredictionResult[]
  >([]);
  const [page, setPage] = React.useState(1);
  const router = useRouter();
  const pathname = usePathname();

  const isSearching = () => {
    return props.input.length > 0;
  };

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

    const searchCollectionBuilder = new SearchCollectionBuilder()
      .addRequest(
        new ProductSearchBuilder(contextStore.getDefaultSettings())
          .setSelectedProductProperties(contextStore.getProductSettings())
          .setSelectedVariantProperties({ allData: true })
          .setTerm(props.input.length > 0 ? props.input : null)
          .pagination((p) => p.setPageSize(30).setPage(page))
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
  }, [page, props.input]);

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
                              const params = new URLSearchParams();
                              params.set("Term", prediction.term ?? "");
                              router.push(pathname + "?" + params.toString());
                            }}
                          >
                            {prediction.term}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="w-4/5">
                    <div className="flex gap-6 items-end p-3 bg-white rounded mb-3">
                      <h2 v-if="filters.term" className="text-3xl">
                        Showing results for <strong>{props.input}</strong>
                      </h2>
                      <span v-if="result.hits > 0">
                        Showing {page * 30 - 29} -{" "}
                        {products?.hits < 30 ? products?.hits : page * 30} of{" "}
                        {products?.hits}
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
                      <div className="grid gap-3 grid-cols-4">
                        {products?.results?.map((product, index) => (
                          <ProductTile key={index} product={product} />
                        ))}
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
