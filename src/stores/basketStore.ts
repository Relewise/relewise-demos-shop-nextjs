import { ProductResult } from "@relewise/client";
import { Basket, BasketItem } from "./basket";
import { TrackingStore } from "./trackingStore";

export class BasketStore {
  private setBasket(basket: Basket) {
    new TrackingStore().trackCart(basket);
    localStorage.setItem("nextjs-basket", JSON.stringify(basket));
  }

  getBasket(): Basket {
    const storage = localStorage.getItem("nextjs-basket")?.toString();

    if (!storage) {
      return new Basket();
    }
    const basketFromStorage: Basket = JSON.parse(storage);
    return basketFromStorage;
  }

  addProductToBasket(product: ProductResult) {
    const basket = this.getBasket();

    const itemAlreadyInBasket = basket.items.find((i) => i.product.productId === product.productId);

    if (itemAlreadyInBasket) {
      itemAlreadyInBasket.quantity = itemAlreadyInBasket.quantity + 1;

      this.setBasket(basket);
      return;
    }

    basket.items.push(new BasketItem(product, 1));
    this.setBasket(basket);
  }

  updateProductInBasket(product: ProductResult, quantity: number) {
    const basket = this.getBasket();

    if (quantity < 1) {
      this.removeProductFromBasket(product);
      return;
    }

    const itemAlreadyInBasket = basket.items.find((i) => i.product.productId === product.productId);
    if (!itemAlreadyInBasket) {
      return;
    }

    itemAlreadyInBasket.product = product;
    itemAlreadyInBasket.quantity = quantity;

    this.setBasket(basket);
  }

  removeProductFromBasket(product: ProductResult) {
    const basket = this.getBasket();

    const itemInBasket = basket.items.find((i) => i.product.productId === product.productId);
    if (!itemInBasket) {
      return;
    }

    basket.items.splice(basket.items.indexOf(itemInBasket), 1);

    this.setBasket(basket);
  }

  clearBasket() {
    this.setBasket(new Basket());
  }
}
