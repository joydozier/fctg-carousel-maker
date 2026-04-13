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
  { id: "import", label: "Import", icon: Download, tooltip: "Import images or data from external sources" },
  { id: "brand", label: "Brand", icon: Paintbrush, tooltip: "Brand name, handle, logo, slide numbers & swipe indicator" },
  { id: "colors", label: "Colors", icon: Palette, tooltip: "Color palettes, FCTG presets & custom colors" },
  { id: "text", label: "Text", icon: Type, tooltip: "Font pairings, heading & body font sizes" },
];

export function LeftSidebar({ store, activePanel, setActivePanel }: LeftSidebarProps) {
  return (
    <div className="flex h-full" data-testid="left-sidebar">
      {/* Icon strip */}
      <div className="w-16 bg-[#2D2E30] border-r border-[#232425] flex flex-col items-center py-3 gap-1">
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePanel(activePanel === item.id ? "" : item.id)}
            className={cn(
              "w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors text-[#8A8580] hover:text-[#D4A537] hover:bg-[#3A3B3D]",
              activePanel === item.id && "bg-[#3A3B3D] text-[#D4A537] border border-[#D4A537]/20"
            )}
            data-testid={`sidebar-${item.id}`}
            title={item.tooltip}
          >
            <item.icon className="w-4.5 h-4.5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Expandable panel */}
      {activePanel && (
        <div className="w-72 bg-[#343536] border-r border-[#2a2b2d] overflow-y-auto custom-scrollbar panel-content" data-testid="left-panel">
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
