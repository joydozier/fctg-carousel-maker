import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FONT_PAIRS } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface TextPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

const FONT_SIZE_PRESETS = [
  { label: "S", heading: 36, body: 18 },
  { label: "M", heading: 48, body: 24 },
  { label: "L", heading: 64, body: 28 },
];

export function TextPanel({ store }: TextPanelProps) {
  const { project, updateGlobalStyles, updateElement, currentSlide } = store;
  const { globalStyles } = project;

  const applyFontPair = (heading: string, body: string) => {
    updateGlobalStyles({ headingFont: heading, bodyFont: body });
    // Apply to all text elements in all slides
    project.slides.forEach(slide => {
      slide.elements.forEach(el => {
        if (el.type === "heading" || el.type === "subheading") {
          updateElement(slide.id, el.id, { fontFamily: heading });
        } else if (el.type === "body" || el.type === "cta") {
          updateElement(slide.id, el.id, { fontFamily: body });
        }
      });
    });
  };

  const applyFontSizePreset = (heading: number, body: number) => {
    updateGlobalStyles({ headingFontSize: heading, bodyFontSize: body });
    project.slides.forEach(slide => {
      slide.elements.forEach(el => {
        if (el.type === "heading") {
          updateElement(slide.id, el.id, { fontSize: heading });
        } else if (el.type === "body") {
          updateElement(slide.id, el.id, { fontSize: body });
        }
      });
    });
  };

  return (
    <div className="space-y-5" data-testid="text-panel">
      <h3 className="text-sm font-semibold">Typography</h3>

      {/* Font pair selector */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Font Pair</Label>
        <div className="space-y-1.5">
          {FONT_PAIRS.map((pair) => {
            const isActive = globalStyles.headingFont === pair.heading && globalStyles.bodyFont === pair.body;
            return (
              <button
                key={pair.label}
                onClick={() => applyFontPair(pair.heading, pair.body)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors hover:bg-accent ${isActive ? "border-primary bg-accent" : "border-transparent"}`}
                data-testid={`font-pair-${pair.label}`}
              >
                <div className="text-sm font-semibold" style={{ fontFamily: pair.heading }}>
                  {pair.heading}
                </div>
                <div className="text-xs text-muted-foreground" style={{ fontFamily: pair.body }}>
                  {pair.body} — Body text
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font size presets */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Font Size</Label>
        <div className="flex gap-2">
          {FONT_SIZE_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant={globalStyles.headingFontSize === preset.heading ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => applyFontSizePreset(preset.heading, preset.body)}
              data-testid={`font-size-${preset.label}`}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected element text controls */}
      {store.selectedElementId && currentSlide && (() => {
        const el = currentSlide.elements.find(e => e.id === store.selectedElementId);
        if (!el || !["heading", "subheading", "body", "cta"].includes(el.type)) return null;

        return (
          <div className="space-y-3 pt-3 border-t">
            <Label className="text-xs text-muted-foreground">Selected Element</Label>

            <div className="space-y-2">
              <Label className="text-[11px]">Font Size: {el.fontSize}px</Label>
              <Slider
                value={[el.fontSize || 24]}
                min={12}
                max={96}
                step={1}
                onValueChange={([v]) => updateElement(currentSlide.id, el.id, { fontSize: v })}
                data-testid="element-font-size"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[11px]">Font Weight</Label>
              <Select
                value={el.fontWeight || "400"}
                onValueChange={(v) => updateElement(currentSlide.id, el.id, { fontWeight: v })}
              >
                <SelectTrigger className="h-8 text-xs" data-testid="element-font-weight">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light</SelectItem>
                  <SelectItem value="400">Regular</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semibold</SelectItem>
                  <SelectItem value="700">Bold</SelectItem>
                  <SelectItem value="800">Extra Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px]">Text Align</Label>
              <div className="flex gap-1">
                {(["left", "center", "right"] as const).map((align) => (
                  <Button
                    key={align}
                    variant={el.textAlign === align ? "default" : "outline"}
                    size="sm"
                    className="flex-1 text-xs capitalize"
                    onClick={() => updateElement(currentSlide.id, el.id, { textAlign: align })}
                    data-testid={`text-align-${align}`}
                  >
                    {align}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px]">Text Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={el.color || "#ffffff"}
                  onChange={(e) => updateElement(currentSlide.id, el.id, { color: e.target.value })}
                  className="w-8 h-8 rounded border cursor-pointer"
                  data-testid="element-text-color"
                />
                <span className="text-xs font-mono text-muted-foreground">{el.color?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
