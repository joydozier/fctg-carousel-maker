import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { useCarouselStore } from "@/lib/carousel-store";
import { LeftSidebar } from "@/components/left-sidebar";
import { TopToolbar } from "@/components/top-toolbar";
import { SlideCanvas } from "@/components/slide-canvas";
import { ProjectHeader } from "@/components/project-header";
import { ComparisonHeroCard } from "@/components/comparison-hero-card";
import { apiRequest } from "@/lib/queryClient";
import type { CarouselProject } from "@/lib/types";

// Project type — matches the API response shape from Supabase storage
interface Project {
  id: number;
  name: string;
  platform: string;
  width: number;
  height: number;
  slides: string;
  globalStyles: string;
  isTemplate: number;
  isBuiltIn: number;
  templateCategory: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function CarouselEditor() {
  const store = useCarouselStore();
  const [activeLeftPanel, setActiveLeftPanel] = useState<string>("colors");
  const [activeTopPanel, setActiveTopPanel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(false);

  // Check if we're on /editor/:id route
  const [matchId, paramsId] = useRoute("/editor/:id");

  useEffect(() => {
    if (loadedRef.current) return;
    if (!matchId || !paramsId?.id) return;
    if (paramsId.id === "new") return; // blank project, use default state

    const projectId = Number(paramsId.id);
    if (isNaN(projectId)) return;

    loadedRef.current = true;
    setLoading(true);

    apiRequest("GET", `/api/projects/${projectId}`)
      .then(async (res) => {
        const proj: Project = await res.json();
        // Convert DB project to in-memory CarouselProject
        const slides = JSON.parse(proj.slides);
        const globalStyles = JSON.parse(proj.globalStyles);
        const loaded: CarouselProject = {
          id: proj.id,
          name: proj.name,
          platform: proj.platform,
          width: proj.width,
          height: proj.height,
          slideCount: slides.length,
          slides,
          globalStyles,
        };
        store.loadProject(loaded);
      })
      .catch((err) => {
        console.error("Failed to load project:", err);
      })
      .finally(() => setLoading(false));
  }, [matchId, paramsId?.id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background" data-testid="editor-loading">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Loading project...</span>
        </div>
      </div>
    );
  }

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

          {/* Tier 4 visibility upgrade — a dismissible hero card that
              auto-shows on a fresh canvas to advertise the new Comparison
              layout. The card filters itself based on project state, so we
              can render it unconditionally here. */}
          <ComparisonHeroCard
            project={store.project}
            selectedSlideIndex={store.selectedSlideIndex}
            onConvert={(index) => {
              store.convertSlideToComparison(index);
              requestAnimationFrame(() => {
                window.dispatchEvent(
                  new CustomEvent("fctg:open-configure", { detail: { index } })
                );
              });
            }}
            onAddNew={() => {
              const newIdx = store.addComparisonSlide("pro-con");
              requestAnimationFrame(() => {
                window.dispatchEvent(
                  new CustomEvent("fctg:open-configure", { detail: { index: newIdx } })
                );
              });
            }}
          />

          {/* Canvas workspace */}
          <SlideCanvas
            store={store}
            activeTopPanel={activeTopPanel}
            activeLeftPanel={activeLeftPanel}
            setActiveLeftPanel={setActiveLeftPanel}
          />
        </div>
      </div>
    </div>
  );
}
