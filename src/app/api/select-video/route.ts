import { getSelectedVideo } from '@/lib/video-selection';

export const runtime = 'edge';

export async function GET() {
    const src = getSelectedVideo();
    return new Response(JSON.stringify({ src }), {
        headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
    });
}
