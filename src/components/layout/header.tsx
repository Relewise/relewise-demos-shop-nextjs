import { basePath } from "@/util/basePath";
import HandleShareLink from "../handleShareLink";
import SearchBar from "../searchBar";
import CartButton from "./cartButton";
import HeaderCategories from "./headerCategories";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <HandleShareLink />
      <div className="container mx-auto">
        <div className="flex gap-10 py-2">
          <div className="flex items-center">
            <a
              href={`${basePath}/`}
              className="font-semibold text-2xl uppercase text-black leading-normal block hover:opacity-70 transitions ease-in-out delay-150"
            >
              Relewise
              <span className="text-white bg-zinc-900 rounded-sm px-1">demo</span>
              shop
            </a>
          </div>

          <div className="flex items-center flex-grow">
            <SearchBar />
          </div>

          <div className="flex items-center">
            <CartButton />
          </div>
        </div>
      </div>
      <HeaderCategories />
    </header>
  );
}
