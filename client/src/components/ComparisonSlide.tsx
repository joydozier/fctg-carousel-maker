import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type {
  ComparisonGlobalSettings,
  ComparisonIcon,
  ComparisonSide,
  Slide,
} from "@/lib/types";
import { buildComparisonTheme } from "@/lib/types";

/* ───────────────────────────────────────────────────────────────────────────
   ComparisonSlide
   - Symmetric 50/50 glassmorphism layout with neon-glow center divider.
   - Auto-fit typography: items shrink (down to a floor) until they fit.
   - Focus-sync: when the editor sets a `focusTarget`, the matching region
     pulses for ~1.4s so the user sees exactly what they're editing.
   - Pure CSS effects (backdrop-filter + box-shadow) — captured cleanly
     by html-to-image for export.
   ─────────────────────────────────────────────────────────────────────────── */

export type ComparisonFocusTarget =
  | { side: "left" | "right"; field: "subheading" | "items" | "background" | "textColor" | "icon" }
  | { side: "global"; field: "title" | "divider" | "fontFamily" }
  | null;

interface ComparisonSlideProps {
  slide: Slide;
  /** The full design width of the slide (e.g. 1080) — used for absolute sizing */
  designWidth: number;
  designHeight: number;
  /** Provided by the editor for visual sync; ignored elsewhere */
  focusTarget?: ComparisonFocusTarget;
  /** When true, hides the title bar (e.g. when caller wants to render their own) */
  hideTitle?: boolean;
}

/* ── Inline icon set (8 universal icons) ─────────────────────────────────── */
const ICONS: Record<ComparisonIcon, JSX.Element> = {
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l10 18H2L12 3z" />
      <path d="M12 10v5M12 18v.01" />
    </svg>
  ),
  idea: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 00-4 12.7c.7.6 1 1.5 1 2.3v1h6v-1c0-.8.3-1.7 1-2.3A7 7 0 0012 2z" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M12 2.5l2.95 6 6.6.95-4.78 4.66 1.13 6.59L12 17.6l-5.9 3.1 1.13-6.59L2.45 9.45l6.6-.95L12 2.5z" />
    </svg>
  ),
  "trend-up": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M12 21s-7-4.4-9.3-9A5.3 5.3 0 0112 6.5 5.3 5.3 0 0121.3 12C19 16.6 12 21 12 21z" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  ),
};

export function ComparisonIconSvg({ icon, className, style }: { icon: ComparisonIcon; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={cn("inline-flex items-center justify-center", className)} style={style} aria-hidden>
      {ICONS[icon]}
    </span>
  );
}

/* ── Auto-fit hook ─────────────────────────────────────────────────────────
   Shrinks an element's font-size from `start` → `min` (in px) until its
   children fit inside its scrollable bounds.
   ──────────────────────────────────────────────────────────────────────── */
function useAutoFit(
  ref: React.RefObject<HTMLElement>,
  deps: unknown[],
  config: { start: number; min: number; step?: number }
): number {
  const [size, setSize] = useState(config.start);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const step = config.step ?? 1;
    let s = config.start;
    el.style.fontSize = `${s}px`;
    // Defer to next frame so layout settles before measuring
    const raf = requestAnimationFrame(() => {
      while (
        s > config.min &&
        (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)
      ) {
        s -= step;
        el.style.fontSize = `${s}px`;
      }
      setSize(s);
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return size;
}

/* ── A single side panel ───────────────────────────────────────────────── */
function SidePanel({
  side,
  data,
  fontFamily,
  designWidth,
  isFocused,
  focusedField,
}: {
  side: "left" | "right";
  data: ComparisonSide;
  fontFamily: string;
  designWidth: number;
  isFocused: boolean;
  focusedField?: "subheading" | "items" | "background" | "textColor" | "icon";
}) {
  // Auto-fit refs
  const subheadingRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);

  // Scale font targets relative to design width (1080 baseline)
  const baseScale = designWidth / 1080;
  const subStart = Math.round(64 * baseScale);
  const subMin = Math.round(28 * baseScale);
  const itemStart = Math.round(38 * baseScale);
  const itemMin = Math.round(18 * baseScale);

  useAutoFit(subheadingRef, [data.subheading, designWidth], { start: subStart, min: subMin });
  useAutoFit(itemsRef, [data.items.join("|"), designWidth], { start: itemStart, min: itemMin });

  return (
    <div
      data-comparison-side={side}
      className={cn(
        "relative flex-1 flex flex-col items-stretch transition-shadow duration-300",
        isFocused && "comparison-pulse"
      )}
      style={{
        // Glassmorphism: tinted bg + blur + thin low-opacity border
        background: data.backgroundColor,
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: isFocused
          ? "inset 0 0 0 2px rgba(212,165,55,0.85), 0 0 32px rgba(212,165,55,0.35)"
          : "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.25)",
        color: data.textColor,
        fontFamily,
        padding: `${Math.round(80 * baseScale)}px ${Math.round(64 * baseScale)}px`,
      }}
    >
      {/* Icon badge */}
      <div
        data-comparison-zone={`${side}-icon`}
        className={cn(
          "rounded-full flex items-center justify-center mb-6",
          focusedField === "icon" && "comparison-pulse-soft"
        )}
        style={{
          width: Math.round(96 * baseScale),
          height: Math.round(96 * baseScale),
          background: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.18)",
          color: data.textColor,
          padding: Math.round(22 * baseScale),
        }}
      >
        <ComparisonIconSvg icon={data.icon} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Subheading (auto-fit) */}
      <div
        ref={subheadingRef}
        data-comparison-zone={`${side}-subheading`}
        className={cn(
          "font-bold leading-tight mb-6 break-words overflow-hidden",
          focusedField === "subheading" && "comparison-pulse-soft"
        )}
        style={{
          color: data.textColor,
          fontSize: subStart,
          // Cap subheading height so auto-fit kicks in for long words
          maxHeight: Math.round(160 * baseScale),
          letterSpacing: "-0.01em",
        }}
      >
        {data.subheading || (side === "left" ? "Left Subheading" : "Right Subheading")}
      </div>

      {/* Items list (auto-fit) */}
      <ul
        ref={itemsRef}
        data-comparison-zone={`${side}-items`}
        className={cn(
          "space-y-4 flex-1 overflow-hidden",
          focusedField === "items" && "comparison-pulse-soft"
        )}
        style={{ fontSize: itemStart, lineHeight: 1.35 }}
      >
        {(data.items.length > 0 ? data.items : ["Add a point…"]).map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              className="flex-shrink-0 inline-flex items-center justify-center rounded-md mt-1"
              style={{
                width: "1.4em",
                height: "1.4em",
                background: "rgba(255,255,255,0.10)",
                color: data.textColor,
                padding: "0.25em",
              }}
            >
              <ComparisonIconSvg icon={data.icon} style={{ width: "100%", height: "100%" }} />
            </span>
            <span style={{ color: data.textColor, opacity: 0.95 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Main exported component ──────────────────────────────────────────── */
export function ComparisonSlide({ slide, designWidth, designHeight, focusTarget, hideTitle }: ComparisonSlideProps) {
  // Defensive defaults — if the slide was loaded without comparison fields, hydrate from preset
  const fallback = buildComparisonTheme(slide.comparisonGlobal?.theme || "custom");
  const global: ComparisonGlobalSettings = slide.comparisonGlobal || fallback.global;
  const left: ComparisonSide = slide.comparisonLeft || fallback.left;
  const right: ComparisonSide = slide.comparisonRight || fallback.right;

  const baseScale = designWidth / 1080;
  const titleSizeStart = Math.round(56 * baseScale);
  const titleRef = useRef<HTMLDivElement>(null);
  useAutoFit(titleRef, [global.title, designWidth], { start: titleSizeStart, min: Math.round(28 * baseScale) });

  // Divider styles
  const dividerWidth = Math.max(2, Math.round(2 * baseScale));
  const glowColor = global.dividerGlowColor || "#D4A537";
  const dividerStyle: React.CSSProperties =
    global.dividerStyle === "glow"
      ? {
          width: dividerWidth,
          background: `linear-gradient(to bottom, transparent 0%, ${glowColor} 12%, ${glowColor} 88%, transparent 100%)`,
          boxShadow: `0 0 ${Math.round(18 * baseScale)}px ${glowColor}, 0 0 ${Math.round(40 * baseScale)}px ${glowColor}80`,
        }
      : global.dividerStyle === "solid"
      ? { width: dividerWidth, background: "rgba(255,255,255,0.35)" }
      : { width: 0, background: "transparent" };

  const focusedSide = focusTarget && focusTarget.side !== "global" ? focusTarget.side : null;
  const focusedField = focusTarget && focusTarget.side !== "global" ? focusTarget.field : undefined;
  const titleFocused = focusTarget?.side === "global" && focusTarget?.field === "title";
  const dividerFocused = focusTarget?.side === "global" && focusTarget?.field === "divider";

  // Padding around the comparison frame (leaves room for branding bar / slide number)
  const framePad = Math.round(96 * baseScale);
  const titleHeight = hideTitle || !global.title ? 0 : Math.round(120 * baseScale);

  return (
    <div
      data-comparison-root
      className="absolute inset-0"
      style={{ fontFamily: global.fontFamily }}
    >
      {/* Inline keyframes — scoped via data attribute so they survive html-to-image */}
      <style>{`
        @keyframes comparisonPulse {
          0%, 100% { box-shadow: inset 0 0 0 2px rgba(212,165,55,0.85), 0 0 32px rgba(212,165,55,0.35); }
          50%      { box-shadow: inset 0 0 0 3px rgba(212,165,55,1),     0 0 48px rgba(212,165,55,0.55); }
        }
        @keyframes comparisonPulseSoft {
          0%, 100% { outline: 2px solid rgba(212,165,55,0.85); outline-offset: 4px; }
          50%      { outline: 3px solid rgba(212,165,55,1);    outline-offset: 6px; }
        }
        [data-comparison-root] .comparison-pulse      { animation: comparisonPulse 1.2s ease-in-out 2; }
        [data-comparison-root] .comparison-pulse-soft { animation: comparisonPulseSoft 1.2s ease-in-out 2; border-radius: inherit; }
      `}</style>

      {/* Optional title strip */}
      {!hideTitle && global.title && (
        <div
          ref={titleRef}
          data-comparison-zone="title"
          className={cn("absolute left-0 right-0 flex items-center justify-center font-bold text-center px-6", titleFocused && "comparison-pulse-soft")}
          style={{
            top: Math.round(64 * baseScale),
            height: titleHeight,
            color: "#FDFBF7",
            fontSize: titleSizeStart,
            textShadow: "0 2px 16px rgba(0,0,0,0.45)",
            letterSpacing: "-0.015em",
            borderRadius: 12,
          }}
        >
          {global.title}
        </div>
      )}

      {/* The comparison frame (left | divider | right) */}
      <div
        className="absolute flex items-stretch"
        style={{
          left: framePad,
          right: framePad,
          top: framePad + titleHeight,
          bottom: framePad,
          borderRadius: Math.round(28 * baseScale),
          overflow: "hidden",
          // Outer glass border
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
        }}
      >
        <SidePanel
          side="left"
          data={left}
          fontFamily={global.fontFamily}
          designWidth={designWidth}
          isFocused={focusedSide === "left"}
          focusedField={focusedSide === "left" ? focusedField : undefined}
        />

        {/* Divider */}
        <div
          data-comparison-zone="divider"
          className={cn("flex-shrink-0 self-stretch my-8 mx-1", dividerFocused && "comparison-pulse-soft")}
          style={dividerStyle}
        />

        <SidePanel
          side="right"
          data={right}
          fontFamily={global.fontFamily}
          designWidth={designWidth}
          isFocused={focusedSide === "right"}
          focusedField={focusedSide === "right" ? focusedField : undefined}
        />
      </div>
    </div>
  );
}

/* ── Helper exported for the editor: swap left/right (data + colors + icons) ── */
export function swapComparisonSides(slide: Slide): Partial<Slide> {
  if (!slide.comparisonLeft || !slide.comparisonRight) return {};
  return {
    comparisonLeft: slide.comparisonRight,
    comparisonRight: slide.comparisonLeft,
  };
}
