import { Recommender, Searcher, SelectedProductPropertiesSettings, Settings, UserFactory } from "@relewise/client";
import { Dataset } from "./dataset";
import { AppContext } from "./appContext";

export abstract class ContextStore {
    abstract getAppContext(): AppContext;
    abstract setAppContext(appContext: AppContext): void;

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
            pricing: true,
        } as SelectedProductPropertiesSettings
    }

    getDefaultSettings(): Settings {
        if (!this.isConfigured()) {
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

    isConfigured(): boolean {
        const appContext = this.getAppContext();
        return appContext.datasets.length > 0;
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