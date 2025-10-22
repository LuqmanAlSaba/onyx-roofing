// src/app/api/weather/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const API_KEY = process.env.OPENWEATHER_API_KEY;

        if (!API_KEY) {
            console.error('OPENWEATHER_API_KEY is not set in environment variables');
            throw new Error('Weather API configuration error');
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=Louisville,KY,US&appid=${API_KEY}&units=imperial`,
            {
                // Cache the response for 5 minutes to avoid hitting rate limits
                next: { revalidate: 300 },
            }
        );

        if (!response.ok) {
            console.error('OpenWeatherMap API error:', response.status, response.statusText);
            throw new Error('Weather API request failed');
        }

        const data = await response.json();

        // Extract only the data we need
        const weatherInfo = {
            weatherId: data.weather?.[0]?.id || 0,
            sunrise: data.sys?.sunrise || 0,
            sunset: data.sys?.sunset || 0,
            isRaining: (data.weather?.[0]?.id >= 200 && data.weather?.[0]?.id <= 531) || false,
            description: data.weather?.[0]?.description || 'clear',
            temp: data.main?.temp || 0,
        };

        return NextResponse.json(weatherInfo, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Weather API error:', error);
        // Return default values on error
        return NextResponse.json({
            weatherId: 0,
            sunrise: 0,
            sunset: 0,
            isRaining: false,
            description: 'unknown',
            temp: 0,
        }, {
            status: 200, // Return 200 even on error to prevent client-side errors
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
        });
    }
}
