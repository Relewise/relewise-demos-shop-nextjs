"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { BasketStore } from "@/stores/basketStore";
import { Inter } from "next/font/google";
import { createContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const BasketItemCountContext = createContext({
  basketItemCount: 0,
  setBasketItemCount: (itemCount: number) => {}
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [basketItemCount, setBasketItemCount] = useState(0);
  const value = { basketItemCount, setBasketItemCount };

  useEffect(() => {
    const basketStore = new BasketStore();
    setBasketItemCount(basketStore.getBasket().items.length);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="app">
          <BasketItemCountContext.Provider value={value}>
            <Header />
            <div id="search"></div>
            <div id="main-container" className="container mx-auto pt-3 pb-10 flex-grow">
              {children}
            </div>
            <Footer />
          </BasketItemCountContext.Provider>
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
