import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface BrandPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

export function BrandPanel({ store }: BrandPanelProps) {
  const { project, updateGlobalStyles } = store;
  const { globalStyles } = project;

  return (
    <div className="space-y-5" data-testid="brand-panel">
      <h3 className="text-sm font-semibold">Branding</h3>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Show Branding</Label>
        <Switch
          checked={globalStyles.brandingEnabled}
          onCheckedChange={(v) => updateGlobalStyles({ brandingEnabled: v })}
          data-testid="branding-toggle"
        />
      </div>

      {globalStyles.brandingEnabled && (
        <>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Brand Name</Label>
            <Input
              value={globalStyles.brandName}
              onChange={(e) => updateGlobalStyles({ brandName: e.target.value })}
              className="h-8 text-xs"
              data-testid="brand-name-input"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Brand Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={globalStyles.brandColor}
                onChange={(e) => updateGlobalStyles({ brandColor: e.target.value })}
                className="w-8 h-8 rounded border cursor-pointer"
                data-testid="brand-color-picker"
              />
              <Input
                value={globalStyles.brandColor}
                onChange={(e) => updateGlobalStyles({ brandColor: e.target.value })}
                className="h-8 text-xs font-mono flex-1"
              />
            </div>
          </div>
        </>
      )}

      <div className="space-y-3 pt-3 border-t">
        <h4 className="text-xs font-semibold text-muted-foreground">Slide Numbers</h4>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Numbers</Label>
          <Switch
            checked={globalStyles.slideNumberEnabled}
            onCheckedChange={(v) => updateGlobalStyles({ slideNumberEnabled: v })}
            data-testid="slide-number-toggle"
          />
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t">
        <h4 className="text-xs font-semibold text-muted-foreground">Swipe Indicator</h4>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Swipe</Label>
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
