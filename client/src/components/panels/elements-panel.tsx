import { Button } from "@/components/ui/button";
import { Type, Heading1, AlignLeft, MousePointerClick, Square, Circle, Star, Heart, Zap, Target, Hash, ArrowRight, Image as ImageIcon } from "lucide-react";
import type { SlideElement } from "@/lib/types";

interface ElementsPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

export function ElementsPanel({ store }: ElementsPanelProps) {
  const { currentSlide, addElement, project } = store;
  if (!currentSlide) return null;

  const palette = project.globalStyles.colorPalette;

  const addTextElement = (type: "heading" | "subheading" | "body" | "cta") => {
    const configs = {
      heading: { content: "Heading", fontSize: 48, fontWeight: "700", color: palette[3] || "#fff", y: 200 },
      subheading: { content: "Subheading", fontSize: 32, fontWeight: "600", color: palette[2] || "#ccc", y: 300 },
      body: { content: "Body text goes here", fontSize: 24, fontWeight: "400", color: palette[2] || "#ccc", y: 400 },
      cta: { content: "Learn More", fontSize: 20, fontWeight: "600", color: palette[0] || "#000", y: 800 },
    };
    const config = configs[type];
    const el: SlideElement = {
      id: crypto.randomUUID(),
      type,
      x: 80,
      y: config.y,
      width: 920,
      height: type === "body" ? 200 : type === "cta" ? 60 : 100,
      rotation: 0,
      content: config.content,
      fontSize: config.fontSize,
      fontFamily: type === "heading" || type === "subheading" ? project.globalStyles.headingFont : project.globalStyles.bodyFont,
      fontWeight: config.fontWeight,
      textAlign: "center",
      color: config.color,
      backgroundColor: type === "cta" ? (palette[1] || "#D4A537") : undefined,
      borderRadius: type === "cta" ? 12 : 0,
      lineHeight: 1.4,
      padding: type === "cta" ? 16 : 0,
    };
    addElement(currentSlide.id, el);
  };

  const addShapeElement = (shape: string) => {
    const el: SlideElement = {
      id: crypto.randomUUID(),
      type: "shape",
      x: 400,
      y: 400,
      width: 200,
      height: 200,
      rotation: 0,
      backgroundColor: palette[1] || "#D4A537",
      borderRadius: shape === "circle" ? 9999 : shape === "rounded" ? 24 : 0,
      opacity: 0.3,
    };
    addElement(currentSlide.id, el);
  };

  return (
    <div className="space-y-5" data-testid="elements-panel">
      <div className="grid grid-cols-2 gap-6">
        {/* Text elements */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Text Elements</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => addTextElement("heading")} className="gap-1.5 text-xs justify-start" data-testid="add-heading">
              <Heading1 className="w-3.5 h-3.5" />
              Heading
            </Button>
            <Button variant="outline" size="sm" onClick={() => addTextElement("subheading")} className="gap-1.5 text-xs justify-start" data-testid="add-subheading">
              <Type className="w-3.5 h-3.5" />
              Subheading
            </Button>
            <Button variant="outline" size="sm" onClick={() => addTextElement("body")} className="gap-1.5 text-xs justify-start" data-testid="add-body">
              <AlignLeft className="w-3.5 h-3.5" />
              Body Text
            </Button>
            <Button variant="outline" size="sm" onClick={() => addTextElement("cta")} className="gap-1.5 text-xs justify-start" data-testid="add-cta">
              <MousePointerClick className="w-3.5 h-3.5" />
              CTA Button
            </Button>
          </div>
        </div>

        {/* Shapes */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Shapes & Decorations</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => addShapeElement("square")} className="gap-1 text-xs" data-testid="add-square">
              <Square className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => addShapeElement("circle")} className="gap-1 text-xs" data-testid="add-circle">
              <Circle className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => addShapeElement("rounded")} className="gap-1 text-xs" data-testid="add-rounded">
              <Square className="w-3.5 h-3.5 rounded" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
