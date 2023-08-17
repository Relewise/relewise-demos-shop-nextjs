import { ProductResult } from "@relewise/client";
import { Basket, BasketItem } from "./basket";

export class BasketStore {
  private setBasket(basket: Basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
  }

  getBasket(): Basket {
    const localStorageBasket = localStorage.getItem("basket")?.toString();

    if (!localStorageBasket) {
      return new Basket();
    }
    const basketFromStorage: Basket = JSON.parse(localStorageBasket);
    return basketFromStorage;
  }

  addProductToBasket(product: ProductResult) {
    const basket = this.getBasket();

    const itemAlreadyInBasket = basket.items.find((i) => i.product.productId === product.productId);

    if (itemAlreadyInBasket) {
      var index = basket.items.indexOf(itemAlreadyInBasket);

      basket.items[index].quantity = basket.items[index].quantity + 1;

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

    var index = basket.items.indexOf(itemAlreadyInBasket);

    basket.items[index].product = product;
    basket.items[index].quantity = quantity;

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
