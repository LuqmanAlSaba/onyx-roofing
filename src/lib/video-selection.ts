const LOU_TZ = 'America/Kentucky/Louisville';

export function chooseVideo(hour: number, month: number): string {
    if (month === 9) return '/videos/house-halloween.mp4'; // October
    if (hour >= 21 || hour < 6) return '/videos/house-night.mp4';
    if (hour >= 19) return '/videos/house-sunset.mp4';
    if (hour >= 12) return '/videos/house-afternoon.mp4';
    return '/videos/house-morning.mp4';
}

export function getSelectedVideo(): string {
    const now = new Date();
    const hour = Number(new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: LOU_TZ
    }).format(now));

    return chooseVideo(hour, now.getMonth());
}
