"use client";
import { useContext } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { BasketItemCountContext } from "@/app/layout";
import { basePath } from "@/util/basePath";

export default function CartButton() {
  const { basketItemCount } = useContext(BasketItemCountContext);

  return (
    <>
      <a
        href={`${basePath}"/cart"`}
        className="relative rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-zinc-200"
      >
        <ShoppingBagIcon className="h-8 w-8" />
        {basketItemCount > 0 && (
          <span className="absolute top-0 right-0 leading-none inline-flex items-center justify-center -mr- h-4 w-4 pb-0.5 bg-blue-500 rounded-full text-white text-[11px]">
            {basketItemCount}
          </span>
        )}
      </a>
    </>
  );
}
