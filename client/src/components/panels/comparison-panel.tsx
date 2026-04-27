import { useState } from "react";
import { Plus, Trash2, ArrowLeftRight, Sparkles, GitCompare, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  COMPARISON_SWATCHES,
  buildComparisonTheme,
  type ComparisonIcon,
  type ComparisonSide,
  type ComparisonGlobalSettings,
  type ComparisonTheme,
  type Slide,
} from "@/lib/types";
import { ComparisonIconSvg, swapComparisonSides, type ComparisonFocusTarget } from "@/components/ComparisonSlide";

/* ── Constants ─────────────────────────────────────────────────────────── */
const ICON_KEYS: ComparisonIcon[] = ["check", "x", "alert", "idea", "star", "trend-up", "heart", "user"];
const ICON_LABELS: Record<ComparisonIcon, string> = {
  check: "Check",
  x: "X",
  alert: "Alert",
  idea: "Idea",
  star: "Star",
  "trend-up": "Trend Up",
  heart: "Heart",
  user: "User",
};

const PRESETS: { id: ComparisonTheme; label: string; icon: typeof Sparkles; tagline: string }[] = [
  { id: "pro-con", label: "Pros vs Cons", icon: Sparkles, tagline: "Green vs red" },
  { id: "before-after", label: "Before vs After", icon: GitCompare, tagline: "Transformation" },
  { id: "competitor", label: "Competitor", icon: Briefcase, tagline: "Pro corporate" },
];

const FONT_OPTIONS = ["General Sans", "Clash Display", "Cabinet Grotesk", "Playfair Display", "Montserrat", "Poppins", "Bebas Neue"];

/* ── Context-aware placeholders by preset ──────────────────────────────── */
function getPlaceholders(theme: ComparisonTheme, side: "left" | "right"): { subheading: string; item: string } {
  switch (theme) {
    case "pro-con":
      return side === "left"
        ? { subheading: "Pros", item: "Example: Fast results" }
        : { subheading: "Cons", item: "Example: High cost" };
    case "before-after":
      return side === "left"
        ? { subheading: "Before", item: "Example: Stuck in old patterns" }
        : { subheading: "After", item: "Example: Clear vision" };
    case "competitor":
      return side === "left"
        ? { subheading: "Us", item: "Example: Proven framework" }
        : { subheading: "Them", item: "Example: Generic templates" };
    case "custom":
    default:
      return side === "left"
        ? { subheading: "Option A", item: "Add a point…" }
        : { subheading: "Option B", item: "Add a point…" };
  }
}

/* ── Small UI primitives ───────────────────────────────────────────────── */
function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#B8944F] mt-1">{children}</h4>;
}

function SwatchGrid({
  value,
  onChange,
  onFocus,
  onBlur,
  alpha,
}: {
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /** When set, output is rgba(...) with this alpha (0-1) instead of hex */
  alpha?: number;
}) {
  return (
    <div className="grid grid-cols-6 gap-1.5" onFocus={onFocus} onBlur={onBlur}>
      {COMPARISON_SWATCHES.map((s) => {
        const out = alpha != null ? hexToRgba(s.value, alpha) : s.value;
        const selected = normalizeColor(value) === normalizeColor(out);
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => {
              onFocus?.();
              onChange(out);
            }}
            className={cn(
              "h-7 w-full rounded-md border transition-all",
              selected ? "ring-2 ring-[#D4A537] ring-offset-1 ring-offset-[#2D2E30] border-transparent" : "border-[#4A4B4D] hover:border-[#B8944F]"
            )}
            style={{ background: s.value }}
            title={s.name}
            data-testid={`swatch-${s.name.toLowerCase().replace(/\s+/g, "-")}`}
          />
        );
      })}
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function normalizeColor(c: string): string {
  return c.replace(/\s+/g, "").toLowerCase();
}

/* ── Main panel ────────────────────────────────────────────────────────── */
export function ComparisonPanel({
  slide,
  updateSlide,
}: {
  slide: Slide;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
}) {
  const fallback = buildComparisonTheme(slide.comparisonGlobal?.theme || "custom");
  const global: ComparisonGlobalSettings = slide.comparisonGlobal || fallback.global;
  const left: ComparisonSide = slide.comparisonLeft || fallback.left;
  const right: ComparisonSide = slide.comparisonRight || fallback.right;

  /* Focus-sync target — passed into the slide as a hidden field */
  const [focus, setFocus] = useState<ComparisonFocusTarget>(null);
  const setFocusAndPropagate = (t: ComparisonFocusTarget) => {
    setFocus(t);
    updateSlide(slide.id, { __comparisonFocus: t } as any);
    // Auto-clear after the pulse animation runs (~2.4s)
    if (t) {
      window.setTimeout(() => {
        setFocus(null);
        updateSlide(slide.id, { __comparisonFocus: null } as any);
      }, 2600);
    }
  };

  const updateGlobal = (patch: Partial<ComparisonGlobalSettings>) =>
    updateSlide(slide.id, { comparisonGlobal: { ...global, ...patch } });
  const updateLeft = (patch: Partial<ComparisonSide>) =>
    updateSlide(slide.id, { comparisonLeft: { ...left, ...patch } });
  const updateRight = (patch: Partial<ComparisonSide>) =>
    updateSlide(slide.id, { comparisonRight: { ...right, ...patch } });

  const applyPreset = (theme: ComparisonTheme) => {
    const p = buildComparisonTheme(theme);
    updateSlide(slide.id, {
      comparisonGlobal: p.global,
      comparisonLeft: p.left,
      comparisonRight: p.right,
    });
  };

  const handleSwap = () => {
    const swap = swapComparisonSides(slide);
    if (swap.comparisonLeft && swap.comparisonRight) {
      updateSlide(slide.id, swap);
    }
  };

  /* SideEditor is a top-level component (declared at the bottom of this file)
     so its identity is stable across parent re-renders — inputs keep focus and
     accept keystrokes properly. */

  return (
    <div className="space-y-3" data-testid="comparison-panel">
      {/* Quick-Start Presets */}
      <div className="bg-[#2D2E30] rounded-xl p-3 space-y-2">
        <SectionHeader>Quick-Start Presets</SectionHeader>
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map((p) => {
            const Icon = p.icon;
            const active = global.theme === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-1 rounded-lg border transition-all text-[10px] font-medium",
                  active
                    ? "border-[#D4A537] bg-[#D4A537]/10 text-[#D4A537]"
                    : "border-[#4A4B4D] text-[#8A8580] hover:border-[#B8944F] hover:text-[#E2DDD5]"
                )}
                data-testid={`comparison-preset-${p.id}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-center leading-tight">{p.label}</span>
                <span className="text-[9px] text-[#6A6560]">{p.tagline}</span>
              </button>
            );
          })}
        </div>

        {/* Magic Swap */}
        <button
          type="button"
          onClick={handleSwap}
          className="w-full mt-1 h-9 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#D4A537] to-[#B8944F] text-[#08080A] text-xs font-bold hover:brightness-110 active:scale-[0.99] transition-all shadow-sm"
          data-testid="comparison-magic-swap"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Magic Swap (flip Left ↔ Right)
        </button>
      </div>

      {/* Global Settings */}
      <div className="bg-[#2D2E30] rounded-xl p-3 space-y-3">
        <SectionHeader>Global</SectionHeader>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[#8A8580]">Slide Title (optional)</label>
          <input
            type="text"
            value={global.title || ""}
            placeholder="e.g. Pros vs Cons"
            onFocus={() => setFocusAndPropagate({ side: "global", field: "title" })}
            onChange={(e) => updateGlobal({ title: e.target.value })}
            className="w-full h-8 px-2 rounded-md border border-[#4A4B4D] bg-[#343536] text-sm text-[#E2DDD5] placeholder:text-[#6A6560] focus:border-[#D4A537] focus:outline-none"
            data-testid="comparison-title"
          />
        </div>

        {/* Font Family */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[#8A8580]">Font</label>
          <select
            value={global.fontFamily}
            onChange={(e) => updateGlobal({ fontFamily: e.target.value })}
            className="w-full h-8 px-2 rounded-md border border-[#4A4B4D] bg-[#343536] text-sm text-[#E2DDD5] focus:border-[#D4A537] focus:outline-none"
            data-testid="comparison-font"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
            ))}
          </select>
        </div>

        {/* Divider style */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[#8A8580]">Divider</label>
          <div className="flex rounded-lg overflow-hidden border border-[#4A4B4D]" onFocus={() => setFocusAndPropagate({ side: "global", field: "divider" })}>
            {(["glow", "solid", "none"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setFocusAndPropagate({ side: "global", field: "divider" });
                  updateGlobal({ dividerStyle: d });
                }}
                className={cn(
                  "flex-1 py-1.5 text-[11px] font-medium capitalize transition-colors",
                  global.dividerStyle === d ? "bg-[#D4A537] text-[#08080A]" : "text-[#8A8580] hover:bg-[#464849]",
                  d !== "glow" && "border-l border-[#4A4B4D]"
                )}
                data-testid={`comparison-divider-${d}`}
              >
                {d === "glow" ? "Neon Glow" : d}
              </button>
            ))}
          </div>
        </div>

        {/* Glow color */}
        {global.dividerStyle === "glow" && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[#8A8580]">Glow color</label>
            <SwatchGrid
              value={global.dividerGlowColor}
              onChange={(v) => updateGlobal({ dividerGlowColor: v })}
              onFocus={() => setFocusAndPropagate({ side: "global", field: "divider" })}
            />
          </div>
        )}
      </div>

      {/* Per-side editors */}
      <SideEditor
        side="left"
        data={left}
        update={updateLeft}
        theme={global.theme}
        setFocusAndPropagate={setFocusAndPropagate}
      />
      <SideEditor
        side="right"
        data={right}
        update={updateRight}
        theme={global.theme}
        setFocusAndPropagate={setFocusAndPropagate}
      />

      {/* Help footer */}
      <div className="px-2 py-2 rounded-lg bg-[#08080A]/40 border border-[#4A4B4D]/50 text-[10px] text-[#8A8580] leading-relaxed">
        Tip: long text auto-shrinks to fit. Click any field to see exactly which area it controls — the matching panel will glow.
      </div>
    </div>
  );
}

/* ── Side editor (DRY) ──────────────────────────────────────────────────────────
   Defined at the top level (not inside ComparisonPanel) so the component
   identity stays stable across re-renders. If declared inline, every parent
   re-render would create a new component type, React would unmount/remount
   the input subtree, and the focused input would lose its caret + keystrokes
   on every change — which is exactly the bug we just fixed. */
function SideEditor({
  side,
  data,
  update,
  theme,
  setFocusAndPropagate,
}: {
  side: "left" | "right";
  data: ComparisonSide;
  update: (p: Partial<ComparisonSide>) => void;
  theme: ComparisonTheme;
  setFocusAndPropagate: (t: ComparisonFocusTarget) => void;
}) {
  const ph = getPlaceholders(theme, side);
  const updateItem = (idx: number, value: string) => {
    const next = [...data.items];
    next[idx] = value;
    update({ items: next });
  };
  const addItem = () => update({ items: [...data.items, ""] });
  const removeItem = (idx: number) =>
    update({ items: data.items.filter((_, i) => i !== idx) });

  return (
    <div className="bg-[#2D2E30] rounded-xl p-3 space-y-3 border border-[#4A4B4D]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E2DDD5]">
          {side === "left" ? "Left Side" : "Right Side"}
        </span>
        <span className="text-[10px] text-[#8A8580]">click to highlight</span>
      </div>

      {/* Subheading */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-[#8A8580]">Subheading</label>
        <input
          type="text"
          value={data.subheading}
          placeholder={ph.subheading}
          onFocus={() => setFocusAndPropagate({ side, field: "subheading" })}
          onChange={(e) => update({ subheading: e.target.value })}
          className="w-full h-8 px-2 rounded-md border border-[#4A4B4D] bg-[#343536] text-sm text-[#E2DDD5] placeholder:text-[#6A6560] focus:border-[#D4A537] focus:outline-none"
          data-testid={`comparison-${side}-subheading`}
        />
      </div>

      {/* Items / task-list */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-[#8A8580]">Points</label>
        <div className="space-y-1.5" onFocus={() => setFocusAndPropagate({ side, field: "items" })}>
          {data.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="w-5 h-5 flex items-center justify-center rounded text-[#B8944F]">
                <ComparisonIconSvg icon={data.icon} style={{ width: 12, height: 12 }} />
              </span>
              <input
                type="text"
                value={item}
                placeholder={ph.item}
                onFocus={() => setFocusAndPropagate({ side, field: "items" })}
                onChange={(e) => updateItem(idx, e.target.value)}
                className="flex-1 h-7 px-2 rounded-md border border-[#4A4B4D] bg-[#343536] text-xs text-[#E2DDD5] placeholder:text-[#6A6560] focus:border-[#D4A537] focus:outline-none"
                data-testid={`comparison-${side}-item-${idx}`}
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                disabled={data.items.length <= 1}
                className="w-6 h-6 flex items-center justify-center rounded text-[#8A8580] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove point"
                data-testid={`comparison-${side}-remove-${idx}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="w-full h-7 flex items-center justify-center gap-1 text-[11px] font-medium text-[#B8944F] border border-dashed border-[#4A4B4D] hover:border-[#B8944F] hover:bg-[#B8944F]/5 rounded-md transition-colors"
            data-testid={`comparison-${side}-add`}
          >
            <Plus className="w-3.5 h-3.5" /> Add point
          </button>
        </div>
      </div>

      {/* Icon picker */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-[#8A8580]">Icon</label>
        <div className="grid grid-cols-8 gap-1">
          {ICON_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setFocusAndPropagate({ side, field: "icon" });
                update({ icon: k });
              }}
              className={cn(
                "aspect-square rounded-md border flex items-center justify-center text-[#E2DDD5] transition-all",
                data.icon === k ? "border-[#D4A537] bg-[#D4A537]/15 text-[#D4A537]" : "border-[#4A4B4D] hover:border-[#B8944F]"
              )}
              title={ICON_LABELS[k]}
              data-testid={`comparison-${side}-icon-${k}`}
            >
              <ComparisonIconSvg icon={k} style={{ width: 14, height: 14 }} />
            </button>
          ))}
        </div>
      </div>

      {/* Background */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-[#8A8580]">Background tint</label>
        <SwatchGrid
          value={data.backgroundColor}
          onFocus={() => setFocusAndPropagate({ side, field: "background" })}
          onChange={(v) => update({ backgroundColor: v })}
          alpha={0.18}
        />
      </div>

      {/* Text color */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-[#8A8580]">Text color</label>
        <SwatchGrid
          value={data.textColor}
          onFocus={() => setFocusAndPropagate({ side, field: "textColor" })}
          onChange={(v) => update({ textColor: v })}
        />
      </div>
    </div>
  );
}
