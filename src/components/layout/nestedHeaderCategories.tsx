"use client";
import { CategoryHierarchyFacetResultCategoryNode } from "@relewise/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import ConfigureDemoSettingsButton from "../configureDemoSettingsButton";
import { basePath } from "@/util/basePath";

interface NestedHeaderCategoriesProps {
  categories: CategoryHierarchyFacetResultCategoryNode[];
}

const Component = (props: NestedHeaderCategoriesProps) => {
  const [hoveredCategory, setHoveredCategory] = React.useState<
    CategoryHierarchyFacetResultCategoryNode | undefined
  >();

  const onMouseEnter = (category: CategoryHierarchyFacetResultCategoryNode) =>
    setHoveredCategory(category);
  const onMouseLeave = () => setHoveredCategory(undefined);

  return (
    <div className="bg-white">
      <div className="container mx-auto">
        <ul className="flex gap-2">
          <ul className="flex scrollable-element">
            {props.categories.map((category, index) => (
              <div
                key={index}
                onMouseEnter={() => onMouseEnter(category)}
                onMouseLeave={onMouseLeave}
              >
                <li className="inline-flex relative pr-5">
                  <a
                    href={`${basePath}/category?CategoryIds=${category.category.categoryId}`}
                    className="font-semibold uppercase py-3 leading-none text-lg text-zinc-700 whitespace-nowrap hover:text-blue-500 transitions ease-in-out delay-150 cursor-pointer"
                  >
                    {category.category.displayName}
                  </a>
                </li>
              </div>
            ))}
          </ul>
          <li className="flex-grow"></li>
          <li className="inline-flex items-center">
            <ConfigureDemoSettingsButton />
          </li>
        </ul>
      </div>

      {hoveredCategory?.children && hoveredCategory.children.length > 0 && (
        <div
          className="absolute z-10 w-full"
          onMouseEnter={() => onMouseEnter(hoveredCategory)}
          onMouseLeave={onMouseLeave}
        >
          <div className=" bg-white">
            <div className="container mx-auto">
              <div className="overflow-x-auto">
                <ul className="text-base z-10 max-h-96 list-none grid grid-cols-4 p-2">
                  {hoveredCategory.children.map((child, index) => (
                    <a
                      key={index}
                      href={`${basePath}/category?CategoryIds=${hoveredCategory.category.categoryId},${child.category.categoryId}`}
                      className="text-gray-700 block px-2 py-1 rounded cursor-pointer hover:bg-gray-100"
                    >
                      {child.category.displayName}
                    </a>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="h-32 bg-gradient-to-b from-white to-transparent" />
        </div>
      )}
    </div>
  );
};
const NestedHeaderCategories = dynamic(() => Promise.resolve(Component), {
  ssr: false
});

export default NestedHeaderCategories;
