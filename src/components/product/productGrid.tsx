import { ProductResult } from "@relewise/client";
import ProductTile from "./productTile";

interface ProductGridProps {
  title: string;
  products: ProductResult[];
}

export default function ProductGrid(props: ProductGridProps) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-3">{props.title}</h2>
      <div className="grid gap-3 grid-cols-5 mt-3">
        {props.products.map((product, index) => (
          <ProductTile key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
