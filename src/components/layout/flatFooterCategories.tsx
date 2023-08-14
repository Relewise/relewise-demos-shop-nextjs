import { basePath } from "@/util/basePath";
import { CategoryHierarchyFacetResultCategoryNode } from "@relewise/client";

interface FlatFooterCategoriesProps {
  categories: CategoryHierarchyFacetResultCategoryNode[];
}
export default function FlatFooterCategories(props: FlatFooterCategoriesProps) {
  return (
    <div>
      <h3 className="font-medium text-zinc-800 text-xl mb-2">Categories</h3>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {props.categories.map((category, index) => (
          <div key={index} className="flex flex-col items-start mt-2 space-y-4">
            <a
              href={`${basePath}/category/${category.category.categoryId}`}
              className="text-zinc-700 transition-colors duration-200 hover:underline hover:text-brand-500"
            >
              {category.category.displayName}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
