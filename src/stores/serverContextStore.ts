import { Searcher, SelectedProductPropertiesSettings } from "@relewise/client";
import { cookies } from 'next/headers';
import { AppContext } from "./appContext";
import { Dataset } from "./dataset";
import { ContextStore } from "./contextStore";

export class ServerContextStore extends ContextStore {

    setAppContext(appContext: AppContext): void {
        cookies().set("shopContext", JSON.stringify(appContext))
    }

    getSelectedDataset(): Dataset {
        const appContext = this.getAppContext();
        if (appContext.datasets.length < 1) {
            return new Dataset();
        }
        return appContext.datasets[appContext.selectedDatasetIndex];
    }

    getAppContext(): AppContext {
        const cookiesStore = cookies()
        const cookie = cookiesStore.get("shopContext")?.value

        if (cookie) {
            const appContextFromCookie: AppContext = JSON.parse(cookie);
            return appContextFromCookie;
        }

        const newAppContext = new AppContext(0, []);

        return newAppContext;
    }
}

