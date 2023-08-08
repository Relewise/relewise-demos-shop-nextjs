'use client'
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { CategoryHierarchyFacetResultCategoryNode } from "@relewise/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import ConfigureDemoSettingsButton from '../configureDemoSettingsButton';

interface FlatHeaderCategoriesProps {
    categories: CategoryHierarchyFacetResultCategoryNode[]
}

const Component = (props: FlatHeaderCategoriesProps) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

    return (
        <div className="bg-white">
            <div className="container mx-auto">
                <ul className="flex gap-2">
                    <ul className="flex scrollable-element">
                        {props.categories.length > 0 &&
                            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                                <div className="font-semibold uppercase py-3 leading-none text-lg text-zinc-700 whitespace-nowrap hover:text-blue-500 transitions ease-in-out delay-150 cursor-pointer">
                                    Categories
                                </div>
                            </div>
                        }
                    </ul>
                    <li className="flex-grow"></li>
                    <li className="inline-flex items-center">
                        <ConfigureDemoSettingsButton />
                    </li>
                </ul >
            </div>

            {isHovered &&
                <div className="absolute z-10 w-full" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <div className=" bg-white">
                        <div className="container mx-auto">
                            <div className="overflow-x-auto">
                                <ul className="text-base z-10 max-h-96 list-none grid grid-cols-4 p-2">
                                    {props.categories.map(category => (
                                        <Link href={`/category/${category.category.categoryId}`} className="text-gray-700 block px-2 py-1 rounded cursor-pointer hover:bg-gray-100">
                                            {category.category.displayName}
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="h-32 bg-gradient-to-b from-white to-transparent" />
                </div>
            }
        </div>
    )
}
const FlatHeaderCategories = dynamic(() => Promise.resolve(Component), {
    ssr: false,
})

export default FlatHeaderCategories