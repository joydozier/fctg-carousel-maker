import { useState } from "react";
import { Plus, Trash2, ArrowLeftRight, Sparkles, GitCompare, Briefcase, Square, Layers, Droplet, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FCTG_BRAND_SWATCHES,
  COMPARISON_BG_SWATCHES,
  COMPARISON_TEXT_SWATCHES,
  buildComparisonTheme,
  computeSideBackground,
  suggestTextColor,
  toHex,
  type ComparisonFillStyle,
  type ComparisonIcon,
  type ComparisonSide,
  type ComparisonGlobalSettings,
  type ComparisonTheme,
  type ComparisonSwatch,
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

/* Tiered swatch picker:
   - Top row: FCTG brand colors (always shown)
   - Middle row: caller-supplied curated accents (different for bg vs text)
   - Bottom: hex input for any custom color
   Swatches always emit a clean #hex string. The actual rendering style
   (glass/solid/gradient + alpha) is owned by the side and applied by the
   renderer through computeSideBackground(). */
function SwatchGrid({
  value,
  onChange,
  onFocus,
  onBlur,
  accents = COMPARISON_BG_SWATCHES,
  accentsLabel = "Accents",
  testIdPrefix = "swatch",
}: {
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /** Curated accents row — swap to text/bg palettes per call site */
  accents?: ComparisonSwatch[];
  accentsLabel?: string;
  testIdPrefix?: string;
}) {
  // Local hex draft so users can type freely without state thrash on each char
  const [hexDraft, setHexDraft] = useState("");

  const emit = (hex: string) => {
    onFocus?.();
    onChange(hex);
  };

  // Compare on canonical hex so an old rgba-stored value still highlights
  // the matching swatch correctly.
  const isSelected = (hex: string) => normalizeColor(toHex(value)) === normalizeColor(hex);

  const Row = ({ swatches, label }: { swatches: ComparisonSwatch[]; label: string }) => (
    <div className="space-y-1">
      <div className="text-[9px] uppercase tracking-wider text-[#6A6560] font-semibold">{label}</div>
      <div className="grid grid-cols-8 gap-1" onFocus={onFocus} onBlur={onBlur}>
        {swatches.map((s) => {
          const selected = isSelected(s.value);
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => emit(s.value)}
              className={cn(
                "h-6 w-full rounded-md border transition-all",
                selected
                  ? "ring-2 ring-[#D4A537] ring-offset-1 ring-offset-[#2D2E30] border-transparent"
                  : "border-[#4A4B4D] hover:border-[#B8944F]"
              )}
              style={{ background: s.value }}
              title={`${s.name} (${s.value})`}
              data-testid={`${testIdPrefix}-${s.name.toLowerCase().replace(/\s+/g, "-")}`}
            />
          );
        })}
      </div>
    </div>
  );

  // Validate + commit a typed hex on Enter / blur
  const tryCommitHex = () => {
    const raw = hexDraft.trim();
    if (!raw) return;
    const hex = raw.startsWith("#") ? raw : `#${raw}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
      emit(hex);
      setHexDraft("");
    }
  };

  return (
    <div className="space-y-2">
      <Row swatches={FCTG_BRAND_SWATCHES} label="FCTG Brand" />
      <Row swatches={accents} label={accentsLabel} />

      {/* Custom hex input — escape hatch for any color */}
      <div className="flex items-center gap-1.5 pt-1">
        <span className="text-[9px] uppercase tracking-wider text-[#6A6560] font-semibold shrink-0">Custom</span>
        <div className="relative flex-1">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#6A6560] text-xs pointer-events-none">#</span>
          <input
            type="text"
            value={hexDraft}
            onFocus={onFocus}
            onChange={(e) => setHexDraft(e.target.value.replace(/[^0-9a-fA-F#]/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                tryCommitHex();
              }
            }}
            onBlur={tryCommitHex}
            placeholder="hex code"
            maxLength={7}
            className="w-full h-6 pl-5 pr-2 rounded-md border border-[#4A4B4D] bg-[#343536] text-[10px] font-mono text-[#E2DDD5] placeholder:text-[#6A6560] focus:border-[#D4A537] focus:outline-none"
            data-testid={`${testIdPrefix}-hex-input`}
          />
        </div>
        {/* Live preview chip — paints the canonical hex so the user sees
            the actual color they’ve picked, not whatever rgba/string we
            happen to store. */}
        <div
          className="h-6 w-6 rounded-md border border-[#4A4B4D] shrink-0"
          style={{ background: value ? toHex(value) : "transparent" }}
          title={`Current: ${value}`}
        />
      </div>
    </div>
  );
}

function normalizeColor(c: string): string {
  return (c || "").replace(/\s+/g, "").toLowerCase();
}

/** WCAG-style contrast check. Returns true when the foreground/background
   combo is too close in luminance for comfortable reading (delta < 0.45).
   Used by the Solid auto-suggest — if the user already has a contrasting
   text color, we leave it alone; if not, we propose one that works. */
function relativeContrastFails(fg: string, bg: string): boolean {
  const lumFg = relLum(fg);
  const lumBg = relLum(bg);
  return Math.abs(lumFg - lumBg) < 0.45;
}
function relLum(color: string): number {
  const hex = toHex(color);
  const c = parseHex(hex);
  if (!c) return 0;
  const norm = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * norm(c.r) + 0.7152 * norm(c.g) + 0.0722 * norm(c.b);
}
function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return null;
  return {
    r: parseInt(m[1].slice(0, 2), 16),
    g: parseInt(m[1].slice(2, 4), 16),
    b: parseInt(m[1].slice(4, 6), 16),
  };
}

/** Visual preview tile for the Fill Style segmented control. Renders a
   miniature of how the selected hex would actually paint at the chosen
   fill style. */
function FillPreview({
  hex,
  style,
  alpha,
  size = 14,
}: {
  hex: string;
  style: ComparisonFillStyle;
  alpha: number;
  size?: number;
}) {
  const fakeSide: ComparisonSide = {
    subheading: "",
    items: [],
    backgroundColor: hex,
    textColor: "#fff",
    icon: "check",
    fillStyle: style,
    fillAlpha: alpha,
  };
  return (
    <div
      className="rounded-sm border border-[#4A4B4D]/60"
      style={{
        width: size,
        height: size,
        background: computeSideBackground(fakeSide),
      }}
    />
  );
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

  /* "Apply to both sides" — panel-level state (not persisted on the slide,
     since it's an editing preference, not a slide property). When ON, any
     fill-related update is forked to BOTH sides simultaneously. */
  const [linkFills, setLinkFills] = useState(false);

  /* Single entry point for fill-related changes (backgroundColor, fillStyle,
     fillAlpha, and the auto-suggested textColor). Honors linkFills so we can
     wire it once from the SideEditor and not duplicate logic. */
  const updateFill = (
    targetSide: "left" | "right",
    patch: Partial<ComparisonSide>
  ) => {
    if (linkFills) {
      updateSlide(slide.id, {
        comparisonLeft: { ...left, ...patch },
        comparisonRight: { ...right, ...patch },
      });
    } else if (targetSide === "left") {
      updateLeft(patch);
    } else {
      updateRight(patch);
    }
  };

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
              accents={COMPARISON_TEXT_SWATCHES}
              accentsLabel="Glow accents"
              testIdPrefix="glow-swatch"
            />
          </div>
        )}
      </div>

      {/* "Apply to both sides" — a global mirror toggle. When ON, any
          background-fill change on one side automatically applies to the
          other side too. Color content (subheading, items, icon) is NEVER
          mirrored; only fill style + alpha + base color. This preserves
          asymmetric pro/con layouts where users want different bullet
          icons but matching panel chrome. */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2D2E30] border border-[#4A4B4D]">
        <Checkbox
          id="comparison-link-fills"
          checked={linkFills}
          onCheckedChange={(v) => setLinkFills(v === true)}
          data-testid="comparison-link-fills"
          className="data-[state=checked]:bg-[#D4A537] data-[state=checked]:border-[#D4A537]"
        />
        <label
          htmlFor="comparison-link-fills"
          className="flex items-center gap-1.5 text-[11px] font-medium text-[#E2DDD5] cursor-pointer select-none"
        >
          <LinkIcon className="w-3 h-3 text-[#B8944F]" />
          Apply background changes to both sides
        </label>
      </div>

      {/* Per-side editors */}
      <SideEditor
        side="left"
        data={left}
        update={updateLeft}
        updateFill={(p) => updateFill("left", p)}
        theme={global.theme}
        setFocusAndPropagate={setFocusAndPropagate}
      />
      <SideEditor
        side="right"
        data={right}
        update={updateRight}
        updateFill={(p) => updateFill("right", p)}
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
  updateFill,
  theme,
  setFocusAndPropagate,
}: {
  side: "left" | "right";
  data: ComparisonSide;
  /** Updates that affect ONLY this side (subheading, items, icon, textColor). */
  update: (p: Partial<ComparisonSide>) => void;
  /** Background-fill updates that may be mirrored to the other side when
      the parent's "Apply to both sides" toggle is on. */
  updateFill: (p: Partial<ComparisonSide>) => void;
  theme: ComparisonTheme;
  setFocusAndPropagate: (t: ComparisonFocusTarget) => void;
}) {
  // Resolve effective fill style + alpha (handles legacy slides w/o fields).
  const fillStyle: ComparisonFillStyle = data.fillStyle ?? "glass";
  const fillAlpha = data.fillAlpha ?? 0.18;

  /* When the user picks a swatch, ALSO auto-upgrade the text color when
     they're in Solid mode and the new background would clash with the
     current text. We only override if the existing textColor would be
     low-contrast — we never overwrite an explicit, contrasting choice. */
  const handleBgPick = (newHex: string) => {
    const patch: Partial<ComparisonSide> = { backgroundColor: newHex };
    if (fillStyle === "solid") {
      const suggested = suggestTextColor(newHex);
      // Only auto-update text if current text would now be hard to read.
      const currentLum = relativeContrastFails(data.textColor, newHex);
      if (currentLum) patch.textColor = suggested;
    }
    setFocusAndPropagate({ side, field: "background" });
    updateFill(patch);
  };

  /* Switching fill style is the other big moment to consider auto text. */
  const handleFillStyleChange = (next: ComparisonFillStyle) => {
    const patch: Partial<ComparisonSide> = { fillStyle: next };
    if (next === "solid" && relativeContrastFails(data.textColor, data.backgroundColor)) {
      patch.textColor = suggestTextColor(toHex(data.backgroundColor));
    }
    setFocusAndPropagate({ side, field: "background" });
    updateFill(patch);
  };
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

      {/* Side background — fill style + opacity + swatch */}
      <div className="space-y-1.5" data-testid={`bg-section-${side}`}>
        <label className="text-[11px] font-medium text-[#8A8580]">Side background</label>

        {/* Fill style segmented control */}
        <div className="grid grid-cols-3 gap-1">
          {(["glass", "solid", "gradient"] as ComparisonFillStyle[]).map((s) => {
            const active = fillStyle === s;
            const label = s === "glass" ? "Glass" : s === "solid" ? "Solid" : "Gradient";
            return (
              <button
                key={s}
                type="button"
                onClick={() => handleFillStyleChange(s)}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-md text-[10px] font-medium transition-all border",
                  active
                    ? "bg-[#D4A537] text-[#08080A] border-[#D4A537]"
                    : "border-[#4A4B4D] text-[#8A8580] hover:border-[#B8944F] hover:text-[#E2DDD5]"
                )}
                data-testid={`fill-style-${side}-${s}`}
                title={s === "glass" ? "Translucent tint" : s === "solid" ? "Fully opaque fill" : "Top-to-bottom fade"}
              >
                <FillPreview hex={toHex(data.backgroundColor)} style={s} alpha={fillAlpha} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Opacity slider — only for glass + gradient */}
        {fillStyle !== "solid" && (
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#8A8580]">
                Opacity {Math.round(fillAlpha * 100)}%
              </span>
            </div>
            <Slider
              value={[Math.round(fillAlpha * 100)]}
              min={5}
              max={50}
              step={1}
              onValueChange={(v) => updateFill({ fillAlpha: (v[0] ?? 18) / 100 })}
              data-testid={`opacity-slider-${side}`}
            />
          </div>
        )}

        {/* Base color swatch — emits clean hex */}
        <SwatchGrid
          value={toHex(data.backgroundColor)}
          onFocus={() => setFocusAndPropagate({ side, field: "background" })}
          onChange={handleBgPick}
          accents={COMPARISON_BG_SWATCHES}
          accentsLabel="Background accents"
          testIdPrefix={`bg-swatch-${side}`}
        />
      </div>

      {/* Text color */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-[#8A8580]">Text color</label>
        <SwatchGrid
          value={data.textColor}
          onFocus={() => setFocusAndPropagate({ side, field: "textColor" })}
          onChange={(v) => update({ textColor: v })}
          accents={COMPARISON_TEXT_SWATCHES}
          accentsLabel="Text accents"
          testIdPrefix={`text-swatch-${side}`}
        />
      </div>
    </div>
  );
}
