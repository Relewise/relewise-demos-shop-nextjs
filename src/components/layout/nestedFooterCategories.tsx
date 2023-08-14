import { basePath } from "@/util/basePath";
import { CategoryHierarchyFacetResultCategoryNode } from "@relewise/client";

interface NestedFooterCategoriesProps {
  categories: CategoryHierarchyFacetResultCategoryNode[];
}
export default function NestedFooterCategories(
  props: NestedFooterCategoriesProps
) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {props.categories.map((category, index) => (
        <div key={index}>
          <h3 className="text-lg font-medium text-zinc-800">
            {category.category.displayName}
          </h3>
          {category.children?.map((child, index) => (
            <div
              key={index}
              className="flex flex-col items-start mt-2 space-y-4"
            >
              <a
                href={`${basePath}/category/${category.category.categoryId}/${child.category.categoryId}`}
                className="text-zinc-700 transition-colors duration-200 hover:underline hover:text-brand-500"
              >
                {child.category.displayName}
              </a>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
