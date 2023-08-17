import Cart from "@/components/cart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relewise Demo Shop - Cart"
};

export default function CartPage() {
  return <Cart />;
}
