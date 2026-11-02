import HeroSlider from "@/components/home/HeroSlider";
import QuickSearch from "@/components/home/QuickSearch";
import Marquee from "@/components/home/Marquee";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import CategoryGrid from "@/components/home/CategoryGrid";
import HowItWorks from "@/components/home/HowItWorks";
import HostGuarantee from "@/components/home/HostGuarantee";

// Featured studios refresh from the API at most once a minute.
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <HeroSlider />
      <QuickSearch />
      <Marquee />
      <FeaturedStudios />
      <CategoryGrid />
      <HowItWorks />
      <HostGuarantee />
    </>
  );
}
