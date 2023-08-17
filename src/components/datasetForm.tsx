"use client";
import { BasketItemCountContext } from "@/app/layout";
import { BasketStore } from "@/stores/basketStore";
import { ContextStore } from "@/stores/contextStore";
import { Dataset } from "@/stores/dataset";
import dynamic from "next/dynamic";
import React, { useContext } from "react";

interface DatasetFormProps {
  dataset: Dataset;
  setDataset: (dataset: Dataset) => void;
  saveSettings: () => void;
}

const Component = (props: DatasetFormProps) => {
  const contextStore = new ContextStore();
  const basketStore = new BasketStore();
  const { setBasketItemCount } = useContext(BasketItemCountContext);

  function clearBasket() {
    basketStore.clearBasket();
    setBasketItemCount(basketStore.getBasket().items.length);
  }
  return (
    <div>
      <div className="flex items-center mb-8">
        <h1 className="text-4xl">Settings</h1>
      </div>

      {contextStore.getAppContext().datasets.length > 0 && (
        <div className="flex gap-3 items-center">
          <button
            className="bg-gray-500 text-white"
            onClick={() => {
              contextStore.addEmptyDataset();
              props.setDataset(contextStore.getSelectedDataset());
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
                props.setDataset(contextStore.getSelectedDataset());
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
                  props.setDataset(contextStore.getSelectedDataset());
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
        value={props.dataset.displayName ?? ""}
        type="text"
        placeholder="Name"
        onChange={(e) => {
          const displayName = e.target.value;
          props.setDataset({
            ...props.dataset,
            displayName
          });
        }}
      />

      <label className="text-sm block mt-6">Dataset Id</label>
      <input
        value={props.dataset.datasetId ?? ""}
        type="text"
        placeholder="Dataset id"
        onChange={(e) => {
          clearBasket();
          const datasetId = e.target.value;
          props.setDataset({
            ...props.dataset,
            datasetId
          });
        }}
      />

      <label className="text-sm block mt-6">Api key</label>
      <input
        value={props.dataset.apiKey ?? ""}
        type="text"
        placeholder="Api key"
        onChange={(e) => {
          const apiKey = e.target.value;
          props.setDataset({
            ...props.dataset,
            apiKey
          });
        }}
      />

      <label className="text-sm block mt-6">Language</label>
      <input
        value={props.dataset.language ?? ""}
        type="text"
        placeholder="LanguageCode"
        onChange={(e) => {
          const language = e.target.value;
          props.setDataset({
            ...props.dataset,
            language
          });
        }}
      />

      <label className="text-sm block mt-6">Currency</label>
      <input
        value={props.dataset.currencyCode ?? ""}
        type="text"
        placeholder="CurrencyCode"
        onChange={(e) => {
          const currencyCode = e.target.value;
          props.setDataset({
            ...props.dataset,
            currencyCode
          });
        }}
      />

      <label className="text-sm block mt-6">Server url</label>
      <input
        value={props.dataset.serverUrl ?? ""}
        type="text"
        placeholder="Server url"
        onChange={(e) => {
          const serverUrl = e.target.value;
          props.setDataset({
            ...props.dataset,
            serverUrl
          });
        }}
      />
    </div>
  );
};

const DatasetForm = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default DatasetForm;
