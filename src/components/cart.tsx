"use client";
import { BasketStore } from "@/stores/basketStore";
import dynamic from "next/dynamic";

const Component = () => {
  const basketStore = new BasketStore();
  const basket = basketStore.getBasket();

  console.log(basket);

  return (
    <div>
      {basket.items.map((item, index) => (
        <div key={index}>
          <div>productId: {item.product.productId}</div>
          <div>quantity: {item.quantity}</div>
          <hr></hr>
        </div>
      ))}
    </div>
  );
};

const Cart = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default Cart;
