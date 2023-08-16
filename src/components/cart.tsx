"use client";
import { BasketItemCountContext } from "@/app/layout";
import { Basket, BasketItem } from "@/stores/basket";
import { BasketStore } from "@/stores/basketStore";
import { ProductResult } from "@relewise/client";
import dynamic from "next/dynamic";
import { useContext, useState } from "react";

const Component = () => {
  const basketStore = new BasketStore();
  const initialBasket = basketStore.getBasket();

  const { setBasketItemCount } = useContext(BasketItemCountContext);
  const [basket, setBasket] = useState<Basket>(initialBasket);

  function updateBasket(product: ProductResult, quantity: number) {
    basketStore.updateProductInBasket(product, quantity);
    const newBasket = basketStore.getBasket();
    setBasketItemCount(newBasket.items.length);
    setBasket(newBasket);
  }

  return (
    <div>
      <h1 className="mb-3 text-4xl font-semibold">Cart</h1>
      {basket.items.length < 1 && <div v-if="isEmpty">Cart is empty</div>}
      <div className="justify-center px-6 md:flex md:space-x-6 xl:px-0">
        <div className="rounded md:w-2/3">
          {basket.items.map((item, index) => (
            <div
              key={index}
              className="justify-between mb-3 rounded bg-white p-3 sm:flex sm:justify-start"
            >
              {/* <ProductImage product={item.product} /> */}
              <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                <div className="mt-5 sm:mt-0">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.product.displayName}
                  </h2>
                  <p className="mt-1 text-gray-500">{item.product.brand?.displayName}</p>
                </div>
                <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                  <div className="flex items-center justify-end border-gray-100">
                    <span
                      className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-brand-500 hover:text-brand-50"
                      onClick={() => updateBasket(item.product, item.quantity - 1)}
                    >
                      -
                    </span>
                    <input
                      disabled
                      value={item.quantity}
                      className="h-8 w-8 border bg-white text-center text-xs outline-none"
                      type="number"
                      min="1"
                      onChange={() => {}}
                    />
                    <span
                      className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-brand-500 hover:text-brand-50"
                      onClick={() => updateBasket(item.product, item.quantity + 1)}
                    >
                      +
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p>
                      <span className="text-lg text-zinc-900 mr-1 leading-none">
                        {item.product.salesPrice}
                      </span>
                      {item.product.salesPrice !== item.product.listPrice && (
                        <span
                          v-if="item.product.salesPrice !== item.product.listPrice"
                          className="text-zinc-900 line-through"
                        >
                          {item.product.listPrice}
                        </span>
                      )}
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                      onClick={() => updateBasket(item.product, 0)}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 h-full rounded bg-white p-6 md:mt-0 md:w-1/3">
          <div className="flex justify-between">
            <p className="text-lg font-bold">Total</p>
            <div>
              <p className="mb-1 text-lg font-bold">{0}</p>
              <p className="text-sm text-gray-700">including VAT</p>
            </div>
          </div>
          <button>Check out</button>
        </div>
      </div>
    </div>
  );
};

const Cart = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default Cart;
function userState(basket: Basket): [any, any] {
  throw new Error("Function not implemented.");
}
