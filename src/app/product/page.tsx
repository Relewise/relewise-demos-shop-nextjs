import Product from "@/components/product";
import ProductDetailsRecomendations from "@/components/productDetailsRecomendations";

export default function ProductPage() {
  return (
    <>
      {/* A product page would be a good idea to render using SRR. */}
      <Product />
      <ProductDetailsRecomendations />
    </>
  );
}
