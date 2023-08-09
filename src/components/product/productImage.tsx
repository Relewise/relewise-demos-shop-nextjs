import { PhotoIcon } from "@heroicons/react/24/outline"
import { DataValue, ProductResult } from "@relewise/client"
import Image from "next/image";

interface ProductImageProps {
    product: ProductResult
}

export default function ProductImage(props: ProductImageProps) {
    function mapDataKey(data: Record<string, DataValue>) {
        for (const dataKey of Object.keys(data ?? {})) {

            if (dataKey.toLowerCase().includes('image')) {
                const value = data[dataKey];

                if (value.type === 'String') {
                    return value.value;
                } else if (value.type === 'StringList') {
                    return value.value.$values[0];
                }
            }
        }

        return null;
    }


    const image = (() => {
        return mapDataKey(props.product.data ?? {}) ??
            mapDataKey(props.product.variant?.data ?? {}) ??
            '';
    });


    return (
        <>
            {image() ?
                <Image unoptimized className="object-cover h-full w-full" src={image()} alt="product image" width={0} height={0} /> :
                <PhotoIcon className="h-full w-full text-zinc-300" />}
        </>

    )
}
