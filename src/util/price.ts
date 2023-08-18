import { ContextStore } from "@/stores/contextStore";

export default function renderPrice(price: string | number | null | undefined) {
  if (!price) {
    return "";
  }

  const dataset = new ContextStore().getSelectedDataset();
  try {
    return new Intl.NumberFormat(dataset.language, {
      style: "currency",
      currency: dataset.currencyCode
    }).format(Number(price));
  } catch {
    console.warn(`Could not format price using the currency: '${dataset.currencyCode}'`);
    return price;
  }
}
