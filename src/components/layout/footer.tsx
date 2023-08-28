import Image from "next/image";
import FooterCategories from "./footerCategories";
import { basePath } from "@/util/basePath";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="container px-6 py-12 mx-auto">
        <FooterCategories />
        <hr className="my-6 border-zinc-200 md:my-5" />
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <a href="https://relewise.com/contact-us/">
            <Image
              alt="relewise logo"
              src={`${basePath}/logo.svg`}
              className="h-14"
              width={376}
              height={56}
            />
          </a>

          <p className="mt-4 text-sm text-zinc-500 sm:mt-0">
            © Copyright {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
