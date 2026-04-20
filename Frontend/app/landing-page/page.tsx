import Header from "@/components/landing-page/Header";
import Hero from "@/components/landing-page/Hero";
import FeatureStrip from "@/components/landing-page/FeatureStrip";
import Challenges from "@/components/landing-page/Challanges";
import SolutionRow from "@/components/landing-page/SolutionRows";
import HowItWorks from "@/components/landing-page/HowItWorks";
import Testimonials from "@/components/landing-page/Testsimonials";
import Cta from "@/components/landing-page/Cta";
import Footer from "@/components/landing-page/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main style={{ background: "linear-gradient(180deg, #fff9d6 0%, #fffbef 18%, #fffdf8 35%, #fff9e0 52%, #fffbef 68%, #fff9d6 84%, #fffdf8 100%)" }}>
        <Hero />
        <FeatureStrip />
        <Challenges />
        <SolutionRow />
        <HowItWorks />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
