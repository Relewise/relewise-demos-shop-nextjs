import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { CategoryHierarchyFacetResultCategoryNode } from "@relewise/client";
import Link from "next/link";
import FlatHeaderCategories from "./flatHeaderCategories";
import NestedHeaderCategories from './nestedHeaderCategories';

interface HeaderProps {
    categories: CategoryHierarchyFacetResultCategoryNode[]
    hasChildCategories: boolean
}

export default function Header(props: HeaderProps) {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto">
                <div className="flex gap-10 py-2">
                    <div className="flex items-center">
                        <Link href="/" className="font-semibold text-2xl uppercase text-black leading-normal block hover:opacity-70 transitions ease-in-out delay-150">
                            Relewise <span className="text-white bg-zinc-900 rounded-sm px-1">demo</span> shop
                        </Link>
                    </div>

                    <div className="flex items-center flex-grow">
                        {/* <SearchOverlay/> */}
                    </div>

                    <div className="flex items-center">
                        <Link href="/cart" className="relative rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-zinc-200">
                            <ShoppingBagIcon className="h-8 w-8" />
                            <span
                                className="absolute top-0 right-0 leading-none inline-flex items-center justify-center -mr- h-4 w-4 pb-0.5 bg-blue-500 rounded-full text-white text-[11px]">
                                {/* LINE ITEM COUNT */}
                                0
                            </span>
                        </Link>
                    </div>
                </div>

            </div >
            {props.hasChildCategories ?
                <NestedHeaderCategories categories={props.categories} />
                :
                <FlatHeaderCategories categories={props.categories} />
            }


        </header >
    );
}