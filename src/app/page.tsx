import PopularBrands from "@/components/popularBrands";
import PopularProducts from "@/components/popularProducts";

export default function Home() {
  return (
    <main>
      <div className="flex justify-center">
        <div className="mb-10 bg-white p-6 rounded">
          <h1 className="text-3xl font-semibold mb-5">
            Welcome to the Relewise Demo Shop
          </h1>

          <p className="pb-2">
            Discover a wide range of offerings with our search and discovery
            tools, and take advantage of personalized product recommendations.
            Our platform provides a powerful search experience and intelligent
            recommendations to help you find exactly what you&apos;re looking
            for. With our advanced technology, exploring and discovering new
            products has never been easier.
          </p>

          <p>
            Relewise is an intelligent personalization platform that provides
            customized and relevant online experiences, designed to empower both
            developers and marketers. Our advanced search and recommendation
            algorithms ensure that you always find what you&apos;re looking for,
            and discover products you&apos;ll love.
          </p>
        </div>
      </div>
      <PopularProducts />
      <PopularBrands />
    </main>
  );
}
