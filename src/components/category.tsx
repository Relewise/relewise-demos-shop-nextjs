"use client";
import { ContextStore } from "@/stores/contextStore";
import { Sort } from "@/stores/sort";
import generateFacetQueryString from "@/util/generateFacetQueryString";
import getFacetsByType from "@/util/getFacetsByType";
import {
  CategoryResult,
  ProblemDetailsError,
  ProductCategorySearchBuilder,
  ProductSearchBuilder,
  ProductSearchResponse
} from "@relewise/client";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Facets from "./facets";
import Pagination from "./pagination";
import ProductTile from "./product/productTile";
import { TrackingStore } from "@/stores/trackingStore";
import handleRelewiseClientError from "@/util/handleError";

const Component = () => {
  const contextStore = useCallback(() => new ContextStore(), []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("Sort") as Sort) ?? Sort.Recommended;
  const currentSelectedBrands = searchParams.get("Brand")?.split(",");
  const categoryIds = useCallback(() => {
    return searchParams.get("CategoryIds")?.split(",") ?? [];
  }, [searchParams]);
  const currentSelectedSubCategories = searchParams.get("Category")?.split(",");
  const currentSelectedMinPrice = searchParams.get("MinPrice");
  const currentSelectedMaxPrice = searchParams.get("MaxPrice");

  const [category, setCategory] = useState<CategoryResult | undefined>();
  const [products, setProducts] = useState<ProductSearchResponse | undefined>();
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({
    Category: currentSelectedSubCategories ?? [],
    Brand: currentSelectedBrands ?? []
  });
  const [minPrice, setMinPrice] = useState<number | undefined>(
    currentSelectedMinPrice ? +currentSelectedMinPrice : undefined
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    currentSelectedMaxPrice ? +currentSelectedMaxPrice : undefined
  );
  const [sort, setSort] = useState<Sort>(currentSort);
  const [page, setPage] = useState(1);
  const pageSize = 40;

  const setQueryString = useCallback(() => {
    const facetParams = generateFacetQueryString(searchParams, selectedFacets, minPrice, maxPrice);

    facetParams.set("CategoryIds", categoryIds().toString());
    facetParams.set("Sort", sort);
    router.push("?" + facetParams.toString());
  }, [categoryIds, maxPrice, minPrice, router, searchParams, selectedFacets, sort]);

  function onSortChange(e: ChangeEvent<HTMLSelectElement>) {
    const sortBy = e.target.value as Sort;
    setSort(sortBy);
  }

  useEffect(() => {
    if (!contextStore().isConfigured()) {
      return;
    }

    const searcher = contextStore().getSearcher();
    const productCategorySearchBuilder = new ProductCategorySearchBuilder(
      contextStore().getDefaultSettings()
    )
      .setSelectedCategoryProperties({ displayName: true })
      .filters((f) =>
        f.addProductCategoryIdFilter("ImmediateParentOrItsParent", [
          categoryIds()[categoryIds.length - 1]
        ])
      );

    searcher.searchProductCategories(productCategorySearchBuilder.build()).then((response) => {
      if (response?.results) {
        new TrackingStore().trackCategoryView(categoryIds());
        setCategory(response?.results[0]);
      }
    })
    .catch((e: ProblemDetailsError) => {
      handleRelewiseClientError(e);
    });
  }, [categoryIds, contextStore]);

  useEffect(() => {
    if (!contextStore().isConfigured()) {
      return;
    }

    setQueryString();
    const productSearchBuild = new ProductSearchBuilder(contextStore().getDefaultSettings())
      .setSelectedProductProperties(contextStore().getProductSettings())
      .setSelectedVariantProperties({ allData: true })
      .setExplodedVariants(1)
      .filters((f) => {
        f.addProductCategoryIdFilter("Ancestor", [categoryIds()[categoryIds().length - 1]]);
      })
      .facets((f) =>
        f
          .addCategoryFacet("ImmediateParent", getFacetsByType(selectedFacets, "Category"))
          .addBrandFacet(getFacetsByType(selectedFacets, "Brand"))
          .addSalesPriceRangeFacet("Product", minPrice, maxPrice)
      )
      .pagination((p) => p.setPageSize(40).setPage(page))
      .sorting((s) => {
        switch (sort) {
          case "Popular": {
            s.sortByProductPopularity();
            break;
          }
          case "SalesPriceAsc": {
            s.sortByProductAttribute("SalesPrice", "Ascending");
            break;
          }
          case "SalesPriceDesc": {
            s.sortByProductAttribute("SalesPrice", "Descending");
            break;
          }
          default: {
            break;
          }
        }
      });

    contextStore()
      .getSearcher()
      .searchProducts(productSearchBuild.build())
      .then((response) => {
        setProducts(response);
        setPage(1);
      })
      .catch((e: ProblemDetailsError) => {
        handleRelewiseClientError(e);
      });
  }, [page, sort, selectedFacets, minPrice, maxPrice, contextStore, setQueryString, categoryIds]);

  return (
    <div className="search">
      <div className="flex gap-3">
        <div className="w-1/5">
          {products?.facets && (
            <Facets
              selectedFacets={selectedFacets}
              setSelectedFacets={setSelectedFacets}
              facets={products?.facets}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
            />
          )}
        </div>
        <div className="w-4/5">
          {products?.results && (
            <div>
              <div className="bg-white rounded flex items-end p-3 gap-4">
                <h1 className="text-3xl font-semibold">{category?.displayName}</h1>
                {products?.hits > 0 && (
                  <span className="whitespace-nowrap">
                    Showing {page * pageSize - (pageSize - 1)} -{" "}
                    {products?.hits < pageSize ? products?.hits : page * 40} of {products?.hits}
                  </span>
                )}
                <div className="flex-grow"></div>
                <select value={sort} onChange={onSortChange} className="w-1/6">
                  <option>{Sort.Recommended}</option>
                  <option>{Sort.Popular}</option>
                  <option value={Sort.SalesPriceDesc}>Sales Price desc</option>
                  <option value={Sort.SalesPriceAsc}>Sales Price asc</option>
                </select>
              </div>
              <div className="grid gap-3 grid-cols-4 mt-3">
                {products?.results?.map((product, index) => (
                  <ProductTile product={product} key={index} />
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
        </div>
      </div>
    </div>
  );
};
const CategoryComponent = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default CategoryComponent;
