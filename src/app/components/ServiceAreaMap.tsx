// app/ServiceAreaMap.tsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl, { Map, LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type Place = { name: string; lng: number; lat: number };

const DEFAULT_PLACES: Place[] = [
    { name: "Louisville",       lng: -85.7585, lat: 38.2527 },
    { name: "St. Matthews",     lng: -85.6400, lat: 38.2526 },
    { name: "Prospect",         lng: -85.6150, lat: 38.3451 },
    { name: "Jeffersontown",    lng: -85.5644, lat: 38.1940 },
    { name: "Middletown",       lng: -85.5380, lat: 38.2456 },
    { name: "The Highlands",    lng: -85.7140, lat: 38.2367 },
    { name: "Shively",          lng: -85.8225, lat: 38.2003 },
    { name: "Anchorage",        lng: -85.5330, lat: 38.2667 },
    { name: "New Albany, IN",   lng: -85.8241, lat: 38.2856 },
    { name: "Clarksville, IN",  lng: -85.7597, lat: 38.2967 },
];

const SRC_ID = "service-places";
const LAY_GLOW = "places-glow";
const LAY_DOT  = "places-dot";
const LAY_TEXT = "places-label";

export default function ServiceAreaMap({
                                           places = DEFAULT_PLACES,
                                           interactive = true,
                                           className = "h-[420px] md:h-[450px]",
                                           center = [-85.736, 38.26] as LngLatLike,
                                       }: {
    places?: Place[];
    interactive?: boolean;
    className?: string;
    center?: LngLatLike;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const roRef = useRef<ResizeObserver | null>(null);

    const makeGeoJSON = (pts: Place[]) =>
        ({
            type: "FeatureCollection",
            features: pts.map((p) => ({
                type: "Feature",
                properties: { name: p.name },
                geometry: { type: "Point", coordinates: [p.lng, p.lat] as [number, number] },
            })),
        } as GeoJSON.FeatureCollection);

    const fitToPlaces = (map: mapboxgl.Map, pts: Place[], fallback: LngLatLike) => {
        if (pts.length > 1) {
            const b = new mapboxgl.LngLatBounds();
            pts.forEach((p) => b.extend([p.lng, p.lat]));
            map.fitBounds(b, { padding: 80, duration: 600, maxZoom: 11 });
        } else {
            map.setCenter(fallback);
        }
    };

    // init map once
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = new mapboxgl.Map({
            container: containerRef.current,
            style: "mapbox://styles/mapbox/dark-v11",
            center,
            zoom: 9.4,
            interactive,
            attributionControl: false,
            pitch: 0,
            bearing: 0,
        });
        mapRef.current = map;

        map.once("load", () => {
            // source
            if (!map.getSource(SRC_ID)) {
                map.addSource(SRC_ID, {
                    type: "geojson",
                    data: makeGeoJSON(places),
                });
            }

            // glow
            if (!map.getLayer(LAY_GLOW)) {
                map.addLayer({
                    id: LAY_GLOW,
                    type: "circle",
                    source: SRC_ID,
                    paint: {
                        "circle-radius": 10,
                        "circle-color": "#40d6d1",
                        "circle-blur": 0.6,
                        "circle-opacity": 0.8,
                    },
                });
            }

            // dot
            if (!map.getLayer(LAY_DOT)) {
                map.addLayer({
                    id: LAY_DOT,
                    type: "circle",
                    source: SRC_ID,
                    paint: {
                        "circle-radius": 6,
                        "circle-color": "#40d6d1",
                        "circle-stroke-color": "#40d6d1",
                        "circle-stroke-width": 1,
                    },
                });
            }

            // labels
            if (!map.getLayer(LAY_TEXT)) {
                map.addLayer({
                    id: LAY_TEXT,
                    type: "symbol",
                    source: SRC_ID,
                    layout: {
                        "text-field": ["get", "name"],
                        "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
                        "text-size": 12,
                        "text-offset": [1.1, -0.8],
                        "text-anchor": "left",
                    },
                    paint: {
                        "text-color": "#e9fdfa",
                        "text-halo-color": "#000",
                        "text-halo-width": 0.6,
                        "text-halo-blur": 0.6,
                    },
                });
            }

            fitToPlaces(map, places, center);
        });

        // keep tiles crisp on container resize
        const ro = new ResizeObserver(() => {
            map.resize();
        });
        ro.observe(containerRef.current);
        roRef.current = ro;

        return () => {
            ro.disconnect();
            if (map.getLayer(LAY_TEXT)) map.removeLayer(LAY_TEXT);
            if (map.getLayer(LAY_DOT)) map.removeLayer(LAY_DOT);
            if (map.getLayer(LAY_GLOW)) map.removeLayer(LAY_GLOW);
            if (map.getSource(SRC_ID)) map.removeSource(SRC_ID);
            map.remove();
            mapRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // once

    // update data & fit on prop changes
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        const src = map.getSource(SRC_ID) as mapboxgl.GeoJSONSource | undefined;
        if (src) src.setData(makeGeoJSON(places));
        fitToPlaces(map, places, center);
    }, [places, center]);

    // toggle interactivity when prop flips
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const enable = () => {
            map.scrollZoom.enable();
            map.boxZoom.enable();
            map.dragRotate.enable();
            map.dragPan.enable();
            map.keyboard.enable();
            map.doubleClickZoom.enable();
            map.touchZoomRotate.enable();
        };
        const disable = () => {
            map.scrollZoom.disable();
            map.boxZoom.disable();
            map.dragRotate.disable();
            map.dragPan.disable();
            map.keyboard.disable();
            map.doubleClickZoom.disable();
            map.touchZoomRotate.disable();
        };

        if (interactive) {
            enable();
        } else {
            disable();
        }
    }, [interactive]);

    return (
        <div className={`relative w-full overflow-hidden rounded-2xl ${className}`}>
            {/* map */}
            <div
                ref={containerRef}
                className="w-full h-full border border-white/5 bg-[#0f1410]"
                aria-label="Map showing Onyx Roofing service area around Louisville"
            />
            {/* soft top/bottom vignettes */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0f141099] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0f141099] to-transparent" />
        </div>
    );
}
