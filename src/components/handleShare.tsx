"use client";
import { ContextStore } from "@/stores/clientContextStore";
import { Dataset } from "@/stores/dataset";
import { useRouter, useSearchParams } from "next/navigation";

export default function HandleShare() {
  const searchParams = useSearchParams();
  const share = searchParams.get("share");
  const router = useRouter();

  if (!share) {
    return <></>;
  }

  const contextStore = new ContextStore();
  const parsedFromUrl = atob(share);

  const dataset = JSON.parse(parsedFromUrl) as Dataset;
  contextStore.addNewDataset(dataset);

  router.push("");
  return <></>;
}
