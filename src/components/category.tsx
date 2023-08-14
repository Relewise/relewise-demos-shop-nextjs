"use client";
import { ContextStore } from "@/stores/clientContextStore";
import { Sort } from "@/stores/sort";
import {
  CategoryResult,
  ProductCategorySearchBuilder,
  ProductSearchBuilder,
  ProductSearchResponse
} from "@relewise/client";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Facets from "./facets";
import Pagination from "./pagination";
import ProductTile from "./product/productTile";

const Component = () => {
  const contextStore = new ContextStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("Sort") as Sort) ?? Sort.Recommended;
  const currentSelectedBrands = searchParams.get("Brand")?.split(",");
  const categoryIds = searchParams.get("CategoryIds")?.split(",") ?? [];
  const currentSelectedSubCategories = searchParams
    .get("SubCategory")
    ?.split(",");
  const currentSelectedMinPrice = searchParams.get("MinPrice");
  const currentSelectedMaxPrice = searchParams.get("MaxPrice");

  const [category, setCategory] = useState<CategoryResult | undefined>();
  const [products, setProducts] = useState<ProductSearchResponse | undefined>();
  const [selectedFacets, setSelectedFacets] = useState<
    Record<string, string[]>
  >({
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

  const setQueryString = () => {
    const params = new URLSearchParams();
    const categoryFacets = getFacetsByType("SubCategory");
    const brandFacets = getFacetsByType("Brand");

    params.set("CategoryIds", categoryIds.toString());

    if (categoryFacets && categoryFacets.length > 0) {
      params.set("SubCategory", categoryFacets.toString());
    }

    if (brandFacets && brandFacets.length > 0) {
      params.set("Brand", brandFacets.toString());
    }

    if (minPrice) {
      params.set("MinPrice", minPrice.toString());
    }

    if (maxPrice) {
      params.set("MaxPrice", maxPrice.toString());
    }

    params.set("Sort", sort);
    router.push(pathname + "?" + params.toString());
  };

  function goToPage(page: number) {
    setPage(page);
    window.scrollTo(0, 0);
  }

  function onSortChange(e: ChangeEvent<HTMLSelectElement>) {
    const sortBy = e.target.value as Sort;
    setSort(sortBy);
  }

  function getFacetsByType(type: string) {
    if (!selectedFacets[type] || selectedFacets[type].length < 1) {
      return null;
    }
    return selectedFacets[type];
  }

  function setFacet(type: string, value: string) {
    const currentSelectFacetValues = getFacetsByType(type);
    const valueAlreadySelected =
      (currentSelectFacetValues?.find((v) => v === value)?.length ?? 0) > 0;

    if (valueAlreadySelected) {
      const newSelectFacets = { ...selectedFacets };
      const indexToRemove = newSelectFacets[type].indexOf(value);
      newSelectFacets[type].splice(indexToRemove, 1);
      setSelectedFacets(newSelectFacets);
      return;
    }

    const newSelectFacets = { ...selectedFacets };
    newSelectFacets[type].push(value);
    setSelectedFacets(newSelectFacets);
  }

  useEffect(() => {
    if (!contextStore.isConfigured()) {
      return;
    }

    const searcher = contextStore.getSearcher();
    const productCategorySearchBuilder = new ProductCategorySearchBuilder(
      contextStore.getDefaultSettings()
    )
      .setSelectedCategoryProperties({ displayName: true })
      .filters((f) =>
        f.addProductCategoryIdFilter("ImmediateParentOrItsParent", [
          categoryIds[categoryIds.length - 1]
        ])
      );

    searcher
      .searchProductCategories(productCategorySearchBuilder.build())
      .then((response) => {
        if (response?.results) {
          setCategory(response?.results[0]);
        }
      });
  }, [categoryIds]);

  useEffect(() => {
    if (!contextStore.isConfigured()) {
      return;
    }

    setQueryString();
    const productSearchBuild = new ProductSearchBuilder(
      contextStore.getDefaultSettings()
    )
      .setSelectedProductProperties(contextStore.getProductSettings())
      .setSelectedVariantProperties({ allData: true })
      .setExplodedVariants(1)
      .filters((f) => {
        f.addProductCategoryIdFilter("Ancestor", [
          categoryIds[categoryIds.length - 1]
        ]);
      })
      .facets((f) =>
        f
          .addCategoryFacet("ImmediateParent", getFacetsByType("Category"))
          .addBrandFacet(getFacetsByType("Brand"))
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

    contextStore
      .getSearcher()
      .searchProducts(productSearchBuild.build())
      .then((response) => {
        setProducts(response);
        setPage(1);
      });
  }, [page, sort, selectedFacets, minPrice, maxPrice]);

  return (
    <div className="search">
      <div className="flex gap-3">
        <div className="w-1/5">
          {products?.facets && (
            <Facets
              facets={products?.facets}
              setFacet={setFacet}
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
                <h1 className="text-3xl font-semibold">
                  {category?.displayName}
                </h1>
                {products?.hits > 0 && (
                  <span className="whitespace-nowrap">
                    Showing {page * pageSize - (pageSize - 1)} -{" "}
                    {products?.hits < pageSize ? products?.hits : page * 40} of{" "}
                    {products?.hits}
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
                  goToPage={goToPage}
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
