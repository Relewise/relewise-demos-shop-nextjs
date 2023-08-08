import CategoryComponent from "@/components/category";

export default async function CategoryPage({ params }: { params: { id: string[] } }) {
    return (
        <CategoryComponent categoryIds={params.id}/>
    )
}
