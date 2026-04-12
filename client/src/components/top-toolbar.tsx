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
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "canvas", label: "Canvas", icon: PaintBucket },
  { id: "elements", label: "Elements", icon: Sparkles },
];

export function TopToolbar({ store, activePanel, setActivePanel }: TopToolbarProps) {
  return (
    <div data-testid="top-toolbar">
      {/* Toolbar buttons */}
      <div className="h-11 border-b flex items-center justify-center gap-1 px-4 bg-card">
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePanel(activePanel === item.id ? null : item.id)}
            className={cn(
              "h-8 px-4 rounded-md flex items-center gap-2 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent",
              activePanel === item.id && "bg-accent text-foreground"
            )}
            data-testid={`toolbar-${item.id}`}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Panel dropdown */}
      {activePanel && (
        <div className="border-b bg-card overflow-y-auto max-h-64 custom-scrollbar panel-content">
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
