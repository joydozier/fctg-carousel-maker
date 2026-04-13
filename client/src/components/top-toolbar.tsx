import { LayoutTemplate, PaintBucket, Sparkles, Layers, AlignHorizontalDistributeCenter } from "lucide-react";
import { cn } from "@/lib/utils";
import { TemplatesPanel } from "@/components/panels/templates-panel";
import { CanvasPanel } from "@/components/panels/canvas-panel";
import { ElementsPanel } from "@/components/panels/elements-panel";

interface TopToolbarProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
  activePanel: string | null;
  setActivePanel: (panel: string | null) => void;
}

const TOOLBAR_ITEMS = [
  { id: "templates", label: "Templates", icon: LayoutTemplate, tooltip: "Browse built-in slide templates" },
  { id: "canvas", label: "Canvas", icon: PaintBucket, tooltip: "Background image, patterns & canvas settings" },
  { id: "elements", label: "Elements", icon: Sparkles, tooltip: "Configure visible elements & slide layout" },
];

export function TopToolbar({ store, activePanel, setActivePanel }: TopToolbarProps) {
  return (
    <div data-testid="top-toolbar">
      {/* Toolbar buttons */}
      <div className="h-11 border-b border-[#2a2b2d] flex items-center justify-center gap-1 px-4 bg-[#343536]">
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePanel(activePanel === item.id ? null : item.id)}
            className={cn(
              "h-8 px-4 rounded-md flex items-center gap-2 text-xs font-medium transition-colors text-[#8A8580] hover:text-[#D4A537] hover:bg-[#3A3B3D]",
              activePanel === item.id && "bg-[#3A3B3D] text-[#D4A537] border border-[#D4A537]/20"
            )}
            data-testid={`toolbar-${item.id}`}
            title={item.tooltip}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Panel dropdown */}
      {activePanel && (
        <div className="border-b border-[#2a2b2d] bg-[#343536] overflow-y-auto max-h-64 custom-scrollbar panel-content">
          <div className="p-4 max-w-3xl mx-auto">
            {activePanel === "templates" && <TemplatesPanel store={store} />}
            {activePanel === "canvas" && <CanvasPanel store={store} />}
            {activePanel === "elements" && <ElementsPanel store={store} />}
          </div>
        </div>
      )}
    </div>
  );
}
