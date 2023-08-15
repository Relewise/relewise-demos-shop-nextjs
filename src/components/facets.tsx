"use client";
import { PriceRangeFacetResult, ProductFacetResult } from "@relewise/client";
import "next-range-slider/dist/main.css";
import dynamic from "next/dynamic";
import CheckListFacet from "./checkListFacet";
import PriceRangeFacet from "./priceRangeFacet";
import getFacetsByType from "@/util/getFacetsByType";

interface FacetsProps {
  selectedFacets: Record<string, string[]>;
  facets: ProductFacetResult;
  setSelectedFacets(selectedFacets: Record<string, string[]>): void;
  setMinPrice(price: number): void;
  setMaxPrice(price: number): void;
  minPrice: number | undefined;
  maxPrice: number | undefined;
}

const Component = (props: FacetsProps) => {
  function setFacet(type: string, value: string) {
    const currentSelectFacetValues = getFacetsByType(
      props.selectedFacets,
      type
    );
    const valueAlreadySelected =
      (currentSelectFacetValues?.find((v) => v === value)?.length ?? 0) > 0;

    if (valueAlreadySelected) {
      const newSelectFacets = { ...props.selectedFacets };
      const indexToRemove = newSelectFacets[type].indexOf(value);
      newSelectFacets[type].splice(indexToRemove, 1);
      props.setSelectedFacets(newSelectFacets);
      return;
    }

    const newSelectFacets = { ...props.selectedFacets };
    newSelectFacets[type].push(value);
    props.setSelectedFacets(newSelectFacets);
  }

  return (
    <div>
      {props.facets.items?.map((facet, index) => (
        <div key={index}>
          {(facet.field == "Category" || "Brand") && (
            <CheckListFacet facet={facet} setFacet={setFacet} />
          )}
          {facet.field == "SalesPrice" && (
            <PriceRangeFacet
              facet={facet as PriceRangeFacetResult}
              maxPrice={props.maxPrice}
              minPrice={props.minPrice}
              setMaxPrice={props.setMaxPrice}
              setMinPrice={props.setMinPrice}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const Facets = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default Facets;
