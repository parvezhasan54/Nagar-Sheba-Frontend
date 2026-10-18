import type { ReactNode } from "react";
import { ChatAssistantLoader } from "@/components/ai/ChatAssistantLoader";
import Footer from "@/components/layout/homepage/Footer";
import Navbar from "@/components/layout/homepage/Navbar";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <Navbar />
      <div id="main" className="flex-1">
        {children}
      </div>
      <Footer />
      <ChatAssistantLoader />
    </div>
  );
}
