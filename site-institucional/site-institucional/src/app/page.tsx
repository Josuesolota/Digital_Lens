import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";

// Abaixo da dobra: divididos em chunks próprios, carregados após o conteúdo
// crítico (Hero/Serviços) — reduz o JS necessário para o primeiro paint.
const Portfolio = dynamic(() =>
  import("@/components/sections/Portfolio").then((m) => m.Portfolio)
);
const Testimonials = dynamic(() =>
  import("@/components/sections/Testimonials").then((m) => m.Testimonials)
);
const ComingSoon = dynamic(() =>
  import("@/components/sections/ComingSoon").then((m) => m.ComingSoon)
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((m) => m.Contact)
);

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <Testimonials />
      <ComingSoon />
      <Contact />
    </>
  );
}
