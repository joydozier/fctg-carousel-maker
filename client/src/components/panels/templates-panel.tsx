import { FCTG_BRAND_COLORS, createDefaultSlide } from "@/lib/types";
import type { Slide, SlideElement } from "@/lib/types";

interface TemplatesPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

interface Template {
  name: string;
  preview: { bg: string; accent: string; text: string; body: string };
  generate: () => Slide[];
}

const TEMPLATES: Template[] = [
  {
    name: "FCTG Dark Gold",
    preview: { bg: "#433B2B", accent: "#D4A537", text: "#FDFBF7", body: "#B8944F" },
    generate: () => generateSlides("#433B2B", "#D4A537", "#FDFBF7", "#B8944F"),
  },
  {
    name: "FCTG Obsidian",
    preview: { bg: "#08080A", accent: "#D4A537", text: "#FDFBF7", body: "#B8944F" },
    generate: () => generateSlides("#08080A", "#D4A537", "#FDFBF7", "#B8944F"),
  },
  {
    name: "FCTG Cream Light",
    preview: { bg: "#FDFBF7", accent: "#D4A537", text: "#433B2B", body: "#08080A" },
    generate: () => generateSlides("#FDFBF7", "#D4A537", "#433B2B", "#08080A"),
  },
  {
    name: "Bold Purple",
    preview: { bg: "#240046", accent: "#7b2cbf", text: "#e0aaff", body: "#c77dff" },
    generate: () => generateSlides("#240046", "#7b2cbf", "#e0aaff", "#c77dff"),
  },
  {
    name: "Ocean Blue",
    preview: { bg: "#023e8a", accent: "#0077b6", text: "#caf0f8", body: "#90e0ef" },
    generate: () => generateSlides("#023e8a", "#0077b6", "#caf0f8", "#90e0ef"),
  },
  {
    name: "Sunset Warm",
    preview: { bg: "#1a1a2e", accent: "#f3722c", text: "#f9c74f", body: "#f8f9fa" },
    generate: () => generateSlides("#1a1a2e", "#f3722c", "#f9c74f", "#f8f9fa"),
  },
  {
    name: "Forest Green",
    preview: { bg: "#2d6a4f", accent: "#52b788", text: "#d8f3dc", body: "#b7e4c7" },
    generate: () => generateSlides("#2d6a4f", "#52b788", "#d8f3dc", "#b7e4c7"),
  },
  {
    name: "Minimal Light",
    preview: { bg: "#f8f9fa", accent: "#212529", text: "#212529", body: "#495057" },
    generate: () => generateSlides("#f8f9fa", "#212529", "#212529", "#495057"),
  },
  {
    name: "Rose Pink",
    preview: { bg: "#b5838d", accent: "#e5989b", text: "#ffcdb2", body: "#ffb4a2" },
    generate: () => generateSlides("#b5838d", "#e5989b", "#ffcdb2", "#ffb4a2"),
  },
];

function generateSlides(bg: string, accent: string, textColor: string, bodyColor: string): Slide[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: crypto.randomUUID(),
    order: i,
    backgroundColor: bg,
    elements: [
      {
        id: crypto.randomUUID(),
        type: "heading" as const,
        x: 80, y: i === 0 ? 300 : 200, width: 920, height: 120, rotation: 0,
        content: i === 0 ? "Your Title Here" : `Slide ${i + 1}`,
        fontSize: i === 0 ? 64 : 48,
        fontFamily: "General Sans", fontWeight: "700", textAlign: "center" as const,
        color: textColor, lineHeight: 1.2,
      },
      {
        id: crypto.randomUUID(),
        type: "body" as const,
        x: 80, y: i === 0 ? 450 : 360, width: 920, height: 200, rotation: 0,
        content: i === 0 ? "Swipe to learn more" : "Add your content here.",
        fontSize: 24, fontFamily: "General Sans", fontWeight: "400", textAlign: "center" as const,
        color: bodyColor, lineHeight: 1.6,
      },
    ],
    layout: "default" as const,
    backgroundPattern: "none" as const,
    patternOpacity: 10,
  }));
}

export function TemplatesPanel({ store }: TemplatesPanelProps) {
  const { updateProject, applyPaletteToAllSlides } = store;

  const applyTemplate = (template: Template) => {
    const slides = template.generate();
    const palette = [template.preview.bg, template.preview.accent, template.preview.body, template.preview.text];
    updateProject({ slides });
    applyPaletteToAllSlides(palette);
  };

  return (
    <div data-testid="templates-panel">
      <h3 className="text-sm font-semibold mb-3">Templates</h3>
      <div className="grid grid-cols-4 gap-3">
        {TEMPLATES.map((template) => (
          <button
            key={template.name}
            onClick={() => applyTemplate(template)}
            className="group text-left rounded-lg border border-transparent hover:border-primary transition-colors"
            data-testid={`template-${template.name}`}
          >
            {/* Preview */}
            <div
              className="aspect-square rounded-lg overflow-hidden relative"
              style={{ backgroundColor: template.preview.bg }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                <div
                  className="text-[10px] font-bold text-center leading-tight"
                  style={{ color: template.preview.text }}
                >
                  Title
                </div>
                <div
                  className="text-[8px] text-center mt-1"
                  style={{ color: template.preview.body }}
                >
                  Body text
                </div>
                <div
                  className="w-6 h-1.5 rounded-full mt-2"
                  style={{ backgroundColor: template.preview.accent }}
                />
              </div>
            </div>
            <div className="text-[11px] font-medium mt-1.5 px-0.5 truncate">{template.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
