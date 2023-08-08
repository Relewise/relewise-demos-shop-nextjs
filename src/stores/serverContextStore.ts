import { Searcher, SelectedProductPropertiesSettings } from "@relewise/client";
import { cookies } from 'next/headers';
import { AppContext } from "./appContext";
import { Dataset } from "./dataset";

export class ServerContextStore {

    getSelectedDataset(): Dataset {
        const appContext = this.getAppContext();
        if (appContext.datasets.length < 1) {
            return new Dataset();
        }
        return appContext.datasets[appContext.selectedDatasetIndex];
    }

    private getAppContext(): AppContext {
        const cookiesStore = cookies()
        const cookie = cookiesStore.get("shopContext")?.value

        if (cookie) {
            const appContextFromCookie: AppContext = JSON.parse(cookie);
            return appContextFromCookie;
        }

        const newAppContext = new AppContext(0, []);

        return newAppContext;
    }

    getSearcher(): Searcher {
        const selectedDataset = this.getSelectedDataset();

        return new Searcher(selectedDataset.datasetId, selectedDataset.apiKey, { serverUrl: selectedDataset.serverUrl });
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
}

