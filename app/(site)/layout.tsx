import "./site.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Backdrop from "@/components/backdrop";
import CursorRing from "@/components/cursor";
import Reveal from "@/components/reveal";
import AssistantLoader from "@/components/assistant/loader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Backdrop />
      <div className="relative z-10">
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </div>
      <CursorRing />
      <Reveal />
      <AssistantLoader />
    </div>
  );
}
