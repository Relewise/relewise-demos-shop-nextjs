import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { ClientContextStore } from '@/stores/clientContextStore'
import { CategoryHierarchyFacetResult, CategoryHierarchyFacetResultCategoryNode, ProductSearchBuilder } from '@relewise/client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Relewise Demo Shop'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="app">
          <Header />
          <div id="main-container" className="container mx-auto pt-3 pb-10 flex-grow">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
