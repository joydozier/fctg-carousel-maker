import { Sparkles, Download, Palette, Type, Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorsPanel } from "@/components/panels/colors-panel";
import { TextPanel } from "@/components/panels/text-panel";
import { BrandPanel } from "@/components/panels/brand-panel";
import { ImportPanel } from "@/components/panels/import-panel";

interface LeftSidebarProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
  activePanel: string;
  setActivePanel: (panel: string) => void;
}

const SIDEBAR_ITEMS = [
  { id: "import", label: "Import", icon: Download },
  { id: "brand", label: "Brand", icon: Paintbrush },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "text", label: "Text", icon: Type },
];

export function LeftSidebar({ store, activePanel, setActivePanel }: LeftSidebarProps) {
  return (
    <div className="flex h-full" data-testid="left-sidebar">
      {/* Icon strip */}
      <div className="w-16 bg-card border-r flex flex-col items-center py-3 gap-1">
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePanel(activePanel === item.id ? "" : item.id)}
            className={cn(
              "w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors text-muted-foreground hover:text-foreground hover:bg-accent",
              activePanel === item.id && "bg-accent text-foreground"
            )}
            data-testid={`sidebar-${item.id}`}
          >
            <item.icon className="w-4.5 h-4.5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Expandable panel */}
      {activePanel && (
        <div className="w-72 bg-card border-r overflow-y-auto custom-scrollbar panel-content" data-testid="left-panel">
          <div className="p-4">
            {activePanel === "import" && <ImportPanel store={store} />}
            {activePanel === "brand" && <BrandPanel store={store} />}
            {activePanel === "colors" && <ColorsPanel store={store} />}
            {activePanel === "text" && <TextPanel store={store} />}
          </div>
        </div>
      )}
    </div>
  );
}
