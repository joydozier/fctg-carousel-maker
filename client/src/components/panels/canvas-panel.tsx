import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CanvasPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

const DESIGN_LAYOUTS = [
  { id: "centered", label: "Centered", icon: "⬜" },
  { id: "left-aligned", label: "Left", icon: "◧" },
  { id: "right-aligned", label: "Right", icon: "◨" },
  { id: "split-top", label: "Split Top", icon: "⬒" },
  { id: "split-bottom", label: "Split Bottom", icon: "⬓" },
  { id: "minimal", label: "Minimal", icon: "▫" },
] as const;

const BACKGROUND_PATTERNS = [
  { id: "none", label: "None", preview: "" },
  { id: "dots", label: "Dots", preview: "·····" },
  { id: "lines", label: "Lines", preview: "———" },
  { id: "diagonal", label: "Diagonal", preview: "///" },
  { id: "grid", label: "Grid", preview: "╬╬" },
  { id: "waves", label: "Waves", preview: "〰〰" },
  { id: "crosses", label: "Crosses", preview: "✚✚" },
  { id: "noise", label: "Noise", preview: "░░" },
] as const;

type LayoutId = typeof DESIGN_LAYOUTS[number]["id"];

export function CanvasPanel({ store }: CanvasPanelProps) {
  const { currentSlide, updateSlide, applyToAllSlides, project } = store;
  const [tab, setTab] = useState<"layout" | "padding">("layout");
  const [activeLayout, setActiveLayout] = useState<LayoutId | null>(null);
  const [showAdvancedGradient, setShowAdvancedGradient] = useState(false);
  const [gradientStart, setGradientStart] = useState("#1a1a2e");
  const [gradientEnd, setGradientEnd] = useState("#433B2B");
  const [gradientAngle, setGradientAngle] = useState(135);

  if (!currentSlide) return null;

  const canvasWidth = project.width;
  const canvasHeight = project.height;

  const applyLayout = (layoutId: LayoutId) => {
    setActiveLayout(layoutId);
    const elements = currentSlide.elements;
    const padding = currentSlide.contentPadding || 80;

    const updatedElements = elements.map((el) => {
      const isText = ["heading", "subtitle", "body", "cta"].includes(el.type);
      const isImage = el.type === "image" || el.type === "video";

      switch (layoutId) {
        case "centered": {
          return {
            ...el,
            x: Math.round((canvasWidth - el.width) / 2),
            y: Math.round((canvasHeight - el.height) / 2),
          };
        }
        case "left-aligned": {
          return {
            ...el,
            x: padding,
          };
        }
        case "right-aligned": {
          return {
            ...el,
            x: canvasWidth - el.width - padding,
          };
        }
        case "split-top": {
          if (isText) {
            return { ...el, y: padding };
          }
          if (isImage) {
            return { ...el, y: Math.round(canvasHeight / 2) };
          }
          return el;
        }
        case "split-bottom": {
          if (isImage) {
            return { ...el, y: padding };
          }
          if (isText) {
            return { ...el, y: Math.round(canvasHeight / 2) };
          }
          return el;
        }
        case "minimal": {
          const extraPad = padding * 1.5;
          return {
            ...el,
            x: Math.round((canvasWidth - el.width) / 2),
            y: Math.round((canvasHeight - el.height) / 2),
          };
        }
        default:
          return el;
      }
    });

    // Stack left-aligned elements from top
    if (layoutId === "left-aligned") {
      let yOffset = padding;
      const stacked = updatedElements.map((el) => {
        const out = { ...el, y: yOffset };
        yOffset += el.height + 20;
        return out;
      });
      updateSlide(currentSlide.id, { elements: stacked } as any);
      return;
    }

    updateSlide(currentSlide.id, { elements: updatedElements } as any);
  };

  const generatedGradient = `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`;

  const applyGradientFromBuilder = () => {
    updateSlide(currentSlide.id, { backgroundGradient: generatedGradient });
  };

  return (
    <div className="space-y-4" data-testid="canvas-panel">
      {/* Layout / Padding tabs */}
      <div className="flex gap-1 border-b">
        <button
          onClick={() => setTab("layout")}
          className={cn(
            "px-4 py-2 text-xs font-medium border-b-2 transition-colors",
            tab === "layout"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          data-testid="canvas-tab-layout"
        >
          Layout
        </button>
        <button
          onClick={() => setTab("padding")}
          className={cn(
            "px-4 py-2 text-xs font-medium border-b-2 transition-colors",
            tab === "padding"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          data-testid="canvas-tab-padding"
        >
          Padding
        </button>
      </div>

      {tab === "layout" && (
        <div className="space-y-5">
          {/* Design Layout grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground">Design Layout</h4>
            <div className="grid grid-cols-3 gap-2">
              {DESIGN_LAYOUTS.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => applyLayout(layout.id)}
                  className={cn(
                    "aspect-[4/5] rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors hover:bg-accent text-xs",
                    activeLayout === layout.id
                      ? "border-primary bg-accent ring-1 ring-primary"
                      : "border-muted"
                  )}
                  data-testid={`layout-${layout.id}`}
                  title={`Apply ${layout.label} layout`}
                >
                  <div className="w-full px-2">
                    <div className="aspect-[4/5] rounded border border-muted-foreground/20 flex items-center justify-center">
                      <div className="text-lg text-muted-foreground">{layout.icon}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{layout.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Pattern */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground">Background Pattern</h4>
            <div className="grid grid-cols-4 gap-2">
              {BACKGROUND_PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => updateSlide(currentSlide.id, { backgroundPattern: pattern.id as any })}
                  className={cn(
                    "aspect-square rounded-lg border flex items-center justify-center text-xs transition-all hover:bg-accent",
                    currentSlide.backgroundPattern === pattern.id
                      ? "border-primary bg-accent ring-1 ring-primary"
                      : "border-muted"
                  )}
                  data-testid={`pattern-${pattern.id}`}
                >
                  <span className="text-muted-foreground text-[10px]">{pattern.preview || "∅"}</span>
                </button>
              ))}
            </div>

            {/* Apply to all slides — pattern */}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-7"
              onClick={() =>
                applyToAllSlides({
                  backgroundPattern: currentSlide.backgroundPattern,
                  patternOpacity: currentSlide.patternOpacity,
                } as any)
              }
              data-testid="apply-pattern-all"
            >
              Apply Pattern to All Slides
            </Button>
          </div>

          {/* Opacity slider */}
          {currentSlide.backgroundPattern !== "none" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Opacity</Label>
                <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted">
                  {currentSlide.patternOpacity || 10}%
                </span>
              </div>
              <Slider
                value={[currentSlide.patternOpacity || 10]}
                min={1}
                max={50}
                step={1}
                onValueChange={([v]) => updateSlide(currentSlide.id, { patternOpacity: v })}
                data-testid="pattern-opacity"
              />
            </div>
          )}

          {/* Background color + gradient */}
          <div className="space-y-3 pt-3 border-t">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentSlide.backgroundColor}
                  onChange={(e) => updateSlide(currentSlide.id, { backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded border cursor-pointer"
                  data-testid="slide-bg-color"
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {currentSlide.backgroundColor.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Apply to all slides — background color */}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-7"
              onClick={() =>
                applyToAllSlides({ backgroundColor: currentSlide.backgroundColor } as any)
              }
              data-testid="apply-bg-color-all"
            >
              Apply Background Color to All Slides
            </Button>

            {/* Visual Gradient Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Gradient</Label>
                <button
                  onClick={() => setShowAdvancedGradient((v) => !v)}
                  className="text-[10px] text-muted-foreground underline hover:text-foreground transition-colors"
                  data-testid="toggle-advanced-gradient"
                >
                  {showAdvancedGradient ? "Visual Builder" : "Advanced"}
                </button>
              </div>

              {showAdvancedGradient ? (
                /* Advanced raw CSS input */
                <input
                  type="text"
                  value={currentSlide.backgroundGradient || ""}
                  onChange={(e) => updateSlide(currentSlide.id, { backgroundGradient: e.target.value || undefined })}
                  placeholder="e.g., linear-gradient(135deg, #1a1a2e, #433B2B)"
                  className="w-full h-8 text-xs px-2 rounded-md border bg-background"
                  data-testid="slide-gradient-input"
                />
              ) : (
                /* Visual gradient builder */
                <div className="space-y-3">
                  {/* Preview strip */}
                  <div
                    className="w-full h-8 rounded-md border"
                    style={{ background: generatedGradient }}
                    data-testid="gradient-preview"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Start Color</Label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={gradientStart}
                          onChange={(e) => setGradientStart(e.target.value)}
                          className="w-7 h-7 rounded border cursor-pointer"
                          data-testid="gradient-start-color"
                        />
                        <span className="text-[10px] font-mono text-muted-foreground">{gradientStart.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">End Color</Label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={gradientEnd}
                          onChange={(e) => setGradientEnd(e.target.value)}
                          className="w-7 h-7 rounded border cursor-pointer"
                          data-testid="gradient-end-color"
                        />
                        <span className="text-[10px] font-mono text-muted-foreground">{gradientEnd.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] text-muted-foreground">Angle</Label>
                      <span className="text-[10px] font-medium px-1 rounded bg-muted">{gradientAngle}°</span>
                    </div>
                    <Slider
                      value={[gradientAngle]}
                      min={0}
                      max={360}
                      step={5}
                      onValueChange={([v]) => setGradientAngle(v)}
                      data-testid="gradient-angle-slider"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 text-xs h-7"
                      onClick={applyGradientFromBuilder}
                      style={{ backgroundColor: "#D4A537", color: "#fff" }}
                      data-testid="apply-gradient-btn"
                    >
                      Apply Gradient
                    </Button>
                    {currentSlide.backgroundGradient && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => updateSlide(currentSlide.id, { backgroundGradient: undefined })}
                        data-testid="clear-gradient-btn"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "padding" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Content Padding</Label>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted">
                {currentSlide.contentPadding || 80}px
              </span>
            </div>
            <Slider
              value={[currentSlide.contentPadding || 80]}
              min={20}
              max={160}
              step={10}
              onValueChange={([v]) => updateSlide(currentSlide.id, { contentPadding: v } as any)}
              data-testid="content-padding"
            />
          </div>
        </div>
      )}
    </div>
  );
}
