"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import SearchOverlay from "./searchOverlay";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentInput = searchParams.get("Term") ?? "";
  const [input, setInput] = React.useState(currentInput);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    router.push(pathname + "?" + createQueryString("Term", input));
  }, [createQueryString, input, pathname, router]);

  return (
    <div className="inline-flex overflow-hidden rounded-full w-full max-w-2xl border-1 border-white focus:border-zinc-100 relative">
      <input
        type="text"
        placeholder="Search..."
        className="!rounded-none focus:!border-zinc-100 focus:!ring-0"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <button className="bg-zinc-300 rounded-none px-3">
        <MagnifyingGlassIcon className="h-6 w-6 text-zinc-600" />
      </button>
      <SearchOverlay input={currentInput} setInput={(i) => setInput(i)} />
    </div>
  );
}
