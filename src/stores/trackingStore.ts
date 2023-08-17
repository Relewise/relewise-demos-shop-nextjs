import { User, UserFactory } from "@relewise/client";
import { Tracking } from "./tracking";
import { ContextStore } from "./contextStore";
import { Basket } from "./basket";
import { it } from "node:test";

export class TrackingStore {
  setTracking(tracking: Tracking) {
    localStorage.setItem("nextjs-tracking", JSON.stringify(tracking));
  }

  getTracking(): Tracking {
    const storage = localStorage.getItem("nextjs-tracking")?.toString();

    if (!storage) {
      return new Tracking();
    }

    const trackingFromStorage: Tracking = JSON.parse(storage);
    return trackingFromStorage;
  }

  getUser(): User {
    const tracking = this.getTracking();

    return tracking.enabled
      ? UserFactory.byTemporaryId(tracking.temporaryId)
      : UserFactory.anonymous();
  }

  trackProductView(productId: string) {
    if (!this.getTracking().enabled) return;

    const tracker = new ContextStore().getTracker();
    tracker.trackProductView({
      productId: productId,
      user: this.getUser()
    });
  }

  trackCategoryView(categoryIds: string[]) {
    if (!this.getTracking().enabled) return;

    const tracker = new ContextStore().getTracker();
    tracker.trackProductCategoryView({
      idPath: categoryIds,
      user: this.getUser()
    });
  }

  trackCart(basket: Basket) {
    if (!this.getTracking().enabled) return;

    const contextStore = new ContextStore();

    const lineItems = basket.items
      .filter((item) => item.product.productId)
      .map((item) => {
        return {
          lineTotal: item.product.salesPrice ? item.product.salesPrice * item.quantity : 0,
          productId: item.product.productId!,
          quantity: item.quantity
        };
      });

    if (lineItems.length < 1) return;

    const subtotal = lineItems.reduce((total, i) => total + i.lineTotal, 0);
    const tracker = contextStore.getTracker();
    tracker.trackCart({
      lineItems: lineItems,
      subtotal: {
        amount: subtotal,
        currency: contextStore.getSelectedDataset().currencyCode
      }
    });
  }

  trackOrder(basket: Basket) {
    if (!this.getTracking().enabled) return;

    const contextStore = new ContextStore();

    const lineItems = this.mapToLineItems(basket);

    if (lineItems.length < 1) return;

    const subtotal = lineItems.reduce((total, i) => total + i.lineTotal, 0);
    const tracker = contextStore.getTracker();

    tracker.trackOrder({
      lineItems: lineItems,
      subtotal: {
        amount: subtotal,
        currency: contextStore.getSelectedDataset().currencyCode
      },
      orderNumber: crypto.randomUUID(),
      user: this.getUser()
    });
  }

  trackSearchTerm(term: string) {
    if (!this.getTracking().enabled) return;

    const contextStore = new ContextStore();

    const tracker = contextStore.getTracker();
    tracker.trackSearchTerm({
      term: term,
      language: contextStore.getSelectedDataset().language,
      user: this.getUser()
    });
  }

  private mapToLineItems(basket: Basket) {
    const lineItems = basket.items
      .filter((item) => item.product.productId)
      .map((item) => {
        return {
          lineTotal: item.product.salesPrice ? item.product.salesPrice * item.quantity : 0,
          productId: item.product.productId!,
          quantity: item.quantity
        };
      });

    return lineItems;
  }
}
