import Product from "@/components/product";
import ProductDetailsRecomendations from "@/components/productDetailsRecomendations";

export default async function ProductPage({ params }: { params: { id: string } }) {
  return (
    <>
      {/* A product page would be a good idea to render using SRR. */}
      <Product productId={params.id} />
      <ProductDetailsRecomendations productId={params.id} />
    </>
  )
}
