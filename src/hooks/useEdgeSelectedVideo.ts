import { useEffect, useRef, useState } from 'react';

export function useEdgeSelectedVideo(intervalMs = 5 * 60 * 1000) {
    const [src, setSrc] = useState<string | null>(null);
    const current = useRef<string | null>(null);

    useEffect(() => {
        let stop = false;

        const run = async () => {
            try {
                const r = await fetch('/api/select-video', { cache: 'no-store' });
                const { src } = (await r.json()) as { src?: string };
                if (stop || !src) return;

                if (src !== current.current) {
                    current.current = src;
                    setSrc(src); // expose it to the component

                    const v = document.querySelector<HTMLVideoElement>('#heroVideo');
                    if (v) {
                        const wasPaused = v.paused;
                        v.src = src;
                        if (!wasPaused) await v.play().catch(() => {});
                    }
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
