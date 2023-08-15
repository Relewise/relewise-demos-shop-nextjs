import { ProductResult } from "@relewise/client";
import { Basket, BasketItem } from "./basket";

export class BasketStore {
  setBasket(basket: Basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
  }

  getBasket(): Basket {
    const cookie = localStorage.getItem("basket")?.toString();

    if (!cookie) {
      return new Basket();
    }
    const basketFromCookie: Basket = JSON.parse(cookie);
    return basketFromCookie;
  }

  addProductToBasket(product: ProductResult) {
    const basket = this.getBasket();

    const itemAlreadyInBasket = basket.items.find((i) => i.product.productId === product.productId);

    if (itemAlreadyInBasket) {
      basket.items.map((item) => {
        if (item.product.productId === product.productId) {
          item.quantity = item.quantity + 1;
        }
        return item as BasketItem;
      });

      this.setBasket(basket);
      return;
    }

    basket.items.push(new BasketItem(product, 1));
    this.setBasket(basket);
  }
}
