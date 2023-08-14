export class Dataset {
  datasetId: string;
  apiKey: string;
  language: string;
  currencyCode: string;
  displayName?: string;
  serverUrl?: string;

  constructor(
    datasetId?: string,
    apiKey?: string,
    language?: string,
    currencyCode?: string,
    displayName?: string,
    serverUrl?: string
  ) {
    this.datasetId = datasetId ?? "";
    this.displayName = displayName;
    this.apiKey = apiKey ?? "";
    this.language = language ?? "";
    this.currencyCode = currencyCode ?? "";
    this.serverUrl = serverUrl;
  }
}
