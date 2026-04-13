import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

const BRAND_SIZE_PRESETS = [
  { key: "small", label: "Aa", fontSize: 12 },
  { key: "medium", label: "Aa", fontSize: 14 },
  { key: "large", label: "Aa", fontSize: 16 },
];

export function BrandPanel({ store }: BrandPanelProps) {
  const { project, updateGlobalStyles } = store;
  const { globalStyles } = project;
  const [configurationsOpen, setConfigurationsOpen] = useState(true);

  return (
    <div className="space-y-4" data-testid="brand-panel">
      {/* Brand preview card (PostNitro style) */}
      <div className="rounded-xl border p-4 space-y-3 bg-card">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
            style={{
              backgroundColor: globalStyles.brandColor,
              color: project.globalStyles.colorPalette[0] || "#000",
              borderRadius: `${globalStyles.brandRoundness}%`,
              border: globalStyles.brandBorder ? "2px solid currentColor" : undefined,
              boxShadow: globalStyles.brandShadow ? "0 2px 8px rgba(0,0,0,0.15)" : undefined,
            }}
            data-testid="brand-avatar-preview"
          >
            {globalStyles.brandName?.charAt(0) || "F"}
          </div>
          <div className="flex-1 min-w-0">
            <Input
              value={globalStyles.brandName}
              onChange={(e) => updateGlobalStyles({ brandName: e.target.value })}
              className="h-7 text-sm font-semibold bg-transparent border-transparent hover:border-border focus:border-primary p-0"
              data-testid="brand-name-input"
            />
            <Input
              value={globalStyles.brandHandle || ""}
              onChange={(e) => updateGlobalStyles({ brandHandle: e.target.value })}
              placeholder="@yourbrand"
              className="h-6 text-xs text-muted-foreground bg-transparent border-transparent hover:border-border focus:border-primary p-0"
              data-testid="brand-handle-input"
            />
          </div>
        </div>
      </div>

      {/* Configurations collapsible (PostNitro style) */}
      <button
        onClick={() => setConfigurationsOpen(!configurationsOpen)}
        className="w-full flex items-center justify-between py-2 text-xs text-muted-foreground font-medium"
        data-testid="configurations-toggle"
      >
        <span className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border w-16" />
          Configurations
          <div className="h-px flex-1 bg-border w-16" />
        </span>
        {configurationsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {configurationsOpen && (
        <div className="space-y-3">
          {/* Show Branding */}
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Show Branding</Label>
            <Switch
              checked={globalStyles.brandingEnabled}
              onCheckedChange={(v) => updateGlobalStyles({ brandingEnabled: v })}
              className="data-[state=checked]:bg-[#D4A537]"
              data-testid="branding-toggle"
            />
          </div>

          {/* Only in Intro and Outro slides */}
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Only in Intro and Outro slides</Label>
            <Switch
              checked={globalStyles.brandOnlyIntroOutro}
              onCheckedChange={(v) => updateGlobalStyles({ brandOnlyIntroOutro: v })}
              data-testid="brand-intro-outro-toggle"
            />
          </div>

          {/* Add Border */}
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Add Border</Label>
            <Switch
              checked={globalStyles.brandBorder}
              onCheckedChange={(v) => updateGlobalStyles({ brandBorder: v })}
              data-testid="brand-border-toggle"
            />
          </div>

          {/* Add Shadow */}
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Add Shadow</Label>
            <Switch
              checked={globalStyles.brandShadow}
              onCheckedChange={(v) => updateGlobalStyles({ brandShadow: v })}
              data-testid="brand-shadow-toggle"
            />
          </div>

          {/* Custom Color */}
          <div className="rounded-xl border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Custom Color</Label>
              <Switch
                checked={globalStyles.brandCustomColor}
                onCheckedChange={(v) => updateGlobalStyles({ brandCustomColor: v })}
                data-testid="brand-custom-color-toggle"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={globalStyles.brandCustomColor ? globalStyles.brandCustomColorValue : globalStyles.brandColor}
                onChange={(e) =>
                  updateGlobalStyles({
                    brandCustomColorValue: e.target.value,
                    ...(globalStyles.brandCustomColor ? { brandColor: e.target.value } : {}),
                  })
                }
                className="w-8 h-8 rounded border cursor-pointer"
                data-testid="brand-custom-color-picker"
              />
              <Input
                value={globalStyles.brandCustomColor ? globalStyles.brandCustomColorValue : globalStyles.brandColor}
                onChange={(e) =>
                  updateGlobalStyles({
                    brandCustomColorValue: e.target.value,
                    ...(globalStyles.brandCustomColor ? { brandColor: e.target.value } : {}),
                  })
                }
                className="h-8 text-xs font-mono flex-1"
                data-testid="brand-custom-color-input"
              />
              <button
                className="w-8 h-8 flex items-center justify-center rounded border hover:bg-accent transition-colors"
                onClick={() =>
                  updateGlobalStyles({
                    brandCustomColorValue: globalStyles.brandColor,
                  })
                }
                data-testid="brand-color-reset"
              >
                <RefreshCw className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Roundness */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Roundness</Label>
            <Slider
              value={[globalStyles.brandRoundness]}
              min={0}
              max={50}
              step={1}
              onValueChange={([v]) => updateGlobalStyles({ brandRoundness: v })}
              className="[&_[data-testid]]:bg-[#D4A537]"
              data-testid="brand-roundness-slider"
            />
          </div>

          {/* Branding Size */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold">Branding Size</Label>

            {/* Custom Branding Size toggle */}
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Custom Branding Size</Label>
              <Switch
                checked={globalStyles.brandCustomSize}
                onCheckedChange={(v) => updateGlobalStyles({ brandCustomSize: v })}
                data-testid="brand-custom-size-toggle"
              />
            </div>

            {/* Size preset buttons (Aa Aa Aa) */}
            <div className="flex gap-2">
              {BRAND_SIZE_PRESETS.map((preset) => {
                const isActive = globalStyles.brandSizePreset === preset.key;
                return (
                  <button
                    key={preset.key}
                    onClick={() => updateGlobalStyles({ brandSizePreset: preset.key as any })}
                    className={cn(
                      "flex-1 py-2 rounded-lg border text-center transition-colors",
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:bg-accent"
                    )}
                    data-testid={`brand-size-${preset.key}`}
                  >
                    <span className="font-semibold" style={{ fontSize: preset.fontSize }}>
                      Aa
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Slide Numbers section */}
      <div className="space-y-3 pt-3 border-t">
        <h4 className="text-xs font-semibold text-muted-foreground">Slide Numbers</h4>
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Show Numbers</Label>
          <Switch
            checked={globalStyles.slideNumberEnabled}
            onCheckedChange={(v) => updateGlobalStyles({ slideNumberEnabled: v })}
            data-testid="slide-number-toggle"
          />
        </div>
      </div>

      {/* Swipe Indicator section */}
      <div className="space-y-3 pt-3 border-t">
        <h4 className="text-xs font-semibold text-muted-foreground">Swipe Indicator</h4>
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Show Swipe</Label>
          <Switch
            checked={globalStyles.swipeIndicatorEnabled}
            onCheckedChange={(v) => updateGlobalStyles({ swipeIndicatorEnabled: v })}
            data-testid="swipe-toggle"
          />
        </div>
        {globalStyles.swipeIndicatorEnabled && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Swipe Text</Label>
            <Input
              value={globalStyles.swipeText}
              onChange={(e) => updateGlobalStyles({ swipeText: e.target.value })}
              className="h-8 text-xs"
              data-testid="swipe-text-input"
            />
          </div>
        )}
      </div>
    </div>
  );
}
