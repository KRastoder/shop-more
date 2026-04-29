import Brands from "@/components/landingpage/Brands";
import NavBar from "../components/navcomponents/Navbar";
import LandingSection from "@/components/landingpage/Landing-section";
import NewArrivalsSection from "@/components/landingpage/NewArrivalsSection";

export default function Home() {
  return (
    <div>
      <NavBar />
      <main>
        <LandingSection />
        <Brands />
        <NewArrivalsSection />
      </main>
    </div>
  );
}
