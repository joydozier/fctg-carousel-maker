import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { FONT_PAIRS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Upload, Italic, Bold, Type } from "lucide-react";
import { cn } from "@/lib/utils";

const TEXT_SHADOW_PRESETS = [
  { id: "none", label: "None", value: "" },
  { id: "subtle", label: "Subtle", value: "0 1px 2px rgba(0,0,0,0.3)" },
  { id: "medium", label: "Medium", value: "0 2px 4px rgba(0,0,0,0.5)" },
  { id: "strong", label: "Strong", value: "0 3px 8px rgba(0,0,0,0.7)" },
  { id: "glow", label: "Glow", value: "0 0 10px rgba(212,165,55,0.6)" },
  { id: "outline", label: "Outline", value: "1px 1px 0 rgba(0,0,0,0.8), -1px -1px 0 rgba(0,0,0,0.8), 1px -1px 0 rgba(0,0,0,0.8), -1px 1px 0 rgba(0,0,0,0.8)" },
];

interface TextPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

const FONT_SIZE_PRESETS = [
  { label: "Aa", heading: 36, body: 18, key: "small" },
  { label: "Aa", heading: 48, body: 24, key: "medium" },
  { label: "Aa", heading: 64, body: 28, key: "large" },
];

export function TextPanel({ store }: TextPanelProps) {
  const { project, updateGlobalStyles, updateElement, currentSlide } = store;
  const { globalStyles } = project;
  const fontInputRef = useRef<HTMLInputElement>(null);

  // Build an augmented font pair list that includes any uploaded custom fonts
  const customFontPairs = (globalStyles.customFontFiles || []).map((f) => ({
    heading: f.name,
    body: f.name,
    label: `${f.name} (Custom)`,
  }));
  const allFontPairs = [...FONT_PAIRS, ...customFontPairs];

  const currentPairLabel = allFontPairs.find(
    (p) => p.heading === globalStyles.headingFont && p.body === globalStyles.bodyFont
  )?.label || `${globalStyles.headingFont} / ${globalStyles.bodyFont}`;

  const applyFontPair = (heading: string, body: string) => {
    updateGlobalStyles({ headingFont: heading, bodyFont: body });
    project.slides.forEach((slide) => {
      slide.elements.forEach((el) => {
        if (el.type === "heading" || el.type === "subtitle") {
          updateElement(slide.id, el.id, { fontFamily: heading });
        } else if (el.type === "body" || el.type === "cta") {
          updateElement(slide.id, el.id, { fontFamily: body });
        }
      });
    });
  };

  const applyFontSizePreset = (heading: number, body: number) => {
    updateGlobalStyles({ headingFontSize: heading, bodyFontSize: body });
    project.slides.forEach((slide) => {
      slide.elements.forEach((el) => {
        if (el.type === "heading") {
          updateElement(slide.id, el.id, { fontSize: heading });
        } else if (el.type === "body") {
          updateElement(slide.id, el.id, { fontSize: body });
        }
      });
    });
  };

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    // Strip extension for the font-family name
    const fontName = file.name.replace(/\.(ttf|otf|woff2?)$/i, "");

    // Inject @font-face into the document
    const style = document.createElement("style");
    style.textContent = `@font-face { font-family: "${fontName}"; src: url("${blobUrl}"); }`;
    document.head.appendChild(style);

    // Persist the font reference in globalStyles
    const existing = globalStyles.customFontFiles || [];
    updateGlobalStyles({
      customFontFiles: [...existing, { name: fontName, url: blobUrl }],
    });

    // Reset input so the same file can be re-uploaded if needed
    e.target.value = "";
  };

  return (
    <div className="space-y-5" data-testid="text-panel">
      {/* Hidden font file input */}
      <input
        ref={fontInputRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        className="hidden"
        onChange={handleFontUpload}
        data-testid="font-file-input"
      />

      {/* Upload Custom Fonts promo (PostNitro style) */}
      <div className="rounded-xl border border-dashed border-primary/30 p-4 space-y-2 bg-primary/5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">Upload Custom Fonts</span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#D4A537]/10 text-[#D4A537] text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A537]" />
            NEW
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You can upload your own fonts files and use them in your design by enabling custom font pairing.
        </p>
        <Button
          size="sm"
          className="w-full gap-2 bg-[#D4A537] hover:bg-[#C49A3C] text-white"
          data-testid="upload-fonts-btn"
          onClick={() => fontInputRef.current?.click()}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Custom Fonts
        </Button>

        {/* List of uploaded custom fonts */}
        {(globalStyles.customFontFiles || []).length > 0 && (
          <div className="space-y-1 pt-1">
            {(globalStyles.customFontFiles || []).map((f) => (
              <div
                key={f.name}
                className="flex items-center justify-between text-[10px] text-muted-foreground"
              >
                <span style={{ fontFamily: f.name }}>{f.name}</span>
                <span className="text-[#D4A537]">✓ loaded</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Font Pair (PostNitro style dropdown) */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Font Pair</Label>
        <Select
          value={`${globalStyles.headingFont}|${globalStyles.bodyFont}`}
          onValueChange={(val) => {
            const [h, b] = val.split("|");
            applyFontPair(h, b);
          }}
        >
          <SelectTrigger className="h-10 text-sm font-mono" data-testid="font-pair-select">
            <SelectValue>
              <span className="flex items-center gap-1">
                <span style={{ fontFamily: globalStyles.headingFont }}>{globalStyles.headingFont}</span>
                <span className="text-muted-foreground">/</span>
                <span style={{ fontFamily: globalStyles.bodyFont }} className="text-muted-foreground">{globalStyles.bodyFont}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {allFontPairs.map((pair) => (
              <SelectItem key={pair.label} value={`${pair.heading}|${pair.body}`}>
                <span className="flex items-center gap-1">
                  <span style={{ fontFamily: pair.heading }} className="font-semibold">{pair.heading}</span>
                  <span className="text-muted-foreground">/</span>
                  <span style={{ fontFamily: pair.body }} className="text-muted-foreground">{pair.body}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom Fonts Pairing toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">Custom Fonts Pairing</Label>
        <Switch
          checked={globalStyles.customFontPairing}
          onCheckedChange={(v) => updateGlobalStyles({ customFontPairing: v })}
          data-testid="custom-font-pairing-toggle"
        />
      </div>

      {/* Font Size section */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Font Size</Label>

        {/* Set Custom Font Sizes toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Set Custom Font Sizes</Label>
          <Switch
            checked={globalStyles.customFontSizes}
            onCheckedChange={(v) => updateGlobalStyles({ customFontSizes: v })}
            data-testid="custom-font-sizes-toggle"
          />
        </div>

        {/* Size preset buttons (Aa Aa Aa) */}
        <div className="flex gap-2">
          {FONT_SIZE_PRESETS.map((preset, i) => {
            const isActive = globalStyles.headingFontSize === preset.heading;
            return (
              <button
                key={preset.key}
                onClick={() => applyFontSizePreset(preset.heading, preset.body)}
                className={cn(
                  "flex-1 py-2 rounded-lg border text-center transition-colors",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-accent"
                )}
                data-testid={`font-size-${preset.key}`}
              >
                <span
                  className="font-semibold"
                  style={{ fontSize: i === 0 ? 12 : i === 1 ? 14 : 16 }}
                >
                  Aa
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom font size sliders (only when custom sizes enabled) */}
        {globalStyles.customFontSizes && (
          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Heading: {globalStyles.headingFontSize}px</Label>
              <Slider
                value={[globalStyles.headingFontSize]}
                min={24}
                max={96}
                step={1}
                onValueChange={([v]) => {
                  updateGlobalStyles({ headingFontSize: v });
                  project.slides.forEach((slide) => {
                    slide.elements.forEach((el) => {
                      if (el.type === "heading") updateElement(slide.id, el.id, { fontSize: v });
                    });
                  });
                }}
                data-testid="heading-font-size-slider"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Body: {globalStyles.bodyFontSize}px</Label>
              <Slider
                value={[globalStyles.bodyFontSize]}
                min={12}
                max={48}
                step={1}
                onValueChange={([v]) => {
                  updateGlobalStyles({ bodyFontSize: v });
                  project.slides.forEach((slide) => {
                    slide.elements.forEach((el) => {
                      if (el.type === "body") updateElement(slide.id, el.id, { fontSize: v });
                    });
                  });
                }}
                data-testid="body-font-size-slider"
              />
            </div>
          </div>
        )}
      </div>

      {/* Selected element text controls */}
      {store.selectedElementId && currentSlide && (() => {
        const el = currentSlide.elements.find((e) => e.id === store.selectedElementId);
        if (!el || !["heading", "subtitle", "body", "cta"].includes(el.type)) return null;

        return (
          <div className="space-y-3 pt-3 border-t">
            <Label className="text-xs text-muted-foreground font-semibold">Selected Element</Label>

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

            {/* Line Height slider */}
            <div className="space-y-2">
              <Label className="text-[11px]">Line Height: {(el.lineHeight ?? 1.4).toFixed(1)}</Label>
              <Slider
                value={[el.lineHeight ?? 1.4]}
                min={1.0}
                max={2.5}
                step={0.1}
                onValueChange={([v]) => updateElement(currentSlide.id, el.id, { lineHeight: v })}
                data-testid="element-line-height"
              />
            </div>

            {/* Letter Spacing slider */}
            <div className="space-y-2">
              <Label className="text-[11px]">Letter Spacing: {(el.letterSpacing ?? 0).toFixed(1)}px</Label>
              <Slider
                value={[el.letterSpacing ?? 0]}
                min={-2}
                max={10}
                step={0.5}
                onValueChange={([v]) => updateElement(currentSlide.id, el.id, { letterSpacing: v })}
                data-testid="element-letter-spacing"
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

            {/* Font Style Toolbar — Bold + Italic toggles */}
            <div className="space-y-2">
              <Label className="text-[11px]">Font Style</Label>
              <div className="flex gap-1">
                <Button
                  variant={Number(el.fontWeight || "400") >= 700 ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs gap-1.5"
                  onClick={() => {
                    const current = Number(el.fontWeight || "400");
                    updateElement(currentSlide.id, el.id, { fontWeight: current >= 700 ? "400" : "700" });
                  }}
                  data-testid="toggle-bold"
                  title="Toggle bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                  Bold
                </Button>
                <Button
                  variant={el.fontStyle === "italic" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs gap-1.5"
                  onClick={() => {
                    updateElement(currentSlide.id, el.id, {
                      fontStyle: el.fontStyle === "italic" ? "normal" : "italic",
                    });
                  }}
                  data-testid="toggle-italic"
                  title="Toggle italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                  Italic
                </Button>
              </div>
            </div>

            {/* Text Shadow */}
            <div className="space-y-2">
              <Label className="text-[11px]">Text Shadow</Label>
              <div className="grid grid-cols-3 gap-1">
                {TEXT_SHADOW_PRESETS.map((preset) => {
                  const isActive = (el.textShadow || "") === preset.value;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => updateElement(currentSlide.id, el.id, { textShadow: preset.value })}
                      className={cn(
                        "px-2 py-1.5 rounded-md border text-[10px] font-medium transition-colors",
                        isActive
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:bg-accent text-muted-foreground"
                      )}
                      data-testid={`text-shadow-${preset.id}`}
                      title={preset.value || "No shadow"}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
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
