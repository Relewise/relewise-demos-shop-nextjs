import CategoryComponent from "@/components/category";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relewise Demo Shop"
};

export default function CategoryPage() {
  return <CategoryComponent />;
}
