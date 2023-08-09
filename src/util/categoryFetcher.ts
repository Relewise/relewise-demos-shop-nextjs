import { ClientContextStore } from "@/stores/clientContextStore";
import { CategoryHierarchyFacetResult, CategoryHierarchyFacetResultCategoryNode, ProductSearchBuilder } from "@relewise/client";

export async function getCategories(appContext: ClientContextStore): Promise<CategoryHierarchyFacetResultCategoryNode[]> {

    if (!appContext.isConfigured()) {
        return [];
    }

    const builder = new ProductSearchBuilder(appContext.getDefaultSettings())
        .pagination(p => p.setPageSize(0))
        .facets(f => f.addProductCategoryHierarchyFacet('ImmediateParent', null, { displayName: true }))

    return appContext.getSearcher().searchProducts(builder.build()).then(response => {
        if (!response?.facets?.items) {
            return [];
        }
        const categoryFacetResult = response.facets.items[0] as CategoryHierarchyFacetResult;
        return categoryFacetResult.nodes
            .filter(node => node.category.displayName)
            .sort((a, b) => a.category.displayName?.localeCompare(b.category.displayName ?? "") ?? 0);
    })
}