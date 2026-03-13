"use client"
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ScrollRestoration = () => {
  const pathname = usePathname();

  useEffect(() => {
    const scrollY = window.history.state?.scrollY ?? 0;

    const timeout = setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 50);

    if (typeof window === "undefined"){
      return;
    } 

    const handleScroll = () => {
      window.history.replaceState(
        {
          ...window.history.state,
          scrollY: window.scrollY,
        },
        ""
      );
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return null;
}

export default ScrollRestoration;