import { ProductResult } from "@relewise/client";

export class Basket {
  items: BasketItem[];

  constructor(basketItems?: BasketItem[]) {
    this.items = basketItems ?? ([] as BasketItem[]);
  }
}

export class BasketItem {
  product: ProductResult;
  quantity: number;

  constructor(product: ProductResult, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }
}
