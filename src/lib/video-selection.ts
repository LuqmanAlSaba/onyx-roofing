import { getWeather } from './weather';

const LOU_TZ = 'America/Kentucky/Louisville';

export function chooseVideo(hour: number, month: number, day: number, isSnowing: boolean = false): string {
    if (isSnowing) return '/videos/house-snowy.mp4';

    // Month is 1-indexed (1=Jan, ..., 10=Oct, 11=Nov, 12=Dec)
    if (month === 10) return '/videos/house-halloween.mp4'; // October

    const isWinterHoliday = (month === 11 && day >= 25) || month === 12; // Nov 25 - Dec 31

    if (hour >= 21 || hour < 6) return '/videos/house-night.mp4';

    if (isWinterHoliday) return '/videos/house-snowy.mp4';

    if (hour >= 19) return '/videos/house-sunset.mp4';
    if (hour >= 12) return '/videos/house-afternoon.mp4';
    return '/videos/house-morning.mp4';
}

export async function getSelectedVideo(): Promise<string> {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour12: false,
        timeZone: LOU_TZ
    });

    const parts = formatter.formatToParts(now);
    const getPart = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(p => p.type === type)?.value || 0);

    const hour = getPart('hour');
    const month = getPart('month'); // 1-12
    const day = getPart('day');

    const weather = await getWeather();

    return chooseVideo(hour, month, day, weather.isSnowing);
}
