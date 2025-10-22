"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import AddressAutofill with graceful degradation
const AddressAutofill = dynamic(
    () => import("@mapbox/search-js-react").then(m => m.AddressAutofill),
    {
        ssr: false,
        loading: () => null, // Show regular input while loading
    }
);

type MapboxRetrieveResponse = {
    features?: Array<{
        properties?: {
            full_address?: string;
            name?: string;
            place_name?: string;
        };
    }>;
};

type AddressInputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddressSelect?: (address: string) => void;
    error?: boolean;
    errorMessage?: string;
    controls?: ReturnType<typeof useAnimationControls>;
};

export default function AddressInput({
    value,
    onChange,
    onAddressSelect,
    error = false,
    errorMessage,
    controls,
}: AddressInputProps) {
    const [mapboxToken, setMapboxToken] = useState<string | null>(null);
    const [mapboxError, setMapboxError] = useState(false);

    useEffect(() => {
        // Check if Mapbox token is available
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (token) {
            setMapboxToken(token);
        } else {
            console.warn("Mapbox token not found, using fallback address input");
            setMapboxError(true);
        }
    }, []);

    const handleRetrieve = (res: MapboxRetrieveResponse) => {
        try {
            const feature = res.features?.[0];
            const props = feature && "properties" in feature
                ? (feature as { properties?: Record<string, unknown> }).properties
                : undefined;

            const fullAddress =
                (props?.["full_address"] as string | undefined) ??
                (props?.["name"] as string | undefined) ??
                (props?.["place_name"] as string | undefined);

            if (fullAddress && onAddressSelect) {
                onAddressSelect(fullAddress);
            }
        } catch (err) {
            console.warn("Error processing Mapbox response:", err);
            // Gracefully degrade - user can still type address manually
        }
    };

    const inputClassName = `w-full px-3 py-2 bg-[#3a3f45] border ${
        error ? "border-red-500" : "border-[#4a4f55]"
    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`;

    const inputElement = (
        <input
            type="text"
            name="serviceAddress"
            placeholder="Enter your address..."
            value={value}
            onChange={onChange}
            autoComplete="address-line1"
            className={inputClassName}
            aria-invalid={error}
        />
    );

    return (
        <motion.div animate={controls}>
            <label className="block text-xs font-medium text-gray-300 mb-1">
                Service Address
            </label>
            {mapboxToken && !mapboxError ? (
                <AddressAutofill
                    accessToken={mapboxToken}
                    options={{
                        country: 'US',
                        limit: 2,
                        // Optional: bias toward Louisville
                        // proximity: [-85.7585, 38.2527],
                    }}
                    onRetrieve={handleRetrieve}
                >
                    {inputElement}
                </AddressAutofill>
            ) : (
                inputElement
            )}
            <div className="h-1">
                {error && errorMessage && (
                    <p className="text-xs text-red-400">{errorMessage}</p>
                )}
            </div>
        </motion.div>
    );
}
