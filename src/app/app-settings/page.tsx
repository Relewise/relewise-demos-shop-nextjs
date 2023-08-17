import AppSettings from "@/components/appSettings";
import DatasetForm from "@/components/datasetForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relewise Demo Shop - Settigns"
};

export default function AppSettingsPage() {
  return <AppSettings />;
}
