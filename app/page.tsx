import { HomePage } from "@/components/hero/home";
import { HeroHeader } from "@/components/hero/navbar";

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <HeroHeader />
      <HomePage/>
    </div>
  );
}
