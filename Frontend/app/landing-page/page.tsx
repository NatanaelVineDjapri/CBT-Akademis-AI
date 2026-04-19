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
      <main>
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
