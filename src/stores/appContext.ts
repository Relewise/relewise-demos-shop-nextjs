import { Dataset } from "./dataset";

export class AppContext {
  selectedDatasetIndex: number;
  datasets: Dataset[];

  constructor(selectedDatasetIndex: number, datasets: Dataset[]) {
    this.selectedDatasetIndex = selectedDatasetIndex;
    this.datasets = datasets;
  }
}
