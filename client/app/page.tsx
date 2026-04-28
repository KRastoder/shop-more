import Brands from "@/components/landingpage/Brands";
import NavBar from "../components/navcomponents/Navbar";
import LandingSection from "@/components/landingpage/Landing-section";

export default function Home() {
  return (
    <div className="">
      <NavBar />
      <main>
        <LandingSection />
        <Brands />
      </main>
    </div>
  );
}
