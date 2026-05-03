import Brands from "@/components/landingpage/Brands";
import LandingSection from "@/components/landingpage/Landing-section";
import NewArrivalsSection from "@/components/landingpage/NewArrivalsSection";

export default function Home() {
  return (
    <main>
      <LandingSection />
      <Brands />
      <NewArrivalsSection />
    </main>
  );
}
