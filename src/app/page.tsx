import { getSelectedVideo } from "@/lib/video-selection";
import HomeClient from "@/app/components/HomeClient";

export default function Home() {
  // Server-side video selection - no API call needed!
  const initialVideo = getSelectedVideo();

  return <HomeClient initialVideo={initialVideo} />;
}
