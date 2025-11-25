import { getSelectedVideo } from "@/lib/video-selection";
import HomeClient from "@/app/components/HomeClient";
import { headers } from "next/headers";

export default async function Home() {
  // Server-side video selection - no API call needed!
  const initialVideo = await getSelectedVideo();

  // Detect mobile devices to use image instead of video
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // Convert video path to image path for mobile
  const getImagePathFromVideo = (videoPath: string) => {
    const filename = videoPath.split('/').pop()?.replace('.mp4', '.webp');
    return `/images/hero/${filename}`;
  };

  return (
    <>
      {/* Preload hero media for faster LCP */}
      {isMobile ? (
        // Mobile: Preload optimized WebP image (38-90KB vs 2.4-5.2MB video)
        <link rel="preload" as="image" href={getImagePathFromVideo(initialVideo)} type="image/webp" />
      ) : (
        // Desktop: Preload video for animated background
        <link rel="preload" as="video" href={initialVideo} type="video/mp4" />
      )}
      <HomeClient initialVideo={initialVideo} />
    </>
  );
}
