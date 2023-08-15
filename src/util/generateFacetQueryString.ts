import { ReadonlyURLSearchParams } from "next/navigation";
import getFacetsByType from "./getFacetsByType";

export default function generateFacetQueryString(
  searchParams: ReadonlyURLSearchParams,
  selectedFacets: Record<string, string[]>,
  minPrice?: number,
  maxPrice?: number
): URLSearchParams {
  const params = new URLSearchParams(searchParams.toString());
  const categoryFacets = getFacetsByType(selectedFacets, "Category");
  const brandFacets = getFacetsByType(selectedFacets, "Brand");

  if (categoryFacets) {
    params.set("Category", categoryFacets.toString());
  } else {
    params.delete("Category");
  }

  if (brandFacets) {
    params.set("Brand", brandFacets.toString());
  } else {
    params.delete("Brand");
  }

  if (minPrice) {
    params.set("MinPrice", minPrice.toString());
  } else {
    params.delete("MinPrice");
  }

  if (maxPrice) {
    params.set("MaxPrice", maxPrice.toString());
  } else {
    params.delete("MaxPrice");
  }
  return params;
}
