// src/app/api/weather/route.ts

import { NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather';

export async function GET() {
    const weatherInfo = await getWeather();

    return NextResponse.json(weatherInfo, {
        headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
    });
}
