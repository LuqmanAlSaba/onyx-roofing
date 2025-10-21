import { useEffect, useRef, useState } from 'react';

export function useEdgeSelectedVideo(initialSrc: string, intervalMs = 5 * 60 * 1000) {
    const [src, setSrc] = useState<string>(initialSrc);
    const current = useRef<string>(initialSrc);

    useEffect(() => {
        let stop = false;

        const run = async () => {
            try {
                const r = await fetch('/api/select-video', { cache: 'no-store' });
                const { src } = (await r.json()) as { src?: string };
                if (stop || !src) return;

                if (src !== current.current) {
                    current.current = src;
                    setSrc(src);
                }
            } catch {
                // silent fail
            }
        };

        run();
        const id = setInterval(run, intervalMs);
        return () => {
            stop = true;
            clearInterval(id);
        };
    }, [intervalMs]);

    return src;
}
