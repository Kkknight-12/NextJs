import { RefObject, useEffect } from "react";

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const element = ref?.current;

      // do nothing if clicking ref's element or descendent elements
      if (!element || element.contains(event.target as Node) || null) {
        return;
      }

      // call handler if clicked outside
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };

    // reload only if ref or handler changes
  }, [ref, handler]);
};