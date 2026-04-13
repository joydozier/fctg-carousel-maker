import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SlideElement } from "@/lib/types";
import {
  Ban, Circle, ArrowRight, TrendingUp, Code2, Sparkles, Target,
  Heart, Send, Eye, Zap, Shield, Award, Smile, Music, ChevronRight, ImagePlus,
} from "lucide-react";

interface ElementsPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

type SubTab = "elements" | "number" | "swipe" | "misc";

const DECORATIVE_ICONS = [
  { icon: Ban, label: "None", tooltip: "Remove decorative element" },
  { icon: Circle, label: "Circle", tooltip: "Add a circle shape overlay" },
  { icon: ArrowRight, label: "Arrow", tooltip: "Add a directional arrow element" },
  { icon: TrendingUp, label: "Trend", tooltip: "Add a trending/growth indicator" },
  { icon: Code2, label: "Code", tooltip: "Add a code bracket decorative" },
  { icon: Sparkles, label: "Sparkle", tooltip: "Add sparkle accents" },
  { icon: Music, label: "Music", tooltip: "Add a music note decorative" },
  { icon: Target, label: "Target", tooltip: "Add a target/bullseye shape" },
  { icon: Heart, label: "Heart", tooltip: "Add a heart shape element" },
  { icon: Send, label: "Send", tooltip: "Add a send/paper plane icon" },
  { icon: Eye, label: "Eye", tooltip: "Add an eye/visibility icon" },
  { icon: Zap, label: "Zap", tooltip: "Add a lightning bolt accent" },
  { icon: Shield, label: "Shield", tooltip: "Add a shield badge element" },
  { icon: Award, label: "Award", tooltip: "Add an award/ribbon decorative" },
  { icon: Smile, label: "Smile", tooltip: "Add a smiley face element" },
];

const NUMBER_STYLES: { id: string; label: string; example: string; tooltip: string }[] = [
  { id: "circle", label: "Circle", example: "①", tooltip: "Number inside a circle — clean and modern" },
  { id: "padded", label: "Padded", example: "01", tooltip: "Zero-padded numbers — 01, 02, 03" },
  { id: "hash", label: "Hash", example: "#1", tooltip: "Hash-prefixed numbers — #1, #2, #3" },
  { id: "title", label: "Title", example: "1 Title", tooltip: "Number followed by slide title text" },
  { id: "line", label: "Line", example: "—1—", tooltip: "Number with decorative line separators" },
  { id: "dots", label: "Dots", example: "•••", tooltip: "Progress dots showing current position" },
];

const SWIPE_STYLES = [
  { id: "chevron", label: "Chevron", icon: "›", tooltip: "Subtle chevron swipe arrow" },
  { id: "arrow-thin", label: "Arrow Thin", icon: "→", tooltip: "Thin line arrow indicator" },
  { id: "arrow-bold", label: "Arrow Bold", icon: "▶", tooltip: "Bold filled arrow indicator" },
];

const SWIPE_ICONS = [
  { id: "none", label: "✕", tooltip: "No swipe icon" },
  { id: "chevron", label: "›", tooltip: "Chevron indicator icon" },
  { id: "arrow", label: "→", tooltip: "Arrow indicator icon" },
  { id: "circle", label: "○", tooltip: "Circle indicator icon" },
  { id: "spark", label: "✦", tooltip: "Sparkle indicator icon" },
];

export function ElementsPanel({ store }: ElementsPanelProps) {
  const { currentSlide, project, updateGlobalStyles, addElement } = store;
  const [subTab, setSubTab] = useState<SubTab>("elements");
  const { globalStyles } = project;

  if (!currentSlide) return null;

  const palette = globalStyles.colorPalette;

  const addDecorativeShape = (iconLabel: string) => {
    if (iconLabel === "None") return;
    const el: SlideElement = {
      id: crypto.randomUUID(),
      type: "shape",
      x: 800,
      y: 200,
      width: 80,
      height: 80,
      rotation: 0,
      visible: true,
      backgroundColor: palette[1] || "#D4A537",
      borderRadius: (globalStyles.decorativeRoundness ?? 50) * 0.4,
      opacity: (globalStyles.decorativeOpacity || 15) / 100,
    };
    addElement(currentSlide.id, el);
  };

  return (
    <div className="space-y-4" data-testid="elements-panel">
      {/* Sub-tabs: Elements | Number | Swipe | Misc */}
      <div className="flex gap-1 border-b">
        {(["elements", "number", "swipe", "misc"] as SubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={cn(
              "px-3 py-2 text-xs font-medium border-b-2 transition-colors capitalize",
              subTab === t
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            data-testid={`elements-tab-${t}`}
          >
            {t === "misc" ? "Misc." : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ---- Elements sub-tab ---- */}
      {subTab === "elements" && (
        <div className="space-y-4">
          {/* Logo Element */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground border-b pb-2">Logo Element</h4>
            <button
              onClick={() => {
                const el: SlideElement = {
                  id: crypto.randomUUID(),
                  type: "logo",
                  x: 40,
                  y: 40,
                  width: 120,
                  height: 60,
                  rotation: 0,
                  visible: true,
                  opacity: 1,
                  borderRadius: 0,
                };
                addElement(currentSlide.id, el);
              }}
              className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border text-xs font-medium transition-all hover:bg-accent"
              style={{ borderColor: "#D4A537", color: "#D4A537" }}
              data-testid="add-logo-button"
              title="Add a logo image element to the current slide"
            >
              <ImagePlus className="w-4 h-4" />
              Add Logo
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs" title="Toggle decorative shape overlays on slides">Custom Design Elements</Label>
            <Switch
              checked={globalStyles.decorativeElementsEnabled}
              onCheckedChange={(v) => updateGlobalStyles({ decorativeElementsEnabled: v })}
              title="Enable or disable decorative elements"
              data-testid="decorative-elements-toggle"
            />
          </div>

          {globalStyles.decorativeElementsEnabled && (
            <>
              <div className="grid grid-cols-5 gap-2">
                {DECORATIVE_ICONS.map(({ icon: Icon, label, tooltip }) => (
                  <button
                    key={label}
                    onClick={() => addDecorativeShape(label)}
                    title={tooltip}
                    className="aspect-square rounded-lg border flex items-center justify-center hover:bg-accent hover:border-primary transition-all"
                    data-testid={`deco-${label}`}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground" title="Control the transparency of decorative elements">Opacity</Label>
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted">
                    {globalStyles.decorativeOpacity || 15}%
                  </span>
                </div>
                <Slider
                  value={[globalStyles.decorativeOpacity || 15]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={([v]) => updateGlobalStyles({ decorativeOpacity: v })}
                  data-testid="deco-opacity"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground" title="Adjust corner roundness of decorative shapes">Roundness</Label>
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted">
                    {globalStyles.decorativeRoundness ?? 50}%
                  </span>
                </div>
                <Slider
                  value={[globalStyles.decorativeRoundness ?? 50]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([v]) => updateGlobalStyles({ decorativeRoundness: v })}
                  data-testid="deco-roundness"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* ---- Number sub-tab ---- */}
      {subTab === "number" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs" title="Show a number indicator on each slide">Slide Number</Label>
            <Switch
              checked={globalStyles.slideNumberEnabled}
              onCheckedChange={(v) => updateGlobalStyles({ slideNumberEnabled: v })}
              title="Toggle slide numbers on/off"
              data-testid="slide-number-toggle"
            />
          </div>

          {globalStyles.slideNumberEnabled && (
            <>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground" title="Choose how slide numbers are displayed">Slide Number Style</Label>
                <div className="grid grid-cols-3 gap-2">
                  {NUMBER_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => updateGlobalStyles({ slideNumberStyle: style.id as any })}
                      title={style.tooltip}
                      className={cn(
                        "h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-all hover:bg-accent",
                        globalStyles.slideNumberStyle === style.id
                          ? "border-primary bg-accent ring-1 ring-primary"
                          : "border-muted"
                      )}
                      data-testid={`number-style-${style.id}`}
                    >
                      {style.example}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs" title="Add a drop shadow behind slide numbers">Add Shadow</Label>
                <Switch
                  checked={globalStyles.slideNumberShadow}
                  onCheckedChange={(v) => updateGlobalStyles({ slideNumberShadow: v })}
                  title="Toggle shadow on slide numbers"
                  data-testid="number-shadow-toggle"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* ---- Swipe sub-tab ---- */}
      {subTab === "swipe" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs" title="Show a swipe/next arrow indicator on slides">Swipe Indicator</Label>
            <Switch
              checked={globalStyles.swipeIndicatorEnabled}
              onCheckedChange={(v) => updateGlobalStyles({ swipeIndicatorEnabled: v })}
              title="Toggle swipe indicator visibility"
              data-testid="swipe-indicator-toggle"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs" title="Restrict the swipe indicator to the first (intro) slide only">Show Only On Intro Slide</Label>
            <Switch
              checked={globalStyles.swipeIntroOnly}
              onCheckedChange={(v) => updateGlobalStyles({ swipeIntroOnly: v })}
              title="Only display swipe arrow on the intro slide"
              data-testid="swipe-intro-only-toggle"
            />
          </div>

          {globalStyles.swipeIndicatorEnabled && (
            <>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground" title="Choose the style of the swipe direction arrow">Swipe Style</Label>
                <div className="flex gap-2">
                  {SWIPE_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => updateGlobalStyles({ swipeStyle: style.id as any })}
                      title={style.tooltip}
                      className={cn(
                        "h-10 w-10 rounded-lg border flex items-center justify-center text-lg hover:bg-accent transition-all",
                        globalStyles.swipeStyle === style.id
                          ? "border-primary bg-accent ring-1 ring-primary"
                          : "border-muted"
                      )}
                      data-testid={`swipe-style-${style.id}`}
                    >
                      {style.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground" title="Pick the icon displayed alongside the swipe text">Swipe Indicator Icon</Label>
                <div className="flex gap-2">
                  {SWIPE_ICONS.map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => updateGlobalStyles({ swipeIcon: icon.id as any })}
                      title={icon.tooltip}
                      className={cn(
                        "h-10 w-10 rounded-lg border flex items-center justify-center text-sm hover:bg-accent transition-all",
                        globalStyles.swipeIcon === icon.id
                          ? "border-primary bg-accent ring-1 ring-primary"
                          : "border-muted"
                      )}
                      data-testid={`swipe-icon-${icon.id}`}
                    >
                      {icon.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground" title="Custom text shown with the swipe arrow on the intro slide">Swipe Indicator Text (Intro)</Label>
                <Input
                  value={globalStyles.swipeText || ""}
                  onChange={(e) => updateGlobalStyles({ swipeText: e.target.value })}
                  placeholder="e.g. Swipe to continue"
                  className="h-8 text-xs"
                  data-testid="swipe-text-input"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs" title="Add a bookmark/save button to carousel slides">Bookmark Button</Label>
                <Switch
                  checked={globalStyles.bookmarkEnabled}
                  onCheckedChange={(v) => updateGlobalStyles({ bookmarkEnabled: v })}
                  title="Toggle bookmark button"
                  data-testid="bookmark-toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs" title="Add a drop shadow behind the swipe indicator">Add Shadow</Label>
                <Switch
                  checked={globalStyles.swipeShadow}
                  onCheckedChange={(v) => updateGlobalStyles({ swipeShadow: v })}
                  title="Toggle shadow on swipe indicator"
                  data-testid="swipe-shadow-toggle"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* ---- Misc sub-tab ---- */}
      {subTab === "misc" && (
        <div className="space-y-4">
          {/* CTA Settings */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground border-b pb-2">CTA Settings</h4>

            <div className="flex items-center justify-between">
              <Label className="text-xs" title="Generate a QR code on the CTA/outro slide">Add QR Code</Label>
              <Switch
                checked={globalStyles.qrCodeEnabled}
                onCheckedChange={(v) => updateGlobalStyles({ qrCodeEnabled: v })}
                title="Toggle QR code on CTA slides"
                data-testid="qr-code-toggle"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs" title="Add a drop shadow behind CTA elements">Add Shadow</Label>
              <Switch
                checked={globalStyles.ctaShadow}
                onCheckedChange={(v) => updateGlobalStyles({ ctaShadow: v })}
                title="Toggle shadow on CTA elements"
                data-testid="cta-shadow-toggle"
              />
            </div>
          </div>

          {/* Custom Watermark */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground border-b pb-2">Custom Watermark</h4>

            <div className="flex items-center justify-between">
              <Label className="text-xs" title="Display your brand watermark on exported slides">Show Watermark</Label>
              <Switch
                checked={globalStyles.watermarkEnabled}
                onCheckedChange={(v) => updateGlobalStyles({ watermarkEnabled: v })}
                title="Toggle custom watermark visibility"
                data-testid="watermark-toggle"
              />
            </div>

            {globalStyles.watermarkEnabled && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground" title="Text to display as a watermark on slides">Watermark Text</Label>
                <Input
                  value={globalStyles.watermarkText || ""}
                  onChange={(e) => updateGlobalStyles({ watermarkText: e.target.value })}
                  placeholder="e.g. @yourbrand"
                  className="h-8 text-xs"
                  data-testid="watermark-text-input"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
