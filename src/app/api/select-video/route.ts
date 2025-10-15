export const runtime = 'edge';

const LOU_TZ = 'America/Kentucky/Louisville';

function chooseVideo(hour: number, month: number) {
    if (month === 9) return '/videos/house-halloween.mp4'; // October
    if (hour >= 21 || hour < 6) return '/videos/house-night.mp4';
    if (hour >= 19) return '/videos/house-sunset.mp4';
    if (hour >= 12) return '/videos/house-afternoon.mp4';
    return '/videos/house-morning.mp4';
}

export async function GET() {
    const now = new Date();
    const hour = Number(new Intl.DateTimeFormat('en-US', {
        hour: 'numeric', hour12: false, timeZone: LOU_TZ
    }).format(now));

    const src = chooseVideo(hour, now.getMonth());
    return new Response(JSON.stringify({ src }), {
        headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
    });
}
