import { Recommender, Searcher, SelectedProductPropertiesSettings, Settings, UserFactory } from "@relewise/client";
import { Dataset } from "./dataset";
import { AppContext } from "./appContext";

export abstract class ContextStore {
    abstract getSelectedDataset(): Dataset;
    abstract getAppContext(): AppContext;
    abstract setAppContext(appContext: AppContext): void;

    getProductSettings(): SelectedProductPropertiesSettings {
        return {
            displayName: true,
            allData: true,
            brand: true,
            categoryPaths: true,
            pricing: true,
        } as SelectedProductPropertiesSettings
    }

    getDefaultSettings(): Settings {
        const appContext = this.getAppContext();
        if (appContext.datasets.length < 0) {
            throw new Error('Missing language or currencycode');
        }
        const dataset = this.getSelectedDataset();
        
        return {
            language: dataset.language,
            currency: dataset.currencyCode,
            displayedAtLocation: 'Relewise Demo Store',
            user: UserFactory.anonymous(),
        };
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

    setSelectedDatasetIndex(index: number) {
        const appContext = this.getAppContext();
        this.setAppContext(new AppContext(index, appContext.datasets));
    }

    deleteSelectedDataset() {
        const appContext = this.getAppContext();
        appContext.datasets.splice(appContext.selectedDatasetIndex, 1);

        this.setAppContext(new AppContext(0, appContext.datasets));
    }

    getRecomender(): Recommender {
        const selectedDataset = this.getSelectedDataset();

        return new Recommender(selectedDataset.datasetId, selectedDataset.apiKey, { serverUrl: selectedDataset.serverUrl });
    }

    getSearcher(): Searcher {
        const selectedDataset = this.getSelectedDataset();

        return new Searcher(selectedDataset.datasetId, selectedDataset.apiKey, { serverUrl: selectedDataset.serverUrl });
    }
}