import ProductImage from "@/components/product/productImage";
import ProductDetailsRecomendations from "@/components/productDetailsRecomendations";
import { ServerContextStore } from "@/stores/serverContextStore";
import { ProductSearchBuilder } from "@relewise/client";

export default async function Product({ params }: { params: { id: string } }) {
  const contextStore = new ServerContextStore();
  const builder = new ProductSearchBuilder(contextStore.getDefaultSettings())
    .setSelectedProductProperties(contextStore.getProductSettings())
    .filters(fileter => fileter.addProductIdFilter([params.id]))

  const result = await contextStore.getSearcher().searchProducts(builder.build());
  const product = result?.results![0] ?? undefined

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

      <ProductDetailsRecomendations productId={params.id} />
    </div >
  )
}
