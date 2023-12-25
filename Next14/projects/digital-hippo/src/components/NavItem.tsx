// @flow
import { PRODUCT_CATEGORIES } from "@/config";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Button } from "./ui/button";

type Category = typeof PRODUCT_CATEGORIES[number];

interface NavItemProps {
  category: Category;
  handleOpen: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
}

const NavItem = ({ category, isOpen, isAnyOpen, handleOpen }: NavItemProps) => {
  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Button
          className="gap-1.5"
          onClick={handleOpen}
          variant={isOpen ? "secondary" : "ghost"}
        >
          {category.label}
          <ChevronDownIcon
            className={cn("h-4 w-4 transition-all text-muted-foreground", {
              "-rotate-180": isOpen,
            })}
          />
        </Button>
      </div>

      {
        // Dropdown
        isOpen ? (
          <div
            className={cn(
              "absolute inset-x-0 text-sm top-full text-muted-foreground",
              {
                "animate-in fade-in-10 slide-in-from-top-5": !isAnyOpen,
              }
            )}
          >
            <div
              className="absolute inset-0 top-1/2 bg-white shadow"
              aria-hidden="true"
            >
              <div className="relative bg-white">
                <div className="ax-auto max-w-7xl px-8">
                  <div className="grid grid-cols-3 gap-x-8 gap-y-10 py-16">
                    <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8">
                      {category.featured.map((item) => (
                        <div
                          key={item.name}
                          className="group relative text-base sm:text-sm"
                        >
                          <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src={item.imageSrc}
                              alt="product category image"
                              fill
                              className="obejct-cover object-center"
                            />
                          </div>

                          {/*   Links */}
                          <Link
                            href={item.href}
                            className="mt-6 block font-medium text-gray-900"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1" aria-hidden="true">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  );
};

export default NavItem;