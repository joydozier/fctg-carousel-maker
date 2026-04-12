import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Shuffle, Save, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

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

  const updateColor = (index: number, color: string) => {
    const newPalette = [...currentPalette];
    newPalette[index] = color;
    applyPaletteToAllSlides(newPalette);
  };

  const randomizePalette = () => {
    const hue = Math.random() * 360;
    const palette = [
      `hsl(${hue}, 30%, 15%)`,
      `hsl(${(hue + 40) % 360}, 70%, 55%)`,
      `hsl(${(hue + 20) % 360}, 20%, 85%)`,
      `hsl(${hue}, 10%, 95%)`,
    ];
    // Convert HSL to hex
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    const hexPalette = palette.map(hsl => {
      ctx.fillStyle = hsl;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
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
      <h3 className="text-sm font-semibold">Colors</h3>

      <Tabs defaultValue="custom">
        <TabsList className="w-full">
          <TabsTrigger value="custom" className="flex-1 text-xs">Custom</TabsTrigger>
          <TabsTrigger value="presets" className="flex-1 text-xs">Presets</TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="space-y-4 mt-4">
          {/* Color swatches */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Active Palette</Label>
            <div className="grid grid-cols-4 gap-2">
              {currentPalette.map((color, i) => (
                <div key={i} className="space-y-1">
                  <label
                    className="color-swatch block w-full aspect-square rounded-lg border cursor-pointer relative overflow-hidden"
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
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={randomizePalette} className="flex-1 gap-1.5 text-xs" data-testid="randomize-colors">
              <Shuffle className="w-3.5 h-3.5" />
              Randomize
            </Button>
          </div>

          {/* Save as preset */}
          <div className="space-y-2 pt-2 border-t">
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
        </TabsContent>

        <TabsContent value="presets" className="space-y-3 mt-4">
          {(savedPalettes as any[])?.map((palette: any) => {
            const colors: string[] = typeof palette.colors === "string" ? JSON.parse(palette.colors) : palette.colors;
            const isActive = JSON.stringify(colors) === JSON.stringify(currentPalette);
            return (
              <button
                key={palette.id}
                onClick={() => applyPaletteToAllSlides(colors)}
                className={`w-full text-left p-2 rounded-lg border transition-colors hover:bg-accent ${isActive ? "border-primary bg-accent" : "border-transparent"}`}
                data-testid={`palette-${palette.id}`}
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
