"use client";
import { ContextStore } from "@/stores/contextStore";
import { Dataset } from "@/stores/dataset";
import { useSearchParams } from "next/navigation";

export default function HandleShareLink() {
  const searchParams = useSearchParams();
  const shareLinkParam = searchParams.get("share");

  if (shareLinkParam) {
    const contextStore = new ContextStore();
    const parsedFromUrl = atob(shareLinkParam);

    const dataset = JSON.parse(parsedFromUrl) as Dataset;
    contextStore.addNewDataset(dataset);
  }

  return <></>;
}
