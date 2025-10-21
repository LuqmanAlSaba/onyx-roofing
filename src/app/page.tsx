import { getSelectedVideo } from "@/lib/video-selection";
import HomeClient from "@/app/components/HomeClient";

export default function Home() {
  // Server-side video selection - no API call needed!
  const initialVideo = getSelectedVideo();

  return (
    <>
      {/* Preload the hero video for faster LCP */}
      <link rel="preload" as="video" href={initialVideo} type="video/mp4" />
      <HomeClient initialVideo={initialVideo} />
    </>
  );
}
