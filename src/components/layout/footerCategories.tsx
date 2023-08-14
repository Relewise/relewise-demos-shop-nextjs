"use client";
import { ContextStore } from "@/stores/clientContextStore";
import { getCategories } from "@/util/categoryFetcher";
import { CategoryHierarchyFacetResultCategoryNode } from "@relewise/client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import FlatFooterCategories from "./flatFooterCategories";
import NestedFooterCategories from "./nestedFooterCategories";

const Component = () => {
  const [categories, setCategories] = useState<
    CategoryHierarchyFacetResultCategoryNode[]
  >([]);

  const hasChildCategories = (): boolean => {
    return (
      categories.filter(
        (category) => category.children && category.children.length > 0
      ).length > 0
    );
  };
  useEffect(() => {
    const contextStore = new ContextStore();
    getCategories(contextStore).then((result) => setCategories(result));
  }, []);

  return (
    <>
      {hasChildCategories() ? (
        <NestedFooterCategories categories={categories.slice(0, 4)} />
      ) : (
        <FlatFooterCategories categories={categories} />
      )}
    </>
  );
};
const FooterCategories = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default FooterCategories;
