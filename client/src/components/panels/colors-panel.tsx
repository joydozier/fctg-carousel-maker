import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shuffle, Save, Check, Info, Pipette, Sparkles, Palette as PaletteIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  BRAND_FAMILIES,
  PALETTE_COLLECTIONS,
  isPaletteActive,
  type PalettePreset,
} from "@/lib/brand-palettes";

interface ColorsPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

const PALETTE_SLOT_LABELS = ["Background", "Accent", "Body Text", "Heading"] as const;

/** Validate / normalize a user-typed hex string. Accepts "#abc", "abc", "#aabbcc", "aabbcc". */
function normalizeHex(input: string): string | null {
  const v = input.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(v)) return null;
  if (v.length === 3) {
    return ("#" + v.split("").map((c) => c + c).join("")).toUpperCase();
  }
  return ("#" + v).toUpperCase();
}

export function ColorsPanel({ store }: ColorsPanelProps) {
  const { project, applyPaletteToAllSlides, updateGlobalStyles } = store;
  const { toast } = useToast();
  const [paletteName, setPaletteName] = useState("");
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [hexDraft, setHexDraft] = useState("");

  const { data: savedPalettes } = useQuery({
    queryKey: ["/api/palettes"],
  });

  const currentPalette = project.globalStyles.colorPalette;
  const alternateColors =
    project.globalStyles.alternateColors || ["#D4A537", "#08080A", "#B8944F", "#FFFFFF"];

  const updateColor = (index: number, color: string) => {
    const newPalette = [...currentPalette];
    newPalette[index] = color;
    applyPaletteToAllSlides(newPalette);
  };

  const updateAlternateColor = (index: number, color: string) => {
    const newAlternate = [...alternateColors];
    newAlternate[index] = color;
    updateGlobalStyles({ alternateColors: newAlternate });
  };

  const applyHexToActiveSlot = () => {
    const normalized = normalizeHex(hexDraft);
    if (!normalized) {
      toast({
        title: "Invalid hex",
        description: "Use #RGB or #RRGGBB",
        variant: "destructive",
      });
      return;
    }
    updateColor(activeSlot, normalized);
    setHexDraft("");
    toast({
      title: `${PALETTE_SLOT_LABELS[activeSlot]} updated`,
      description: normalized,
    });
  };

  const applyPreset = (preset: PalettePreset) => {
    applyPaletteToAllSlides([...preset.colors]);
    toast({ title: "Palette applied", description: preset.name });
  };

  const randomizePalette = () => {
    const hue = Math.random() * 360;
    const palette = [
      `hsl(${hue}, 30%, 15%)`,
      `hsl(${(hue + 40) % 360}, 70%, 55%)`,
      `hsl(${(hue + 20) % 360}, 20%, 85%)`,
      `hsl(${hue}, 10%, 95%)`,
    ];
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    const hexPalette = palette.map((hsl) => {
      ctx.fillStyle = hsl;
      ctx.fillRect(0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      const r = data[0],
        g = data[1],
        b = data[2];
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
        .toString(16)
        .padStart(2, "0")}`.toUpperCase();
    });
    applyPaletteToAllSlides(hexPalette);
  };

  const savePalette = async () => {
    if (!paletteName.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    try {
      await apiRequest("POST", "/api/palettes", {
        name: paletteName,
        colors: JSON.stringify(currentPalette),
        isBuiltIn: 0,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/palettes"] });
      setPaletteName("");
      toast({ title: "Saved", description: "Color palette saved" });
    } catch {
      toast({ title: "Error", description: "Failed to save palette", variant: "destructive" });
    }
  };

  const activePresetId = useMemo(() => {
    for (const collection of PALETTE_COLLECTIONS) {
      for (const preset of collection.presets) {
        if (isPaletteActive(currentPalette, preset)) return preset.id;
      }
    }
    return null;
  }, [currentPalette]);

  return (
    <div className="space-y-4" data-testid="colors-panel">
      {/* Active palette strip — always visible across all tabs so users see what they're editing */}
      <div className="space-y-2" data-testid="active-palette-strip">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-[#E2DDD5]">Current Palette</Label>
          <span className="text-[10px] text-[#8A8580]">Click a slot to edit</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {currentPalette.map((color, i) => (
            <div key={i} className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveSlot(i)}
                className={cn(
                  "block w-full aspect-square rounded-lg border-2 cursor-pointer relative overflow-hidden transition-all",
                  activeSlot === i
                    ? "border-[#D4A537] ring-2 ring-[#D4A537]/40 scale-[1.04]"
                    : "border-[#4A4B4D] hover:border-[#B8944F]"
                )}
                style={{ backgroundColor: color }}
                data-testid={`palette-slot-${i}`}
                title={`${PALETTE_SLOT_LABELS[i]} — ${color.toUpperCase()}`}
                aria-label={`Edit ${PALETTE_SLOT_LABELS[i]} color`}
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(i, e.target.value.toUpperCase())}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  data-testid={`color-swatch-${i}`}
                />
              </button>
              <div className="text-[9px] text-center text-[#8A8580] font-mono uppercase truncate">
                {PALETTE_SLOT_LABELS[i]}
              </div>
              <div className="text-[10px] text-center text-[#E2DDD5] font-mono">
                {color.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="brand" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-9">
          <TabsTrigger value="brand" className="text-[11px] gap-1" data-testid="colors-tab-brand">
            <Sparkles className="w-3 h-3" />
            Brand
          </TabsTrigger>
          <TabsTrigger value="combinations" className="text-[11px] gap-1" data-testid="colors-tab-combinations">
            <PaletteIcon className="w-3 h-3" />
            Combos
          </TabsTrigger>
          <TabsTrigger value="custom" className="text-[11px] gap-1" data-testid="colors-tab-custom">
            <Pipette className="w-3 h-3" />
            Custom
          </TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* BRAND TAB — FCTG palette grouped by family                    */}
        {/* ============================================================ */}
        <TabsContent value="brand" className="space-y-4 mt-4" data-testid="brand-tab-content">
          <div className="px-2.5 py-2 rounded-lg bg-[#D4A537]/10 border border-[#D4A537]/30">
            <p className="text-[10px] leading-relaxed text-[#E2DDD5]">
              <span className="font-semibold text-[#D4A537]">FCTG Brand Colors.</span>{" "}
              Tap any swatch to apply it to the{" "}
              <span className="font-semibold text-[#D4A537]">{PALETTE_SLOT_LABELS[activeSlot]}</span>{" "}
              slot above.
            </p>
          </div>

          {BRAND_FAMILIES.map((family) => (
            <div key={family.id} className="space-y-2" data-testid={`brand-family-${family.id}`}>
              <div>
                <Label className="text-xs font-semibold text-[#E2DDD5]">{family.title}</Label>
                {family.subtitle && (
                  <p className="text-[10px] text-[#8A8580] mt-0.5">{family.subtitle}</p>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {family.swatches.map((sw) => {
                  const isActive = (currentPalette[activeSlot] ?? "").toUpperCase() === sw.hex.toUpperCase();
                  return (
                    <TooltipProvider key={sw.hex}>
                      <Tooltip delayDuration={250}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => updateColor(activeSlot, sw.hex)}
                            className={cn(
                              "group relative aspect-square rounded-md border-2 transition-all overflow-hidden",
                              isActive
                                ? "border-[#D4A537] ring-2 ring-[#D4A537]/40 scale-105"
                                : "border-[#4A4B4D] hover:border-[#B8944F] hover:scale-105"
                            )}
                            style={{ backgroundColor: sw.hex }}
                            data-testid={`brand-swatch-${sw.hex.replace("#", "").toLowerCase()}`}
                            aria-label={`Apply ${sw.name} (${sw.hex}) to ${PALETTE_SLOT_LABELS[activeSlot]}`}
                          >
                            {isActive && (
                              <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Check className="w-4 h-4 text-white drop-shadow" strokeWidth={3} />
                              </span>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[200px]">
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold">{sw.name}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">{sw.hex}</p>
                            {sw.usage && <p className="text-[10px] text-muted-foreground">{sw.usage}</p>}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* ============================================================ */}
        {/* COMBINATIONS TAB — preset 4-color palettes                    */}
        {/* ============================================================ */}
        <TabsContent value="combinations" className="space-y-4 mt-4" data-testid="combinations-tab-content">
          <div className="px-2.5 py-2 rounded-lg bg-[#08080A]/40 border border-[#4A4B4D]">
            <p className="text-[10px] leading-relaxed text-[#8A8580]">
              One-click palettes. Each applies all four colors to your slides at once.
            </p>
          </div>

          {PALETTE_COLLECTIONS.map((collection) => (
            <div key={collection.id} className="space-y-2" data-testid={`palette-collection-${collection.id}`}>
              <div>
                <Label className="text-xs font-semibold text-[#E2DDD5]">{collection.title}</Label>
                {collection.subtitle && (
                  <p className="text-[10px] text-[#8A8580] mt-0.5">{collection.subtitle}</p>
                )}
              </div>
              <div className="space-y-1.5">
                {collection.presets.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={cn(
                        "w-full text-left p-2 rounded-lg border transition-all hover:scale-[1.01]",
                        isActive
                          ? "border-[#D4A537] bg-[#D4A537]/10"
                          : "border-[#4A4B4D] hover:border-[#B8944F]"
                      )}
                      data-testid={`preset-${preset.id}`}
                      aria-label={`Apply ${preset.name} palette`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-medium text-[#E2DDD5] flex-1 truncate">
                          {preset.name}
                        </span>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-[#D4A537]" strokeWidth={3} />
                        )}
                      </div>
                      <div className="flex gap-0.5 h-6 rounded overflow-hidden">
                        {preset.colors.map((c, j) => (
                          <div key={j} className="flex-1" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* ============================================================ */}
        {/* CUSTOM TAB — hex picker, randomize, alternate, saved presets   */}
        {/* ============================================================ */}
        <TabsContent value="custom" className="space-y-4 mt-4" data-testid="custom-tab-content">
          {/* Hex input */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[#E2DDD5]">
              Set {PALETTE_SLOT_LABELS[activeSlot]} by hex
            </Label>
            <div className="flex gap-1.5">
              <Input
                value={hexDraft}
                onChange={(e) => setHexDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyHexToActiveSlot();
                }}
                placeholder="#D4A537"
                className="h-9 text-xs font-mono bg-[#2D2E30] border-[#4A4B4D]"
                data-testid="hex-input"
                maxLength={7}
                spellCheck={false}
              />
              <Button
                type="button"
                onClick={applyHexToActiveSlot}
                size="sm"
                className="h-9 px-3 bg-[#D4A537] hover:bg-[#C49A3C] text-[#08080A] font-semibold"
                data-testid="apply-hex-btn"
              >
                Apply
              </Button>
            </div>
            <p className="text-[10px] text-[#8A8580]">
              Accepts #RGB or #RRGGBB. Press Enter or click Apply.
            </p>
          </div>

          {/* Randomize */}
          <Button
            variant="outline"
            size="sm"
            onClick={randomizePalette}
            className="w-full gap-1.5 text-xs h-9 border-[#4A4B4D] hover:border-[#B8944F]"
            data-testid="randomize-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Randomize Palette
          </Button>

          {/* Save preset */}
          <div className="space-y-2 pt-2 border-t border-[#4A4B4D]">
            <Label className="text-xs font-semibold text-[#E2DDD5]">Save current as preset</Label>
            <div className="flex gap-1.5">
              <Input
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                placeholder="My palette name"
                className="h-9 text-xs bg-[#2D2E30] border-[#4A4B4D]"
                data-testid="palette-name-input"
              />
              <Button
                onClick={savePalette}
                size="sm"
                className="h-9 px-3 bg-[#D4A537] hover:bg-[#C49A3C] text-[#08080A] font-semibold"
                data-testid="save-palette"
              >
                <Save className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* User-saved presets */}
          {(savedPalettes as any[])?.length ? (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#8A8580]">Your saved presets</Label>
              {(savedPalettes as any[]).map((palette: any) => {
                const colors: string[] =
                  typeof palette.colors === "string" ? JSON.parse(palette.colors) : palette.colors;
                const isActive = JSON.stringify(colors) === JSON.stringify(currentPalette);
                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => applyPaletteToAllSlides(colors)}
                    className={cn(
                      "w-full text-left p-2 rounded-lg border transition-colors",
                      isActive
                        ? "border-[#D4A537] bg-[#D4A537]/10"
                        : "border-[#4A4B4D] hover:border-[#B8944F]"
                    )}
                    data-testid={`saved-palette-${palette.id}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-medium text-[#E2DDD5] flex-1">
                        {palette.name}
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 text-[#D4A537]" strokeWidth={3} />}
                      {palette.isBuiltIn ? (
                        <span className="text-[9px] text-[#8A8580]">Built-in</span>
                      ) : null}
                    </div>
                    <div className="flex gap-0.5 h-5 rounded overflow-hidden">
                      {colors.map((c: string, j: number) => (
                        <div key={j} className="flex-1" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Alternate Colors */}
          <div className="space-y-3 pt-3 border-t border-[#4A4B4D]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs font-semibold text-[#E2DDD5]">Alternate Colors</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-[#8A8580] cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Used for alternating slide backgrounds</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                checked={project.globalStyles.alternateColorsEnabled}
                onCheckedChange={(v) => updateGlobalStyles({ alternateColorsEnabled: v })}
                className="data-[state=checked]:bg-[#D4A537]"
                data-testid="alternate-colors-toggle"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {alternateColors.map((color, i) => (
                <label
                  key={i}
                  className={cn(
                    "block w-full aspect-square rounded-lg border-2 cursor-pointer relative overflow-hidden transition-all",
                    project.globalStyles.alternateColorsEnabled
                      ? "border-[#4A4B4D] hover:border-[#B8944F]"
                      : "border-[#4A4B4D] opacity-50"
                  )}
                  style={{ backgroundColor: color }}
                >
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateAlternateColor(i, e.target.value.toUpperCase())}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={!project.globalStyles.alternateColorsEnabled}
                    data-testid={`alternate-color-${i}`}
                  />
                </label>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
