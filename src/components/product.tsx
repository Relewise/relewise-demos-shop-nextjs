'use client'
import ProductImage from "@/components/product/productImage";
import { ContextStore } from "@/stores/clientContextStore";
import { ProductResult, ProductSearchBuilder } from "@relewise/client";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

interface ProductProps {
    productId: string
}

const Component = (props: ProductProps) => {
    const contextStore = new ContextStore();

    const [product, setProduct] = React.useState<ProductResult | undefined>();

    useEffect(() => {
        if (!contextStore.isConfigured()) {
            return
        }

        const builder = new ProductSearchBuilder(contextStore.getDefaultSettings())
            .setSelectedProductProperties(contextStore.getProductSettings())
            .filters(fileter => fileter.addProductIdFilter([props.productId]))

        contextStore.getSearcher()
            .searchProducts(builder.build())
            .then(result => {
                if (result?.results) {
                    setProduct(result.results[0])
                }
            });
    }, [])

    return (
        <div>
            {product &&
                <div className="mb-6">
                    <h1 className="text-4xl font-semibold">
                        {product.displayName}
                    </h1>
                    <div className="text-zinc-500">
                        Product ID: {product.productId}
                    </div>

                    <div className="flex gap-6 mt-3">
                        <div className="relative flex h-[275px] overflow-hidden">
                            <ProductImage product={product} />

                            {product.salesPrice !== product.listPrice &&
                                <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">ON SALE</span>
                            }
                        </div>
                        <div>
                            <div className="mt-2 flex items-center justify-between">
                                <p>
                                    <span className="text-lg font-semibold text-zinc-900 mr-1 leading-none">{product.salesPrice}</span>
                                    {product.salesPrice !== product.listPrice &&
                                        <span className="text-zinc-900 line-through">{product.listPrice}</span>
                                    }
                                </p>
                            </div>
                            <div className="text-left mt-3">
                                <button>Add to cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

const Product = dynamic(() => Promise.resolve(Component), {
    ssr: false,
})

export default Product
