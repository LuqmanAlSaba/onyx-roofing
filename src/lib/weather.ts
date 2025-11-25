export interface WeatherInfo {
    weatherId: number;
    sunrise: number;
    sunset: number;
    isRaining: boolean;
    isSnowing: boolean;
    description: string;
    temp: number;
}

export async function getWeather(): Promise<WeatherInfo> {
    try {
        const API_KEY = process.env.OPENWEATHER_API_KEY;

        if (!API_KEY) {
            console.error('OPENWEATHER_API_KEY is not set in environment variables');
            return getDefaultWeather();
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
            return getDefaultWeather();
        }

        const data = await response.json();

        // Extract only the data we need
        return {
            weatherId: data.weather?.[0]?.id || 0,
            sunrise: data.sys?.sunrise || 0,
            sunset: data.sys?.sunset || 0,
            isRaining: (data.weather?.[0]?.id >= 200 && data.weather?.[0]?.id <= 531) || false,
            isSnowing: (data.weather?.[0]?.id >= 600 && data.weather?.[0]?.id <= 622) || false,
            description: data.weather?.[0]?.description || 'clear',
            temp: data.main?.temp || 0,
        };
    } catch (error) {
        console.error('Weather API error:', error);
        return getDefaultWeather();
    }
}

function getDefaultWeather(): WeatherInfo {
    return {
        weatherId: 0,
        sunrise: 0,
        sunset: 0,
        isRaining: false,
        isSnowing: false,
        description: 'unknown',
        temp: 0,
    };
}
