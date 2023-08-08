import { Recommender, Searcher, SelectedProductPropertiesSettings } from "@relewise/client";
import { getCookie, setCookie } from "cookies-next";
import { AppContext } from "./appContext";
import { Dataset } from "./dataset";
import { ContextStore } from "./contextStore";

export class ClientContextStore extends ContextStore {
    getSelectedDataset(): Dataset {
        const appContext = this.getAppContext();
        if (appContext.datasets.length < 1) {
            return new Dataset();
        }
        return appContext.datasets[appContext.selectedDatasetIndex];
    }

    getAppContext(): AppContext {
        const cookie = getCookie("shopContext")?.toString();

        if (cookie) {
            const appContextFromCookie: AppContext = JSON.parse(cookie);
            return appContextFromCookie;
        }

        const newAppContext = new AppContext(0, []);

        return newAppContext;
    }

    setAppContext(appContext: AppContext) {
        setCookie("shopContext", JSON.stringify(appContext))
    }
}

