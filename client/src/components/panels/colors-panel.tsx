import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shuffle, Save, Check, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ColorsPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

export function ColorsPanel({ store }: ColorsPanelProps) {
  const { project, applyPaletteToAllSlides, updateGlobalStyles } = store;
  const { toast } = useToast();
  const [paletteName, setPaletteName] = useState("");

  const { data: savedPalettes } = useQuery({
    queryKey: ["/api/palettes"],
  });

  const currentPalette = project.globalStyles.colorPalette;
  const alternateColors = project.globalStyles.alternateColors || ["#D4A537", "#08080A", "#B8944F", "#FFFFFF"];

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
      const r = data[0], g = data[1], b = data[2];
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
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

  return (
    <div className="space-y-5" data-testid="colors-panel">
      <Tabs defaultValue="custom">
        <TabsList className="w-full">
          <TabsTrigger value="custom" className="flex-1 text-xs" data-testid="colors-tab-custom">
            Custom
          </TabsTrigger>
          <TabsTrigger value="presets" className="flex-1 text-xs" data-testid="colors-tab-presets">
            Preset
          </TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="space-y-4 mt-4">
          {/* Custom toggle (PostNitro style) */}
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Custom</Label>
            <Switch
              checked={true}
              className="data-[state=checked]:bg-[#D4A537]"
              data-testid="custom-colors-toggle"
            />
          </div>

          {/* Color swatches — 4 swatches in a row */}
          <div className="grid grid-cols-4 gap-2">
            {currentPalette.map((color, i) => (
              <div key={i} className="space-y-1">
                <label
                  className="color-swatch block w-full aspect-square rounded-lg border-2 border-border cursor-pointer relative overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all"
                  style={{ backgroundColor: color }}
                >
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(i, e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    data-testid={`color-swatch-${i}`}
                  />
                </label>
                <div className="text-[10px] text-center text-muted-foreground font-mono">
                  {color.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          {/* Save as Color Preset (PostNitro green button style) */}
          <Button
            onClick={savePalette}
            size="sm"
            className="w-full gap-2 bg-[#D4A537] hover:bg-[#C49A3C] text-[#08080A] font-semibold border border-[#B8944F]"
            data-testid="save-color-preset-btn"
          >
            <Save className="w-3.5 h-3.5" />
            Save as Color Preset
          </Button>

          {/* Presets section */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Presets</Label>
            {(savedPalettes as any[])?.length ? (
              <div className="space-y-1.5">
                {(savedPalettes as any[]).map((palette: any) => {
                  const colors: string[] =
                    typeof palette.colors === "string" ? JSON.parse(palette.colors) : palette.colors;
                  const isActive = JSON.stringify(colors) === JSON.stringify(currentPalette);
                  return (
                    <button
                      key={palette.id}
                      onClick={() => applyPaletteToAllSlides(colors)}
                      className={cn(
                        "w-full text-left p-2 rounded-lg border transition-colors hover:bg-accent",
                        isActive ? "border-primary bg-accent" : "border-transparent"
                      )}
                      data-testid={`palette-${palette.id}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium flex-1">{palette.name}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <div className="flex gap-1">
                        {colors.map((c: string, j: number) => (
                          <div
                            key={j}
                            className="h-5 flex-1 rounded-sm first:rounded-l-md last:rounded-r-md"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Save your color presets to reuse.</p>
            )}
          </div>

          {/* Alternate Colors (PostNitro style) */}
          <div className="space-y-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs font-semibold">Alternate Colors</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Alternate colors are used for alternating slide backgrounds</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                checked={project.globalStyles.alternateColorsEnabled}
                onCheckedChange={(v) => updateGlobalStyles({ alternateColorsEnabled: v })}
                data-testid="alternate-colors-toggle"
              />
            </div>

            {/* Alternate color swatches */}
            <div className="grid grid-cols-4 gap-2">
              {alternateColors.map((color, i) => (
                <label
                  key={i}
                  className={cn(
                    "block w-full aspect-square rounded-lg border-2 cursor-pointer relative overflow-hidden transition-all",
                    project.globalStyles.alternateColorsEnabled
                      ? "border-border hover:ring-2 hover:ring-primary/30"
                      : "border-border opacity-50"
                  )}
                  style={{ backgroundColor: color }}
                >
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateAlternateColor(i, e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={!project.globalStyles.alternateColorsEnabled}
                    data-testid={`alternate-color-${i}`}
                  />
                </label>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="presets" className="space-y-3 mt-4">
          {/* Randomize button */}
          <Button
            variant="outline"
            size="sm"
            onClick={randomizePalette}
            className="w-full gap-1.5 text-xs"
            data-testid="randomize-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Randomize
          </Button>

          {/* Save as preset */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Save as Preset</Label>
            <div className="flex gap-2">
              <Input
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                placeholder="Palette name"
                className="h-8 text-xs"
                data-testid="palette-name-input"
              />
              <Button variant="outline" size="sm" onClick={savePalette} data-testid="save-palette">
                <Save className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {(savedPalettes as any[])?.map((palette: any) => {
            const colors: string[] =
              typeof palette.colors === "string" ? JSON.parse(palette.colors) : palette.colors;
            const isActive = JSON.stringify(colors) === JSON.stringify(currentPalette);
            return (
              <button
                key={palette.id}
                onClick={() => applyPaletteToAllSlides(colors)}
                className={cn(
                  "w-full text-left p-2 rounded-lg border transition-colors hover:bg-accent",
                  isActive ? "border-primary bg-accent" : "border-transparent"
                )}
                data-testid={`preset-palette-${palette.id}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium flex-1">{palette.name}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-primary" />}
                  {palette.isBuiltIn ? (
                    <span className="text-[10px] text-muted-foreground">Built-in</span>
                  ) : null}
                </div>
                <div className="flex gap-1">
                  {colors.map((c: string, i: number) => (
                    <div
                      key={i}
                      className="h-6 flex-1 rounded-sm first:rounded-l-md last:rounded-r-md"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
