"use client";
import { ContextStore } from "@/stores/contextStore";
import { getCategories } from "@/util/categoryFetcher";
import { CategoryHierarchyFacetResultCategoryNode, ProblemDetailsError } from "@relewise/client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import FlatHeaderCategories from "./flatHeaderCategories";
import NestedHeaderCategories from "./nestedHeaderCategories";
import handleRelewiseClientError from "@/util/handleError";

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
    getCategories(contextStore)
    .then((result) => setCategories(result))
    .catch((e: ProblemDetailsError) => handleRelewiseClientError(e));
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
