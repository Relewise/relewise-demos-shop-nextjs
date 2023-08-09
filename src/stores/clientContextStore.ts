import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { AppContext } from "./appContext";
import { ContextStore } from "./contextStore";
import { Dataset } from "./dataset";

export class ClientContextStore extends ContextStore {
    router = useRouter();

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
        this.router.refresh();
    }

    saveDataset(dataset: Dataset) {
        const appContext = this.getAppContext();
        appContext.datasets[appContext.selectedDatasetIndex] = dataset;
        this.setAppContext(new AppContext(appContext.selectedDatasetIndex, appContext.datasets));
        this.router.refresh();
    }

    addEmptyDataset() {
        const appContext = this.getAppContext();
        const newDataset = new Dataset();
        appContext.datasets.push(newDataset);

        this.setAppContext(new AppContext(appContext.datasets.length - 1, appContext.datasets));
        this.router.refresh();
    }

    setSelectedDatasetIndex(index: number) {
        const appContext = this.getAppContext();
        this.setAppContext(new AppContext(index, appContext.datasets));
        this.router.refresh();
    }

    deleteSelectedDataset() {
        const appContext = this.getAppContext();
        appContext.datasets.splice(appContext.selectedDatasetIndex, 1);

        this.setAppContext(new AppContext(0, appContext.datasets));
        this.router.refresh();
    }
}

