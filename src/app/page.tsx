import { getSelectedVideo } from "@/lib/video-selection";
import HomeClient from "@/app/components/HomeClient";
import { headers } from "next/headers";

export default async function Home() {
  // Server-side video selection - no API call needed!
  const initialVideo = getSelectedVideo();

  // Detect mobile devices to avoid preloading video on mobile (save bandwidth)
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  return (
    <>
      {/* Preload the hero video for faster LCP - but only on desktop to save mobile bandwidth */}
      {!isMobile && <link rel="preload" as="video" href={initialVideo} type="video/mp4" />}
      <HomeClient initialVideo={initialVideo} />
    </>
  );
}
