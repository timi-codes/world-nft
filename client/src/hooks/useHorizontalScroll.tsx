import { useEffect, useRef } from "react";

export function useHorizontalScroll() {
    const elRef = useRef<HTMLElement | null>(null);
    useEffect(() => {
        const el = elRef.current;
        if (el) {
            const onWheel = (e: WheelEvent) => {
                if (e.deltaY == 0) return;
                e.preventDefault();
                el.scrollBy(e.deltaY, 0);
            };
            el.addEventListener("wheel", onWheel);
            return () => el.removeEventListener("wheel", onWheel);
        }
    }, []);
    return elRef;
}
