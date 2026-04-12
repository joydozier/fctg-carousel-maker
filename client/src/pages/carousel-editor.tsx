import { useState } from "react";
import { useCarouselStore } from "@/lib/carousel-store";
import { LeftSidebar } from "@/components/left-sidebar";
import { TopToolbar } from "@/components/top-toolbar";
import { SlideCanvas } from "@/components/slide-canvas";
import { ProjectHeader } from "@/components/project-header";

export default function CarouselEditor() {
  const store = useCarouselStore();
  const [activeLeftPanel, setActiveLeftPanel] = useState<string>("colors");
  const [activeTopPanel, setActiveTopPanel] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background" data-testid="carousel-editor">
      {/* Top header bar */}
      <ProjectHeader store={store} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left icon sidebar + expandable panel */}
        <LeftSidebar
          store={store}
          activePanel={activeLeftPanel}
          setActivePanel={setActiveLeftPanel}
        />

        {/* Main area: top toolbar + canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top toolbar */}
          <TopToolbar
            store={store}
            activePanel={activeTopPanel}
            setActivePanel={setActiveTopPanel}
          />

          {/* Canvas workspace */}
          <SlideCanvas
            store={store}
            activeTopPanel={activeTopPanel}
          />
        </div>
      </div>
    </div>
  );
}
