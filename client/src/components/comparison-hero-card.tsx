import { useState, useEffect } from "react";
import { Columns2, Sparkles, X } from "lucide-react";
import type { CarouselProject } from "@/lib/types";

const HERO_DISMISSED_KEY = "fctg.comparisonHeroCard.dismissed.v1";

interface ComparisonHeroCardProps {
  project: CarouselProject;
  selectedSlideIndex: number;
  onConvert: (index: number) => void;
  onAddNew: () => void;
}

/**
 * Tier 4 of the comparison-visibility upgrade.
 *
 * A dismissible hero banner that surfaces ONLY when the user has a fresh,
 * untouched project (1 default slide, no comparison data). Two CTAs:
 *   • Convert this slide  → reuses the slide they're already on
 *   • Add new comparison  → appends a fresh comparison slide
 *
 * Once dismissed (or once the user has clearly started building a real
 * carousel), the card disappears for good and never re-appears for that
 * browser. localStorage key is versioned so we can re-introduce later.
 */
export function ComparisonHeroCard({
  project,
  selectedSlideIndex,
  onConvert,
  onAddNew,
}: ComparisonHeroCardProps) {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(HERO_DISMISSED_KEY) === "1";
  });

  // Re-check dismissed flag if it changes in another tab.
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === HERO_DISMISSED_KEY && e.newValue === "1") {
        setDismissed(true);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (dismissed) return null;

  // Show whenever the project does NOT yet contain a comparison slide.
  // Once the user has even one comparison anywhere, they've discovered the
  // feature — hide the card so it never feels noisy. This is more
  // permissive than a strict "fresh canvas" check and surfaces the CTA on
  // the default 5-slide template too.
  const hasComparisonAlready = project.slides.some(
    (s) => s.layout === "comparison" || !!s.comparisonGlobal
  );
  if (hasComparisonAlready) return null;

  const handleDismiss = () => {
    localStorage.setItem(HERO_DISMISSED_KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      className="relative mx-4 mt-3 mb-1 rounded-xl border border-[#D4A537]/40 bg-gradient-to-r from-[#1a1a1c] via-[#2D2E30] to-[#1a1a1c] shadow-lg shadow-[#D4A537]/5 overflow-hidden"
      data-testid="comparison-hero-card"
    >
      {/* Soft gold glow accent */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#D4A537]/0 via-[#D4A537]/8 to-[#D4A537]/0" />

      <div className="relative flex items-center gap-4 px-5 py-3">
        {/* Icon cluster */}
        <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-[#D4A537] to-[#B8944F] flex items-center justify-center shadow-md shadow-[#D4A537]/30">
          <Columns2 className="w-5 h-5 text-[#08080A]" />
        </div>

        {/* Headline + subtext */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#E2DDD5]">
              Try the new Comparison layout
            </h3>
            <span className="px-1.5 py-0.5 text-[9px] font-bold leading-none rounded-full bg-[#FF4D6D] text-white">
              NEW
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4A537]" />
          </div>
          <p className="text-xs text-[#8A8580] mt-0.5">
            Side-by-side pro/con, before/after, this/that. Glassmorphism
            styling, neon accents, and full FCTG brand colors.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <button
            onClick={() => onConvert(selectedSlideIndex)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#D4A537]/40 text-[#D4A537] hover:bg-[#D4A537]/10 transition-colors"
            data-testid="comparison-hero-convert"
            title="Turn this blank slide into a comparison"
          >
            Convert this slide
          </button>
          <button
            onClick={onAddNew}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#D4A537] to-[#B8944F] text-[#08080A] hover:from-[#E0B547] hover:to-[#C8A455] transition-colors shadow-sm shadow-[#D4A537]/20"
            data-testid="comparison-hero-add"
            title="Add a new comparison slide"
          >
            Add Comparison
          </button>
        </div>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-[#8A8580] hover:text-[#E2DDD5] hover:bg-[#3A3B3D] transition-colors"
          data-testid="comparison-hero-dismiss"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
