"use client";
import { ContextStore } from "@/stores/clientContextStore";
import { getCategories } from "@/util/categoryFetcher";
import { CategoryHierarchyFacetResultCategoryNode } from "@relewise/client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import FlatHeaderCategories from "./flatHeaderCategories";
import NestedHeaderCategories from "./nestedHeaderCategories";

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
  const contextStore = new ContextStore();

  useEffect(() => {
    getCategories(contextStore).then((result) => setCategories(result));
  }, []);

  return (
    <>
      {hasChildCategories() ? (
        <NestedHeaderCategories categories={categories} />
      ) : (
        <FlatHeaderCategories categories={categories} />
      )}
    </>
  );
};
const HeaderCategories = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default HeaderCategories;
