"use client";
import { ContextStore } from "@/stores/clientContextStore";
import {
  ProductResult,
  ProductsRecommendationCollectionBuilder,
  ProductsViewedAfterViewingProductBuilder,
  PurchasedWithProductBuilder
} from "@relewise/client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import ProductGrid from "./product/productGrid";

const Component = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("Id") ?? "";
  const contextStore = new ContextStore();

  const [purchasedWithProduct, setPurchasedWithProduct] = React.useState<
    ProductResult[] | null | undefined
  >();
  const [productsViewedAfterViewing, setProductsViewedAfterViewing] =
    React.useState<ProductResult[] | null | undefined>();

  useEffect(() => {
    if (!contextStore.isConfigured()) {
      return;
    }
    const puchasedWithProductBuilder = new PurchasedWithProductBuilder(
      contextStore.getDefaultSettings()
    )
      .setSelectedProductProperties(contextStore.getProductSettings())
      .setNumberOfRecommendations(5)
      .product({ productId: id });

    const productsViewedAfterViewing =
      new ProductsViewedAfterViewingProductBuilder(
        contextStore.getDefaultSettings()
      )
        .setSelectedProductProperties(contextStore.getProductSettings())
        .setNumberOfRecommendations(5)
        .product({ productId: id });

    const productRecommendationsBuilder =
      new ProductsRecommendationCollectionBuilder()
        .addRequest(puchasedWithProductBuilder.build())
        .addRequest(productsViewedAfterViewing.build());

    contextStore
      .getRecomender()
      .batchProductRecommendations(productRecommendationsBuilder.build())
      .then((result) => {
        if (result && result.responses) {
          setPurchasedWithProduct(result.responses[0].recommendations);
          setProductsViewedAfterViewing(result.responses[1].recommendations);
        }
      });
  }, []);

  if (!contextStore.isConfigured()) {
    return <> </>;
  }

  return (
    <>
      <ProductGrid
        title="Purchased with"
        products={purchasedWithProduct ?? []}
      />
      <ProductGrid
        title="Products viewed after viewing"
        products={productsViewedAfterViewing ?? []}
      />
    </>
  );
};

const ProductDetailsRecomendations = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default ProductDetailsRecomendations;
