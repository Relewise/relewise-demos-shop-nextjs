'use client'
import { ClientContextStore } from "@/stores/clientContextStore";
import { Sort } from "@/stores/sort";
import { CategoryResult, ProductCategorySearchBuilder, ProductSearchBuilder, ProductSearchResponse } from "@relewise/client";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Pagination from "./pagination";
import ProductTile from "./product/productTile";

interface CategoryProps {
    categoryIds: string[]
}

const Component = (props: CategoryProps) => {

    const contextStore = new ClientContextStore();
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentSort = searchParams.get('sort') as Sort ?? Sort.Recommended

    const [category, setCategory] = useState<CategoryResult | undefined>()
    const [products, setProducts] = useState<ProductSearchResponse | undefined>()
    const [sort, setSort] = useState<Sort>(currentSort)
    const [page, setPage] = useState(1)
    const pageSize = 40;

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(Array.from(searchParams.entries()));
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    )


    function goToPage(page: number) {
        setPage(page);
        window.scrollTo(0, 0);
    }

    function onSortChange(e: ChangeEvent<HTMLSelectElement>) {
        const sortBy = e.target.value as Sort;

        router.push(pathname + "?" + createQueryString("sort", sortBy))
        setSort(sortBy)
    }

    useEffect(() => {
        if (contextStore.getAppContext().datasets.length < 1) {
            return;
        }

        const searcher = contextStore.getSearcher();

        const productCategorySearchBuilder = new ProductCategorySearchBuilder(contextStore.getDefaultSettings())
            .setSelectedCategoryProperties({ displayName: true })
            .filters(f => f.addProductCategoryIdFilter('ImmediateParentOrItsParent', [props.categoryIds[props.categoryIds.length - 1]]));

        searcher
            .searchProductCategories(productCategorySearchBuilder.build())
            .then(response => {
                if (response?.results) {
                    const categoryResult = response?.results[0];

                    const productSearchBuild = new ProductSearchBuilder(contextStore.getDefaultSettings())
                        .setSelectedProductProperties(contextStore.getProductSettings())
                        .setSelectedVariantProperties({ allData: true })
                        .setExplodedVariants(1)
                        .filters(f => {
                            f.addProductCategoryIdFilter('Ancestor', [categoryResult?.categoryId ?? ""]);
                        })
                        .facets(f => f
                            .addCategoryFacet('ImmediateParent', null)
                            .addBrandFacet(null)
                            .addSalesPriceRangeFacet('Product', undefined),
                        )
                        .pagination(p => p.setPageSize(40).setPage(page))
                        .sorting(s => {
                            switch (sort) {
                                case "Popular": {
                                    s.sortByProductPopularity();
                                    break;
                                }
                                case "SalesPriceAsc": {
                                    s.sortByProductAttribute("SalesPrice", "Ascending")
                                    break;
                                }
                                case "SalesPriceDesc": {
                                    s.sortByProductAttribute("SalesPrice", "Descending")
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                        })
                        ;

                    contextStore.getSearcher().searchProducts(productSearchBuild.build())
                        .then(response => {
                            setProducts(response)
                            setCategory(categoryResult)
                        }
                        );
                }
            })


    }, [page, sort])

    return (
        <div className="search">
            <div className="flex gap-3">
                <div className="w-1/5">
                    {/* {category?.facets &&
                        <Facets facets={productCategorySearchResponse?.facets} />
                    } */}
                </div>
                <div className="w-4/5">
                    {products?.results &&
                        <div>
                            <div className="bg-white rounded flex items-end p-3 gap-4">
                                <h1 className="text-3xl font-semibold">
                                    {category?.displayName}
                                </h1>
                                {products?.hits > 0 &&
                                    <span className="whitespace-nowrap">Showing {(page * pageSize) - (pageSize - 1)} - {products?.hits < pageSize ? products?.hits : page * 40} of {products?.hits}</span>
                                }
                                <div className="flex-grow">
                                </div>
                                <select value={sort} onChange={onSortChange} className="w-1/6" >
                                    <option>{Sort.Recommended}</option>
                                    <option>{Sort.Popular}</option>
                                    <option value={Sort.SalesPriceDesc}>
                                        Sales Price desc
                                    </option>
                                    <option value={Sort.SalesPriceAsc}>
                                        Sales Price asc
                                    </option>
                                </select>
                            </div>
                            <div className="grid gap-3 grid-cols-4 mt-3">
                                {products?.results?.map((product, index) => (
                                    <ProductTile product={product} key={index} />
                                ))}
                            </div>
                            <div className="py-3 flex justify-center">
                                <Pagination currentPage={page} total={products.hits} pageSize={pageSize} goToPage={goToPage} />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}
const CategoryComponent = dynamic(() => Promise.resolve(Component), {
    ssr: false,
})

export default CategoryComponent