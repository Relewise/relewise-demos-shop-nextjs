"use client";
import { BasketItemCountContext } from "@/app/layout";
import { BasketStore } from "@/stores/basketStore";
import { ContextStore } from "@/stores/contextStore";
import { Dataset } from "@/stores/dataset";
import dynamic from "next/dynamic";
import React, { useContext } from "react";

const Component = () => {
  const contextStore = new ContextStore();
  const basketStore = new BasketStore();

  const [saved, setSaved] = React.useState(false);
  const [dataset, setDataset] = React.useState<Dataset>(contextStore.getSelectedDataset());

  function saveSettings() {
    contextStore.saveDataset(dataset);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const { setBasketItemCount } = useContext(BasketItemCountContext);

  function clearBasket() {
    basketStore.clearBasket();
    setBasketItemCount(basketStore.getBasket().items.length);
  }

  return (
    <div>
      <div className="bg-white rounded p-6">
        <div className="flex items-center mb-8">
          <h1 className="text-4xl">Settings</h1>
        </div>

        {contextStore.getAppContext().datasets.length > 0 && (
          <div className="flex gap-3 items-center">
            <button
              className="bg-gray-500 text-white"
              onClick={() => {
                contextStore.addEmptyDataset();
                setDataset(contextStore.getSelectedDataset());
                clearBasket();
              }}
            >
              Add new dataset
            </button>
            <div className="flex-grow">
              <label className="text-sm block">Select dataset</label>
              <select
                value={contextStore.getAppContext().selectedDatasetIndex}
                className="mb-6"
                onChange={(e) => {
                  contextStore.setSelectedDatasetIndex(+e.target.value);
                  setDataset(contextStore.getSelectedDataset());
                  clearBasket();
                }}
              >
                {contextStore.getAppContext().datasets.map((dataset, index) => (
                  <option key={dataset.datasetId} value={index}>
                    {dataset.displayName ?? dataset.datasetId}
                  </option>
                ))}
              </select>
            </div>

            {contextStore.getAppContext().datasets.length > 1 && (
              <div>
                <button
                  className="bg-gray-500 text-white"
                  onClick={() => {
                    contextStore.deleteSelectedDataset();
                    setDataset(contextStore.getSelectedDataset());
                  }}
                >
                  Delete selected dataset
                </button>
              </div>
            )}
          </div>
        )}

        <label className="text-sm block">Name</label>
        <input
          value={dataset.displayName ?? ""}
          type="text"
          placeholder="Name"
          onChange={(e) => {
            const displayName = e.target.value;
            setDataset({
              ...dataset,
              displayName
            });
          }}
        />

        <label className="text-sm block mt-6">Dataset Id</label>
        <input
          value={dataset.datasetId ?? ""}
          type="text"
          placeholder="Dataset id"
          onChange={(e) => {
            clearBasket();
            const datasetId = e.target.value;
            setDataset({
              ...dataset,
              datasetId
            });
          }}
        />

        <label className="text-sm block mt-6">Api key</label>
        <input
          value={dataset.apiKey ?? ""}
          type="text"
          placeholder="Api key"
          onChange={(e) => {
            const apiKey = e.target.value;
            setDataset({
              ...dataset,
              apiKey
            });
          }}
        />

        <label className="text-sm block mt-6">Language</label>
        <input
          value={dataset.language ?? ""}
          type="text"
          placeholder="LanguageCode"
          onChange={(e) => {
            const language = e.target.value;
            setDataset({
              ...dataset,
              language
            });
          }}
        />

        <label className="text-sm block mt-6">Currency</label>
        <input
          value={dataset.currencyCode ?? ""}
          type="text"
          placeholder="CurrencyCode"
          onChange={(e) => {
            const currencyCode = e.target.value;
            setDataset({
              ...dataset,
              currencyCode
            });
          }}
        />

        <label className="text-sm block mt-6">Server url</label>
        <input
          value={dataset.serverUrl ?? ""}
          type="text"
          placeholder="Server url"
          onChange={(e) => {
            const serverUrl = e.target.value;
            setDataset({
              ...dataset,
              serverUrl
            });
          }}
        />

        <hr className="my-10" />

        <div>
          <button onClick={saveSettings}>Save</button>

          {saved && <span className="ml-4 text-green-600">Settings have been saved.</span>}
        </div>
      </div>
    </div>
  );
};
const DatasetForm = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default DatasetForm;
