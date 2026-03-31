"use client"
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const ScrollRestoration = () => {
  const pathname = usePathname();
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    // Reset navigation flag on location change
    isNavigatingRef.current = true;

    // Restore scroll position after navigation
    let scrollY = window.history.state?.scrollY ?? 0;

    const restoreScroll = () => {
      window.scrollTo(0, scrollY);
      // Navigation is complete after scroll restoration
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);
    };

    // Small delay to ensure page is rendered
    const timer = setTimeout(restoreScroll, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      // Don't update history during navigation
      if (isNavigatingRef.current) return;

      // Clear any pending update
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Debounce scroll updates to reduce history state changes
      scrollTimeoutRef.current = setTimeout(() => {
        // Only update if we're not in the middle of navigation
        if (!isNavigatingRef.current) {
          window.history.replaceState(
            {
              ...window.history.state,
              scrollY: window.scrollY
            },
            ""
          );
        }
      }, 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [pathname]);

  return null;
};

export default ScrollRestoration;