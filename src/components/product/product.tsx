"use client";
import { BasketItemCountContext } from "@/app/layout";
import ProductImage from "@/components/product/productImage";
import { BasketStore } from "@/stores/basketStore";
import { ContextStore } from "@/stores/contextStore";
import { TrackingStore } from "@/stores/trackingStore";
import handleRelewiseClientError from "@/util/handleError";
import renderPrice from "@/util/price";
import { ProblemDetailsError, ProductResult, ProductSearchBuilder } from "@relewise/client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Component = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("Id") ?? "";
  const { setBasketItemCount } = useContext(BasketItemCountContext);

  const [product, setProduct] = useState<ProductResult | undefined>();

  const addProductToBasket = (product: ProductResult) => {
    const basketStore = new BasketStore();

    basketStore.addProductToBasket(product);
    setBasketItemCount(basketStore.getBasket().items.length);
  };

  useEffect(() => {
    const contextStore = new ContextStore();

    if (!contextStore.isConfigured()) {
      return;
    }

    const builder = new ProductSearchBuilder(contextStore.getDefaultSettings())
      .setSelectedProductProperties(contextStore.getProductSettings())
      .filters((fileter) => fileter.addProductIdFilter([id]));

    contextStore
      .getSearcher()
      .searchProducts(builder.build())
      .then((result) => {
        if (result?.results) {
          new TrackingStore().trackProductView(id)
          setProduct(result.results[0]);
        }
      })
      .catch((e: ProblemDetailsError) => {
        handleRelewiseClientError(e);
      });
  }, [id]);

  return (
    <div>
      {product && (
        <div className="mb-6">
          <h1 className="text-4xl font-semibold">{product.displayName}</h1>
          <div className="text-zinc-500">Product ID: {product.productId}</div>

          <div className="flex gap-6 mt-3">
            <div className="relative flex h-[275px] overflow-hidden">
              <ProductImage product={product} />

              {product.salesPrice !== product.listPrice && (
                <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
                  ON SALE
                </span>
              )}
            </div>
            <div>
              <div className="mt-2 flex items-center justify-between">
                <p>
                  <span className="text-lg font-semibold text-zinc-900 mr-1 leading-none">
                    {renderPrice(product.salesPrice)}
                  </span>
                  {product.salesPrice !== product.listPrice && (
                    <span className="text-zinc-900 line-through">
                      {renderPrice(product.listPrice)}
                    </span>
                  )}
                </p>
              </div>
              <div className="text-left mt-3">
                <button onClick={() => addProductToBasket(product)}>Add to cart</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Product = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default Product;
