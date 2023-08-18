import Product from "@/components/product/product";
import ProductDetailsRecomendations from "@/components/productDetailsRecomendations";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Relewise Demo Shop"
};
export default function ProductPage() {
  return (
    <>
      {/* A product page would be a good idea to render using SRR. */}
      <Product />
      <ProductDetailsRecomendations />
    </>
  );
}
