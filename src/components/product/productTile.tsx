import { ProductResult } from "@relewise/client";
import Link from 'next/link';
import ProductImage from './productImage';
interface ProductTileProps {
    product: ProductResult
}

export default function ProductTile(props: ProductTileProps) {
    return (
        <Link href={`/product/${props.product.productId}`} className="relative rounded flex flex-col overflow-hidden py-3 bg-white hover:bg-brand-50 transition duration-200">
            <div className="relative mx-3 flex h-[275px] overflow-hidden justify-center">
                <ProductImage product={props.product} />
                {props.product.salesPrice !== props.product.salesPrice &&
                    <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">ON SALE</span>
                }
            </div>
            <div className="mt-3 px-3">
                <div className="text-left">
                    {props.product.brand &&
                        <span className="text-sm text-zinc-500">{props.product.brand?.displayName}</span>
                    }
                    <h5 className="tracking-tight text-zinc-900 font-semibold leading-tight h-10">
                        {props.product.displayName}
                    </h5>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p>
                        <span className="text-lg font-semibold text-zinc-900 mr-1 leading-none">{props.product.salesPrice}</span>
                        {props.product.salesPrice !== props.product.salesPrice &&
                            <span className="text-zinc-900 line-through">{props.product.listPrice}</span>
                        }
                    </p>
                </div>
            </div>
        </Link>
    )
}
