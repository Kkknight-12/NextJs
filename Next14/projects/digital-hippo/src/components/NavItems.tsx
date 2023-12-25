"use client";
import NavItem from "@/components/NavItem";
import { PRODUCT_CATEGORIES } from "@/config";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import * as React from "react";

type Props = {};
const NavItems = (props: Props) => {
  const [activeIndex, setActiveIndex] = React.useState<null | number>(null);

  const isAnyOpen = activeIndex !== null;
  const navRef = React.useRef<HTMLDivElement | null>(null);

  useOnClickOutside(navRef, () => setActiveIndex(null));

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="flex gap-4 h-full" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, index) => {
        const handleOpen = () => {
          if (activeIndex === index) {
            setActiveIndex(null);
          } else {
            setActiveIndex(index);
          }
        };

        const isOpen = activeIndex === index;
        const props = { category, isOpen, isAnyOpen, handleOpen };

        return <NavItem key={category.value} {...props} />;
      })}
    </div>
  );
};

export default NavItems;