import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface CanvasPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

const BACKGROUND_PATTERNS = [
  { id: "none", label: "None" },
  { id: "dots", label: "Dots" },
  { id: "lines", label: "Lines" },
  { id: "diagonal", label: "Diagonal" },
  { id: "grid", label: "Grid" },
] as const;

const LAYOUTS = [
  { id: "default", label: "Default", desc: "Centered content" },
  { id: "quote", label: "Quote", desc: "Large quote text" },
  { id: "split", label: "Split", desc: "Text + image" },
  { id: "centered", label: "Centered", desc: "Tight center" },
  { id: "minimal", label: "Minimal", desc: "Less content" },
] as const;

export function CanvasPanel({ store }: CanvasPanelProps) {
  const { currentSlide, updateSlide, project } = store;
  if (!currentSlide) return null;

  return (
    <div className="space-y-5" data-testid="canvas-panel">
      <div className="grid grid-cols-2 gap-6">
        {/* Layouts */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Layout</h3>
          <div className="grid grid-cols-3 gap-2">
            {LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                onClick={() => updateSlide(currentSlide.id, { layout: layout.id })}
                className={cn(
                  "p-2 rounded-lg border text-center transition-colors hover:bg-accent",
                  currentSlide.layout === layout.id && "border-primary bg-accent"
                )}
                data-testid={`layout-${layout.id}`}
              >
                <div className="text-xs font-medium">{layout.label}</div>
                <div className="text-[10px] text-muted-foreground">{layout.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Background */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Background</h3>

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

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Gradient</Label>
            <input
              type="text"
              value={currentSlide.backgroundGradient || ""}
              onChange={(e) => updateSlide(currentSlide.id, { backgroundGradient: e.target.value || undefined })}
              placeholder="e.g., linear-gradient(135deg, #1a1a2e, #433B2B)"
              className="w-full h-8 text-xs px-2 rounded-md border bg-background"
              data-testid="slide-gradient-input"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Pattern</Label>
            <div className="flex gap-1.5">
              {BACKGROUND_PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => updateSlide(currentSlide.id, { backgroundPattern: pattern.id })}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-medium transition-colors border",
                    currentSlide.backgroundPattern === pattern.id
                      ? "border-primary bg-accent text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-accent"
                  )}
                  data-testid={`pattern-${pattern.id}`}
                >
                  {pattern.label}
                </button>
              ))}
            </div>
          </div>

          {currentSlide.backgroundPattern !== "none" && (
            <div className="space-y-1">
              <Label className="text-[11px]">Pattern Opacity: {currentSlide.patternOpacity || 10}%</Label>
              <Slider
                value={[currentSlide.patternOpacity || 10]}
                min={5}
                max={50}
                step={5}
                onValueChange={([v]) => updateSlide(currentSlide.id, { patternOpacity: v })}
                data-testid="pattern-opacity"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
