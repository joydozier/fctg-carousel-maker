import { useState } from "react";
import { FCTG_BRAND_COLORS, generateSlides, createDefaultGlobalStyles } from "@/lib/types";
import type { Slide, GlobalStyles } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TemplatesPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

interface Template {
  name: string;
  preview: { bg: string; accent: string; text: string; body: string };
  palette: string[];
}

const TEMPLATES: Template[] = [
  {
    name: "FCTG Dark Gold",
    preview: { bg: "#433B2B", accent: "#D4A537", text: "#FDFBF7", body: "#B8944F" },
    palette: ["#433B2B", "#D4A537", "#FDFBF7", "#FDFBF7"],
  },
  {
    name: "FCTG Obsidian",
    preview: { bg: "#08080A", accent: "#D4A537", text: "#FDFBF7", body: "#B8944F" },
    palette: ["#08080A", "#D4A537", "#FDFBF7", "#FDFBF7"],
  },
  {
    name: "FCTG Cream Light",
    preview: { bg: "#FDFBF7", accent: "#D4A537", text: "#433B2B", body: "#08080A" },
    palette: ["#FDFBF7", "#D4A537", "#433B2B", "#08080A"],
  },
  {
    name: "Bold Purple",
    preview: { bg: "#240046", accent: "#7b2cbf", text: "#e0aaff", body: "#c77dff" },
    palette: ["#240046", "#7b2cbf", "#e0aaff", "#c77dff"],
  },
  {
    name: "Ocean Blue",
    preview: { bg: "#023e8a", accent: "#0077b6", text: "#caf0f8", body: "#90e0ef" },
    palette: ["#023e8a", "#0077b6", "#caf0f8", "#90e0ef"],
  },
  {
    name: "Sunset Warm",
    preview: { bg: "#1a1a2e", accent: "#f3722c", text: "#f9c74f", body: "#f8f9fa" },
    palette: ["#1a1a2e", "#f3722c", "#f9c74f", "#f8f9fa"],
  },
  {
    name: "Forest Green",
    preview: { bg: "#2d6a4f", accent: "#52b788", text: "#d8f3dc", body: "#b7e4c7" },
    palette: ["#2d6a4f", "#52b788", "#d8f3dc", "#b7e4c7"],
  },
  {
    name: "Minimal Light",
    preview: { bg: "#f8f9fa", accent: "#212529", text: "#212529", body: "#495057" },
    palette: ["#f8f9fa", "#212529", "#212529", "#495057"],
  },
  {
    name: "Rose Pink",
    preview: { bg: "#b5838d", accent: "#e5989b", text: "#ffcdb2", body: "#ffb4a2" },
    palette: ["#b5838d", "#e5989b", "#ffcdb2", "#ffb4a2"],
  },
  {
    name: "Midnight Teal",
    preview: { bg: "#0d1b2a", accent: "#1b9aaa", text: "#e0f7fa", body: "#b2ebf2" },
    palette: ["#0d1b2a", "#1b9aaa", "#e0f7fa", "#b2ebf2"],
  },
];

export function TemplatesPanel({ store }: TemplatesPanelProps) {
  const { updateProject, applyPaletteToAllSlides, project } = store;
  const [tab, setTab] = useState<"built-in" | "custom">("built-in");

  const applyTemplate = (template: Template) => {
    const styles: GlobalStyles = {
      ...createDefaultGlobalStyles(),
      colorPalette: template.palette,
    };
    const slides = generateSlides(project.slideCount, template.palette, styles);
    updateProject({ slides, globalStyles: styles });
  };

  return (
    <div data-testid="templates-panel">
      {/* Built-In / Custom tabs */}
      <div className="flex gap-1 mb-3 border-b">
        <button
          onClick={() => setTab("built-in")}
          className={cn(
            "px-4 py-2 text-xs font-medium border-b-2 transition-colors",
            tab === "built-in"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          data-testid="templates-tab-builtin"
        >
          Built-In
        </button>
        <button
          onClick={() => setTab("custom")}
          className={cn(
            "px-4 py-2 text-xs font-medium border-b-2 transition-colors",
            tab === "custom"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          data-testid="templates-tab-custom"
        >
          Custom
        </button>
      </div>

      {tab === "built-in" && (
        <>
          <div className="mb-3">
            <select className="w-full h-8 text-xs px-2 rounded-md border bg-background" data-testid="template-filter">
              <option>Show All Templates</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((template) => (
              <button
                key={template.name}
                onClick={() => applyTemplate(template)}
                className="group text-left rounded-lg border border-transparent hover:border-primary transition-colors"
                data-testid={`template-${template.name}`}
              >
                <div
                  className="aspect-[4/5] rounded-lg overflow-hidden relative"
                  style={{ backgroundColor: template.preview.bg }}
                >
                  <div className="absolute inset-0 flex flex-col p-4 justify-end">
                    <div
                      className="text-[9px] mb-0.5 opacity-70"
                      style={{ color: template.preview.body }}
                    >
                      subtitle
                    </div>
                    <div className="text-[11px] font-bold leading-tight mb-1">
                      <span style={{ color: template.preview.accent }}>Amazing </span>
                      <span style={{ color: template.preview.text }}>Catchy Title</span>
                    </div>
                    <div
                      className="text-[8px] opacity-60"
                      style={{ color: template.preview.body }}
                    >
                      Description text here
                    </div>
                    {/* Brand bar */}
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/10">
                      <div
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-bold"
                        style={{ backgroundColor: template.preview.accent, color: template.preview.bg }}
                      >
                        F
                      </div>
                      <span className="text-[7px]" style={{ color: template.preview.body }}>
                        Brand
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] font-medium mt-1.5 px-0.5 truncate">{template.name}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {tab === "custom" && (
        <div className="py-8 text-center text-xs text-muted-foreground">
          <p>Your saved templates will appear here.</p>
          <p className="mt-1 text-[11px]">Save your current design as a template from the File menu.</p>
        </div>
      )}
    </div>
  );
}
