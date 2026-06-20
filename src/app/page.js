import Banner from "@/components/Home_Compo/Banner";
import EngineCompatibility from "@/components/Home_Compo/EngineCompatibility";
import FeaturedPrompts from "@/components/Home_Compo/Featuredprompts";
import PromptEngineeringEssentials from "@/components/Home_Compo/Promptengineeringessentials";
import Testimonials from "@/components/Home_Compo/Testimonials";
import TopCreators from "@/components/Home_Compo/Topcreators";
import WhyChooseUs from "@/components/Home_Compo/WhyChooseUs";


export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedPrompts />
      <WhyChooseUs />
      <PromptEngineeringEssentials />
      <TopCreators />
      <EngineCompatibility />
      <Testimonials />
    </div>
  );
}
