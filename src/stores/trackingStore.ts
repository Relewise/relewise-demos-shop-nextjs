import { Tracking } from "./tracking";

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
}
