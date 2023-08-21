"use client";
import { ContextStore } from "@/stores/contextStore";
import { Dataset } from "@/stores/dataset";
import { useState } from "react";
import DatasetForm from "./datasetForm";
import TrackingForm from "./trackingForm";
import { TrackingStore } from "@/stores/trackingStore";
import { Tracking } from "@/stores/tracking";

export default function AppSettings() {
  const contextStore = new ContextStore();
  const trackingStore = new TrackingStore();

  const [saved, setSaved] = useState(false);
  const [dataset, setDataset] = useState<Dataset>(contextStore.getSelectedDataset());
  const [tracking, setTracking] = useState<Tracking>(trackingStore.getTracking());

  function saveSettings() {
    contextStore.saveDataset(dataset);
    trackingStore.setTracking(tracking);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div className="bg-white rounded p-6">
        <DatasetForm dataset={dataset} saveSettings={saveSettings} setDataset={setDataset} />
        <hr className="my-10" />
        <TrackingForm tracking={tracking} setTracking={setTracking} />
        <hr className="my-10" />
        <div>
          <button onClick={saveSettings}>Save</button>
          {saved && <span className="ml-4 text-green-600">Settings have been saved.</span>}
        </div>
      </div>
    </div>
  );
}
