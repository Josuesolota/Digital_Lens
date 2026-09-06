import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";

/**
 * Homepage. Só o Hero e os Serviços entram no bundle inicial; tudo o que fica
 * abaixo da dobra é dividido em chunks próprios, carregados depois do conteúdo
 * crítico.
 */
const About = dynamic(() => import("@/components/sections/About").then((m) => m.About));
const StorePreview = dynamic(() =>
  import("@/components/sections/StorePreview").then((m) => m.StorePreview)
);
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
      <StorePreview />
      <Portfolio />
      <Testimonials />
      <ComingSoon />
      <Contact />
    </>
  );
}
