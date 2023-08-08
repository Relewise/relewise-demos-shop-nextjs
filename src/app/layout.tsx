import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CategoryHierarchyFacetResult, CategoryHierarchyFacetResultCategoryNode, ProductSearchBuilder, UserFactory } from '@relewise/client'
import { ServerContextStore } from '@/stores/serverContextStore'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Relewise Demo Shop'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const appContext = new ServerContextStore();
  const dataset = appContext.getSelectedDataset();
  let categories: CategoryHierarchyFacetResultCategoryNode[] = [];

  if (appContext.isConfigured()) {
    const builder = new ProductSearchBuilder({
      currency: dataset.currencyCode,
      language: dataset.language,
      user: UserFactory.anonymous(),
      displayedAtLocation: "relewise demo shop"
    })
      .pagination(p => p.setPageSize(0))
      .facets(f => f.addProductCategoryHierarchyFacet('ImmediateParent', null, { displayName: true, paths: true }))

    const result = await appContext.getSearcher().searchProducts(builder.build())

    if (result && result.facets && result.facets.items) {
      const categoryFacetResult = result.facets.items[0] as CategoryHierarchyFacetResult;
      categories = categoryFacetResult.nodes
        .filter(node => node.category.displayName)
        .sort((a, b) => a.category.displayName?.localeCompare(b.category.displayName ?? "") ?? 0);
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="app">
          <Header categories={categories} />
          <div id="main-container" className="container mx-auto pt-3 pb-10 flex-grow">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
