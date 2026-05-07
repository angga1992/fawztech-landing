import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Services from "./components/Services";
import Stats from "./components/Stats";
import Solutions from "./components/Solutions";
import Process from "./components/Process";
import Clients from "./components/Clients";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main className="relative">
        <Hero />
        <Marquee />
        <Services />
        <Stats />
        <Solutions />
        <Process />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
