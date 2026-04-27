export type SlideType = "intro" | "content" | "outro";

export type VideoSplitLayout = "video-top" | "video-bottom" | "video-left" | "video-right" | "video-center";

export interface SlideElement {
  id: string;
  type: "subtitle" | "heading" | "body" | "cta" | "image" | "video" | "shape" | "slideNumber" | "divider" | "logo";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  visible: boolean;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  color?: string;
  accentColor?: string; // for first-word accent coloring
  backgroundColor?: string;
  borderRadius?: number;
  opacity?: number;
  src?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  fontStyle?: "normal" | "italic";
  textShadow?: string; // CSS text-shadow value
  padding?: number;
  placeholder?: string; // for image placeholders
  // Video-specific fields
  videoSrc?: string; // uploaded video URL or blob
  videoThumbnail?: string; // poster/thumbnail image
  videoMuted?: boolean;
  videoLoop?: boolean;
  // Logo-specific fields
  logoSrc?: string; // uploaded logo image URL or data URL
  logoFit?: "contain" | "cover" | "fill"; // how the logo fits its container, default "contain"
}

export type SlideLayout = "default" | "quote-card" | "infographics" | "testimonial" | "bento-grid" | "video" | "comparison";

// ─── Comparison Slide Types ───────────────────────────────────────────────
// 8 curated universal icons — keys map to inline SVGs in <ComparisonSlide />
export type ComparisonIcon = "check" | "x" | "alert" | "idea" | "star" | "trend-up" | "heart" | "user";
export type ComparisonTheme = "custom" | "pro-con" | "before-after" | "competitor";
export type ComparisonDividerStyle = "glow" | "solid" | "none";

/** Fill mode for a comparison panel side.
   - glass: translucent tint over the slide background (glassmorphism, default)
   - solid: fully opaque single-color panel fill
   - gradient: vertical gradient from full-color top to softer bottom */
export type ComparisonFillStyle = "glass" | "solid" | "gradient";

export interface ComparisonSide {
  subheading: string;
  items: string[];
  /** Base swatch color as #hex. Combined with fillStyle + fillAlpha at render
     time to produce the actual CSS background. Stored as hex (not rgba) so
     users can switch between glass/solid/gradient without losing the hue. */
  backgroundColor: string;
  textColor: string;
  /** key from ComparisonIcon — applied to every list bullet on this side */
  icon: ComparisonIcon;
  /** How to render the side panel background. Defaults to "glass" for back-
     compat with slides created before this field existed. */
  fillStyle?: ComparisonFillStyle;
  /** Opacity 0–1 used by glass mode (and for the bottom stop of gradient).
     Ignored for solid. Defaults to 0.18 to match the original glass tint. */
  fillAlpha?: number;
}

export interface ComparisonGlobalSettings {
  fontFamily: string;
  dividerStyle: ComparisonDividerStyle;
  /** Neon-glow divider color (used when dividerStyle === "glow") */
  dividerGlowColor: string;
  theme: ComparisonTheme;
  /** Optional headline at the top of the slide */
  title?: string;
}

export type ComparisonSwatch = { name: string; value: string };

/** FCTG brand swatches — always present at the top of every color picker */
export const FCTG_BRAND_SWATCHES: ComparisonSwatch[] = [
  { name: "Onyx Black", value: "#08080A" },
  { name: "Slate Charcoal", value: "#2D2E30" },
  { name: "Deep Bronze", value: "#433B2B" },
  { name: "Antique Gold", value: "#B8944F" },
  { name: "Sovereign Gold", value: "#D4A537" },
  { name: "Linen", value: "#E2DDD5" },
  { name: "Burgundy", value: "#7A1F2B" },
  { name: "Midnight Teal", value: "#1B3A4B" },
];

/** Curated background-tint accents — muted/saturated colors that read well
   behind text when rendered at low alpha. */
export const COMPARISON_BG_SWATCHES: ComparisonSwatch[] = [
  { name: "Obsidian", value: "#08080A" },
  { name: "Dark Rum", value: "#1A1410" },
  { name: "Ink Blue", value: "#0B1E3F" },
  { name: "Royal Blue", value: "#1E40AF" },
  { name: "Forest", value: "#064E3B" },
  { name: "Emerald", value: "#059669" },
  { name: "Crimson", value: "#991B1B" },
  { name: "Coral", value: "#DC2626" },
  { name: "Plum", value: "#5B21B6" },
  { name: "Terracotta", value: "#C2410C" },
  { name: "Olive", value: "#3F6212" },
  { name: "Slate", value: "#334155" },
];

/** Curated text-color accents — high-contrast colors safe for reading. */
export const COMPARISON_TEXT_SWATCHES: ComparisonSwatch[] = [
  { name: "Pure White", value: "#FFFFFF" },
  { name: "Cream", value: "#FDFBF7" },
  { name: "Pale Gold", value: "#F5D77A" },
  { name: "Mint", value: "#A7F3D0" },
  { name: "Sky", value: "#BAE6FD" },
  { name: "Rose", value: "#FECACA" },
  { name: "Lavender", value: "#DDD6FE" },
  { name: "Sand", value: "#FDE68A" },
  { name: "Ash Grey", value: "#9CA3AF" },
  { name: "Charcoal", value: "#1F2937" },
  { name: "Pure Black", value: "#000000" },
  { name: "Forest Ink", value: "#064E3B" },
];

/** Back-compat: legacy code (presets, divider glow) still imports COMPARISON_SWATCHES.
   Map it to the brand row + bg accents so existing references keep working. */
export const COMPARISON_SWATCHES: ComparisonSwatch[] = [
  ...FCTG_BRAND_SWATCHES,
  ...COMPARISON_BG_SWATCHES,
];

export interface Slide {
  id: string;
  order: number;
  slideType: SlideType;
  layout: SlideLayout;
  backgroundColor: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  backgroundPattern?: "none" | "dots" | "lines" | "diagonal" | "grid" | "waves" | "crosses" | "zigzag" | "noise";
  patternOpacity?: number;
  // Background image overlay — separate from full background image
  backgroundOverlayImage?: string;
  backgroundOverlayOpacity?: number; // 0-100, default 40
  contentPadding?: number;
  elements: SlideElement[];
  // Configure toggles — which element types are enabled on this slide
  showSubtitle: boolean;
  showTitle: boolean;
  showDescription: boolean;
  showImage: boolean;
  showCta: boolean;
  // Layout-specific options
  infographicsType?: "grid" | "cyclic";
  infographicsColumns?: number;
  showColumnsHeader?: boolean;
  showCounter?: boolean;
  testimonialLayout?: number; // 0-3
  showStars?: boolean;
  showAvatar?: boolean;
  showName?: boolean;
  showDesignation?: boolean;
  showQuoteElement?: boolean;
  bentoRowsCount?: number;
  showBoxTheme?: boolean;
  visible?: boolean;
  // Video layout options
  videoSplitLayout?: VideoSplitLayout;
  videoSplitRatio?: number; // 0.3 to 0.8 — how much space the video takes
  showVideo?: boolean;
  // ── Comparison layout fields (used when layout === "comparison") ──
  comparisonGlobal?: ComparisonGlobalSettings;
  comparisonLeft?: ComparisonSide;
  comparisonRight?: ComparisonSide;
}

export interface CarouselProject {
  id?: number;
  name: string;
  platform: "instagram" | "linkedin" | "tiktok" | "facebook" | "x";
  width: number;
  height: number;
  slideCount: number;
  slides: Slide[];
  globalStyles: GlobalStyles;
}

export interface GlobalStyles {
  headingFont: string;
  bodyFont: string;
  headingFontSize: number;
  bodyFontSize: number;
  customFontSizes: boolean;
  customFontPairing: boolean;
  colorPalette: string[]; // [background, accent, bodyText, headingText]
  alternateColors: string[]; // alternate palette row
  alternateColorsEnabled: boolean;
  brandingEnabled: boolean;
  brandName: string;
  brandHandle: string;
  brandColor: string;
  brandOnlyIntroOutro: boolean;
  brandBorder: boolean;
  brandShadow: boolean;
  brandCustomColor: boolean;
  brandCustomColorValue: string;
  brandRoundness: number;
  brandCustomSize: boolean;
  brandSizePreset: "small" | "medium" | "large";
  slideNumberEnabled: boolean;
  slideNumberStyle: "plain" | "padded" | "hash" | "dot";
  swipeIndicatorEnabled: boolean;
  swipeText: string;
  swipeStyle: "chevron" | "arrow-thin" | "arrow-bold";
  swipeIcon: "none" | "chevron" | "arrow" | "circle" | "spark";
  swipeIntroOnly: boolean;
  swipeShadow: boolean;
  bookmarkEnabled: boolean;
  decorativeElementsEnabled: boolean;
  decorativeOpacity: number;
  decorativeRoundness: number;
  slideNumberShadow: boolean;
  ctaShadow: boolean;
  qrCodeEnabled: boolean;
  watermarkEnabled: boolean;
  watermarkText: string;
  // Custom fonts
  customFontFiles: { name: string; url: string }[];
}

export interface ColorPaletteData {
  id?: number;
  name: string;
  colors: string[];
  isBuiltIn: boolean;
}

export interface PlatformSizeInfo {
  width: number;
  height: number;
  label: string;
  ratio: string;
  icons: string[];
  bestFor: string;
  recommendedVideoLayouts: VideoSplitLayout[];
}

export const PLATFORM_SIZES: Record<string, PlatformSizeInfo> = {
  "square": {
    width: 1080, height: 1080, ratio: "1:1", label: "Square",
    icons: ["linkedin", "instagram", "facebook"],
    bestFor: "Instagram Feed, LinkedIn, Facebook",
    recommendedVideoLayouts: ["video-top", "video-bottom"],
  },
  "landscape": {
    width: 1440, height: 1080, ratio: "4:3", label: "Landscape",
    icons: ["x"],
    bestFor: "X/Twitter, LinkedIn Articles",
    recommendedVideoLayouts: ["video-left", "video-right"],
  },
  "presentation": {
    width: 1920, height: 1080, ratio: "16:9", label: "Presentation",
    icons: ["presentation"],
    bestFor: "Slide Decks, YouTube Thumbnails",
    recommendedVideoLayouts: ["video-left", "video-right"],
  },
  "ultra-wide": {
    width: 5120, height: 1080, ratio: "128:27", label: "Ultra Wide",
    icons: ["tiktok", "youtube"],
    bestFor: "TikTok Carousel, YouTube Banner",
    recommendedVideoLayouts: ["video-left", "video-right"],
  },
  "portrait-4-5": {
    width: 1080, height: 1350, ratio: "4:5", label: "Portrait",
    icons: ["linkedin", "instagram"],
    bestFor: "Instagram Carousel, LinkedIn",
    recommendedVideoLayouts: ["video-top", "video-bottom", "video-center"],
  },
  "portrait-3-4": {
    width: 1080, height: 1440, ratio: "3:4", label: "Portrait",
    icons: ["linkedin", "instagram"],
    bestFor: "Instagram Carousel, LinkedIn",
    recommendedVideoLayouts: ["video-top", "video-bottom", "video-center"],
  },
  "story": {
    width: 1080, height: 1920, ratio: "9:16", label: "Story",
    icons: ["tiktok", "instagram"],
    bestFor: "Instagram Stories, TikTok, Reels",
    recommendedVideoLayouts: ["video-center", "video-top", "video-bottom"],
  },
  "pinterest-pin": {
    width: 1000, height: 1500, ratio: "2:3", label: "Pinterest Pin",
    icons: ["pinterest"],
    bestFor: "Pinterest Pins",
    recommendedVideoLayouts: ["video-top", "video-bottom"],
  },
};

/** Check if a video layout is recommended for the current canvas size */
export function isVideoLayoutRecommended(canvasWidth: number, canvasHeight: number, videoLayout: VideoSplitLayout): boolean {
  const entry = Object.values(PLATFORM_SIZES).find(s => s.width === canvasWidth && s.height === canvasHeight);
  if (!entry) return true; // unknown size, don't warn
  return entry.recommendedVideoLayouts.includes(videoLayout);
}

/** Get a warning message if the video layout isn't great for this canvas */
export function getVideoLayoutWarning(canvasWidth: number, canvasHeight: number, videoLayout: VideoSplitLayout): string | null {
  if (isVideoLayoutRecommended(canvasWidth, canvasHeight, videoLayout)) return null;
  const isPortrait = canvasHeight > canvasWidth;
  const isLandscape = canvasWidth > canvasHeight;
  if (isPortrait && (videoLayout === "video-left" || videoLayout === "video-right")) {
    return "Side-by-side layout may look cramped on portrait canvas. Consider stacking video on top or bottom.";
  }
  if (isLandscape && (videoLayout === "video-top" || videoLayout === "video-bottom")) {
    return "Stacked layout may leave the video very short on landscape canvas. Consider side-by-side layout.";
  }
  return "This layout may not display optimally at this canvas size.";
}

export const FONT_PAIRS: { heading: string; body: string; label: string }[] = [
  { heading: "General Sans", body: "General Sans", label: "General Sans" },
  { heading: "Clash Display", body: "Satoshi", label: "Clash / Satoshi" },
  { heading: "Cabinet Grotesk", body: "General Sans", label: "Cabinet / General Sans" },
  { heading: "Bebas Neue", body: "Open Sans", label: "Bebas / Open Sans" },
  { heading: "Playfair Display", body: "Lato", label: "Playfair / Lato" },
  { heading: "Montserrat", body: "Open Sans", label: "Montserrat / Open Sans" },
  { heading: "Poppins", body: "Inter", label: "Poppins / Inter" },
  { heading: "Oswald", body: "Source Sans 3", label: "Oswald / Source Sans" },
];

export const FCTG_BRAND_COLORS = {
  // Core brand
  darkRum: "#433B2B",
  obsidian: "#08080A",
  gold: "#D4A537",
  warmGold: "#B8944F",
  cream: "#FDFBF7",
  white: "#FFFFFF",
  // Extended brand from FCTG-Brand-Colors.docx
  orangeCTA: "#E76F21",
  emerald: "#043927",
  slateGray: "#606060",
  brightGold: "#D4AF37",
  antiqueGold: "#C49A3C",
  lightGold: "#F0D78C",
  goldCream: "#FDF5E2",
  goldTint: "#FDF8EC",
  hoverGold: "#DBB68C",
  offWhite: "#F5F5F5",
  warmWhite: "#FFFBF0",
  grayWhite: "#F3F3F3",
  charcoal: "#2D2D2D",
  burntOrange: "#CC5500",
  deepEmerald: "#065238",
  darkLeather: "#614536",
  coralRed: "#FF6B6B",
  darkGold: "#B8860B",
  sageGreen: "#3F494A",
};

// ---- Slide Generators by Type ----

function uid(): string {
  return crypto.randomUUID();
}

export function createIntroSlide(palette: string[], styles: GlobalStyles): Slide {
  return {
    id: uid(),
    order: 0,
    slideType: "intro",
    layout: "default",
    backgroundColor: palette[0],
    backgroundPattern: "none",
    patternOpacity: 10,
    showSubtitle: true,
    showTitle: true,
    showDescription: true,
    showImage: false,
    showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 280, width: 920, height: 40, rotation: 0,
        content: "Your amazing subtitle goes here",
        fontSize: 20, fontFamily: styles.bodyFont, fontWeight: "400",
        textAlign: "left", color: palette[2], lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 330, width: 920, height: 160, rotation: 0,
        content: "Amazing Catchy Title Goes Right Here!",
        fontSize: 56, fontFamily: styles.headingFont, fontWeight: "700",
        textAlign: "left", color: palette[3], accentColor: palette[1],
        lineHeight: 1.15,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 510, width: 920, height: 60, rotation: 0,
        content: "Your amazing description goes here.",
        fontSize: 22, fontFamily: styles.bodyFont, fontWeight: "400",
        textAlign: "left", color: palette[2], lineHeight: 1.5,
      },
    ],
  };
}

export function createContentSlide(index: number, palette: string[], styles: GlobalStyles): Slide {
  return {
    id: uid(),
    order: index,
    slideType: "content",
    layout: "default",
    backgroundColor: palette[0],
    backgroundPattern: "none",
    patternOpacity: 10,
    showSubtitle: false,
    showTitle: true,
    showDescription: true,
    showImage: true,
    showCta: false,
    elements: [
      {
        id: uid(), type: "slideNumber", visible: true,
        x: 460, y: 260, width: 60, height: 60, rotation: 0,
        content: String(index),
        fontSize: 24, fontFamily: styles.headingFont, fontWeight: "700",
        textAlign: "center", color: palette[3],
        backgroundColor: palette[1], borderRadius: 8, padding: 12,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 350, width: 920, height: 80, rotation: 0,
        content: "Section Title",
        fontSize: 42, fontFamily: styles.headingFont, fontWeight: "700",
        textAlign: "center", color: palette[3], lineHeight: 1.2,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 450, width: 920, height: 60, rotation: 0,
        content: "Put your content here.",
        fontSize: 22, fontFamily: styles.bodyFont, fontWeight: "400",
        textAlign: "center", color: palette[2], lineHeight: 1.5,
      },
      {
        id: uid(), type: "image", visible: true,
        x: 140, y: 540, width: 800, height: 280, rotation: 0,
        placeholder: "Click to add image",
        borderRadius: 12, opacity: 1,
      },
    ],
  };
}

export function createOutroSlide(total: number, palette: string[], styles: GlobalStyles): Slide {
  return {
    id: uid(),
    order: total - 1,
    slideType: "outro",
    layout: "default",
    backgroundColor: palette[0],
    backgroundPattern: "noise",
    patternOpacity: 8,
    showSubtitle: true,
    showTitle: true,
    showDescription: false,
    showImage: false,
    showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 280, width: 920, height: 40, rotation: 0,
        content: "Your amazing subtitle goes here",
        fontSize: 20, fontFamily: styles.bodyFont, fontWeight: "400",
        textAlign: "left", color: palette[2], lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 330, width: 920, height: 160, rotation: 0,
        content: "Your amazing ending note goes here!",
        fontSize: 52, fontFamily: styles.headingFont, fontWeight: "700",
        textAlign: "left", color: palette[3], accentColor: palette[1],
        lineHeight: 1.15,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 520, width: 220, height: 52, rotation: 0,
        content: "Call to Action",
        fontSize: 18, fontFamily: styles.bodyFont, fontWeight: "600",
        textAlign: "center", color: palette[0],
        backgroundColor: palette[2], borderRadius: 8, padding: 14,
      },
    ],
  };
}

export function generateSlides(count: number, palette: string[], styles: GlobalStyles): Slide[] {
  const slides: Slide[] = [];
  // First slide is always intro
  slides.push(createIntroSlide(palette, styles));
  // Middle slides are content (numbered 1 through count-2)
  for (let i = 1; i < count - 1; i++) {
    slides.push(createContentSlide(i, palette, styles));
  }
  // Last slide is always outro
  if (count > 1) {
    slides.push(createOutroSlide(count, palette, styles));
  }
  return slides.map((s, i) => ({ ...s, order: i }));
}

export function createDefaultGlobalStyles(): GlobalStyles {
  return {
    headingFont: "General Sans",
    bodyFont: "General Sans",
    headingFontSize: 48,
    bodyFontSize: 22,
    customFontSizes: false,
    customFontPairing: false,
    // Default palette: Cream background, Gold accent, Charcoal body text, Dark Rum heading.
    // Lighter, more neutral starting canvas — users can switch to dark themes via the Combinations tab.
    colorPalette: [FCTG_BRAND_COLORS.cream, FCTG_BRAND_COLORS.gold, FCTG_BRAND_COLORS.charcoal, FCTG_BRAND_COLORS.darkRum],
    alternateColors: [FCTG_BRAND_COLORS.gold, FCTG_BRAND_COLORS.darkRum, FCTG_BRAND_COLORS.warmGold, FCTG_BRAND_COLORS.cream],
    alternateColorsEnabled: false,
    brandingEnabled: true,
    brandName: "From Chains To Glory",
    brandHandle: "@fromchainstoglory",
    brandColor: FCTG_BRAND_COLORS.gold,
    brandOnlyIntroOutro: false,
    brandBorder: false,
    brandShadow: false,
    brandCustomColor: false,
    brandCustomColorValue: "#333333",
    brandRoundness: 100,
    brandCustomSize: false,
    brandSizePreset: "medium",
    slideNumberEnabled: true,
    slideNumberStyle: "padded",
    swipeIndicatorEnabled: true,
    swipeText: "Next ▶",
    swipeStyle: "chevron",
    swipeIcon: "chevron",
    swipeIntroOnly: true,
    swipeShadow: false,
    bookmarkEnabled: false,
    decorativeElementsEnabled: true,
    decorativeOpacity: 15,
    decorativeRoundness: 50,
    slideNumberShadow: false,
    ctaShadow: true,
    qrCodeEnabled: false,
    watermarkEnabled: false,
    watermarkText: "",
    customFontFiles: [],
  };
}

// ─── Comparison Slide color helpers ─────────────────────────────────────────

/** Convert any color string to an `{r,g,b,a}` triple. Accepts #RGB, #RRGGBB,
   and `rgb()`/`rgba()` strings (so legacy slides whose backgroundColor was
   stored as `rgba(...)` still work). Returns null on parse failure. */
export function parseColor(input: string): { r: number; g: number; b: number; a: number } | null {
  if (!input) return null;
  const s = input.trim();
  // hex
  const hexMatch = s.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    const h = hexMatch[1];
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
      a: 1,
    };
  }
  // rgb / rgba
  const rgbMatch = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+)\s*)?\)$/i);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
      a: rgbMatch[4] != null ? parseFloat(rgbMatch[4]) : 1,
    };
  }
  return null;
}

export function hexToRgba(hex: string, alpha: number): string {
  const c = parseColor(hex);
  if (!c) return hex;
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
}

/** Convert any color (hex or rgba) back to a clean #RRGGBB string. */
export function toHex(input: string): string {
  const c = parseColor(input);
  if (!c) return input;
  return (
    "#" +
    [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

/** WCAG relative luminance (0–1). Used to pick a contrasting text color. */
export function relativeLuminance(hex: string): number {
  const c = parseColor(hex);
  if (!c) return 0;
  const norm = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * norm(c.r) + 0.7152 * norm(c.g) + 0.0722 * norm(c.b);
}

/** Suggest a high-contrast text color for a given background hex.
   Returns light cream for dark backgrounds and a dark charcoal for light
   ones. Used by the Solid fill auto-suggest. */
export function suggestTextColor(bgHex: string): string {
  return relativeLuminance(bgHex) < 0.45 ? "#FDFBF7" : "#1F2937";
}

/**
 * Compute the actual CSS `background` value for a comparison side, given its
 * stored swatch color, fillStyle, and fillAlpha. Centralizing this here lets
 * the renderer, the panel preview, and any future export code stay in sync.
 *
 * Back-compat: if the stored backgroundColor is already an `rgba(...)` string
 * (legacy slides written before fillStyle existed), we extract its hex and
 * alpha, treat it as glass mode, and emit the same value — so existing
 * carousels render identically until the user actively changes fill.
 */
export function computeSideBackground(side: ComparisonSide): string {
  const raw = side.backgroundColor || "#08080A";
  const hex = toHex(raw);

  // If fillStyle is missing AND raw is rgba (legacy), preserve the original
  // exactly — do not flip those slides to a different look on first render.
  const isLegacyRgba = side.fillStyle == null && /^rgba?\(/i.test(raw);
  if (isLegacyRgba) return raw;

  const style = side.fillStyle ?? "glass";
  const alpha = side.fillAlpha ?? 0.18;

  switch (style) {
    case "solid":
      return hex;
    case "gradient": {
      const top = hexToRgba(hex, 1);
      const bottom = hexToRgba(hex, Math.max(0.05, alpha));
      return `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`;
    }
    case "glass":
    default:
      return hexToRgba(hex, alpha);
  }
}

// ─── Comparison Slide factory + theme presets ──────────────────────────────
export function buildComparisonTheme(theme: ComparisonTheme): {
  global: ComparisonGlobalSettings;
  left: ComparisonSide;
  right: ComparisonSide;
} {
  switch (theme) {
    case "pro-con":
      return {
        global: { fontFamily: "General Sans", dividerStyle: "glow", dividerGlowColor: "#D4A537", theme: "pro-con", title: "Pros vs Cons" },
        left: {
          subheading: "Pros",
          items: ["Fast results", "Easy to use", "Great support"],
          backgroundColor: "#059669",
          textColor: "#FDFBF7",
          icon: "check",
          fillStyle: "glass",
          fillAlpha: 0.18,
        },
        right: {
          subheading: "Cons",
          items: ["High cost", "Steep learning curve", "Limited integrations"],
          backgroundColor: "#DC2626",
          textColor: "#FDFBF7",
          icon: "x",
          fillStyle: "glass",
          fillAlpha: 0.18,
        },
      };
    case "before-after":
      return {
        global: { fontFamily: "General Sans", dividerStyle: "glow", dividerGlowColor: "#D4A537", theme: "before-after", title: "Before vs After" },
        left: {
          subheading: "Before",
          items: ["Stuck in old patterns", "Reactive, not proactive", "Burned out"],
          backgroundColor: "#334155",
          textColor: "#FDFBF7",
          icon: "alert",
          fillStyle: "glass",
          fillAlpha: 0.30,
        },
        right: {
          subheading: "After",
          items: ["Clear vision", "Confident decisions", "Sustainable energy"],
          backgroundColor: "#D4A537",
          textColor: "#FDFBF7",
          icon: "trend-up",
          fillStyle: "glass",
          fillAlpha: 0.20,
        },
      };
    case "competitor":
      return {
        global: { fontFamily: "General Sans", dividerStyle: "solid", dividerGlowColor: "#60A5FA", theme: "competitor", title: "Why Choose Us" },
        left: {
          subheading: "Us",
          items: ["Proven framework", "24/7 support", "Custom strategy"],
          backgroundColor: "#1E40AF",
          textColor: "#FDFBF7",
          icon: "star",
          fillStyle: "glass",
          fillAlpha: 0.22,
        },
        right: {
          subheading: "Them",
          items: ["Generic templates", "Slow response", "One-size-fits-all"],
          backgroundColor: "#0B1E3F",
          textColor: "#FDFBF7",
          icon: "user",
          fillStyle: "glass",
          fillAlpha: 0.40,
        },
      };
    case "custom":
    default:
      return {
        global: { fontFamily: "General Sans", dividerStyle: "glow", dividerGlowColor: "#D4A537", theme: "custom", title: "Comparison" },
        left: {
          subheading: "Option A",
          items: ["Point one", "Point two", "Point three"],
          backgroundColor: "#D4A537",
          textColor: "#FDFBF7",
          icon: "check",
          fillStyle: "glass",
          fillAlpha: 0.18,
        },
        right: {
          subheading: "Option B",
          items: ["Point one", "Point two", "Point three"],
          backgroundColor: "#08080A",
          textColor: "#FDFBF7",
          icon: "star",
          fillStyle: "glass",
          fillAlpha: 0.45,
        },
      };
  }
}

/** Convert a content slide into a comparison slide (preserves id/order/background) */
export function applyComparisonLayout(slide: Slide, theme: ComparisonTheme = "pro-con"): Slide {
  const preset = buildComparisonTheme(theme);
  return {
    ...slide,
    layout: "comparison",
    // Keep a dark, premium backdrop so the glass effect reads correctly
    backgroundColor: slide.backgroundColor || "#08080A",
    backgroundGradient: slide.backgroundGradient || "linear-gradient(135deg, #08080A 0%, #1A1410 60%, #433B2B 100%)",
    elements: [],
    showSubtitle: false,
    showTitle: true,
    showDescription: false,
    showImage: false,
    showCta: false,
    comparisonGlobal: preset.global,
    comparisonLeft: preset.left,
    comparisonRight: preset.right,
  };
}

export function createDefaultProject(): CarouselProject {
  const styles = createDefaultGlobalStyles();
  const palette = styles.colorPalette;
  return {
    name: "Untitled Carousel",
    platform: "instagram",
    width: 1080,
    height: 1350,
    slideCount: 5,
    slides: generateSlides(5, palette, styles),
    globalStyles: styles,
  };
}
