import {
  Recommender,
  Searcher,
  SelectedProductPropertiesSettings,
  Settings,
  Tracker
} from "@relewise/client";
import { AppContext } from "./appContext";
import { Dataset } from "./dataset";
import { toast } from "react-toastify";
import { TrackingStore } from "./trackingStore";

export class ContextStore {
  getSelectedDataset(): Dataset {
    const appContext = this.getAppContext();
    if (appContext.datasets.length < 1) {
      return new Dataset();
    }
    return appContext.datasets[appContext.selectedDatasetIndex];
  }

  getProductSettings(): SelectedProductPropertiesSettings {
    return {
      displayName: true,
      allData: true,
      brand: true,
      categoryPaths: true,
      pricing: true
    } as SelectedProductPropertiesSettings;
  }

  getDefaultSettings(): Settings {
    if (!this.isConfigured()) {
      throw new Error("Missing language or currencycode");
    }

    const tracking = new TrackingStore();
    const dataset = this.getSelectedDataset();
    return {
      language: dataset.language,
      currency: dataset.currencyCode,
      displayedAtLocation: "Relewise Demo Store",
      user: tracking.getUser()
    };
  }

  isConfigured(): boolean {
    const selectedDataset = this.getSelectedDataset();

    if (!selectedDataset.apiKey ||
        !selectedDataset.datasetId ||
        !selectedDataset.currencyCode ||
        !selectedDataset.language) {
      toast.error("Dataset not correctly configured", {
        toastId: "is-not-configured"
      });
      return false;
    }

    return true;
  }

  getRecommender(): Recommender {
    const selectedDataset = this.getSelectedDataset();

    return new Recommender(selectedDataset.datasetId, selectedDataset.apiKey, {
      serverUrl: selectedDataset.serverUrl
    });
  }

  getSearcher(): Searcher {
    const selectedDataset = this.getSelectedDataset();

    return new Searcher(selectedDataset.datasetId, selectedDataset.apiKey, {
      serverUrl: selectedDataset.serverUrl
    });
  }

  getTracker(): Tracker {
    const selectedDataset = this.getSelectedDataset();

    return new Tracker(selectedDataset.datasetId, selectedDataset.apiKey, {
      serverUrl: selectedDataset.serverUrl
    });
  }

  getAppContext(): AppContext {
    const storage = localStorage.getItem("nextjs-shopContext")?.toString();

    if (storage) {
      const appContextFromCookie: AppContext = JSON.parse(storage);
      return appContextFromCookie;
    }

    const newAppContext = new AppContext(0, []);

    return newAppContext;
  }

  setAppContext(appContext: AppContext) {
    localStorage.setItem("nextjs-shopContext", JSON.stringify(appContext));
  }

  saveDataset(dataset: Dataset) {
    const appContext = this.getAppContext();
    appContext.datasets[appContext.selectedDatasetIndex] = dataset;
    this.setAppContext(new AppContext(appContext.selectedDatasetIndex, appContext.datasets));
  }

  addEmptyDataset() {
    const appContext = this.getAppContext();
    const newDataset = new Dataset();
    appContext.datasets.push(newDataset);

    this.setAppContext(new AppContext(appContext.datasets.length - 1, appContext.datasets));
  }

  addNewDataset(dataset: Dataset) {
    const appContext = this.getAppContext();

    const existingDatasetsWithSameId = appContext.datasets.find(
      (d) => d.datasetId == dataset.datasetId
    );

    if (existingDatasetsWithSameId) {
      this.setSelectedDatasetIndex(appContext.datasets.indexOf(existingDatasetsWithSameId));
      return;
    }

    appContext.datasets.push(dataset);
    this.setAppContext(new AppContext(appContext.datasets.length - 1, appContext.datasets));
  }

  setSelectedDatasetIndex(index: number) {
    const appContext = this.getAppContext();
    this.setAppContext(new AppContext(index, appContext.datasets));
  }

  deleteSelectedDataset() {
    const appContext = this.getAppContext();
    appContext.datasets.splice(appContext.selectedDatasetIndex, 1);

    this.setAppContext(new AppContext(0, appContext.datasets));
  }
}
