/**
 * FCTG brand palette + curated combination library.
 *
 * - BRAND_FAMILIES: every named brand color, grouped exactly like the
 *   FCTG-Brand-Colors.docx spec (Gold Family / Neutral Family / Accent Colors),
 *   plus the Core swatches we already use across the editor.
 * - PALETTE_COLLECTIONS: ready-to-apply 4-color palettes ([bg, accent, body, heading]).
 *   Heavy emphasis on FCTG-aligned combos, plus a wide library of other
 *   brand-friendly presets for variety (modern minimalism, editorial, vibrant,
 *   monochrome, etc.).
 *
 * Keep this file flat data only \u2014 no React, no store imports.
 */

export interface BrandSwatch {
  name: string;
  hex: string;
  /** Optional usage note; surfaced as a tooltip in the Colors panel. */
  usage?: string;
}

export interface BrandFamily {
  id: string;
  title: string;
  /** Short description shown under the title. */
  subtitle?: string;
  swatches: BrandSwatch[];
}

export interface PalettePreset {
  id: string;
  name: string;
  /** [background, accent, bodyText, headingText] */
  colors: [string, string, string, string];
}

export interface PaletteCollection {
  id: string;
  title: string;
  subtitle?: string;
  presets: PalettePreset[];
}

// ---------------------------------------------------------------------------
// Brand Families
// ---------------------------------------------------------------------------

export const BRAND_FAMILIES: BrandFamily[] = [
  {
    id: "fctg-core",
    title: "FCTG Core",
    subtitle: "Primary identity colors",
    swatches: [
      { name: "Dark Rum", hex: "#433B2B", usage: "Primary dark background" },
      { name: "Obsidian", hex: "#08080A", usage: "Hero backgrounds, darkest sections" },
      { name: "Gold", hex: "#D4A537", usage: "Headings, accents, borders" },
      { name: "Cream", hex: "#FDFBF7", usage: "Light section backgrounds" },
      { name: "Orange CTA", hex: "#E76F21", usage: "Call-to-action buttons" },
      { name: "Emerald", hex: "#043927", usage: "Afrocentric / cultural sections" },
      { name: "Slate Gray", hex: "#606060", usage: "Body text on light backgrounds" },
    ],
  },
  {
    id: "fctg-gold",
    title: "Gold Family",
    subtitle: "Metallic accents and highlights",
    swatches: [
      { name: "Gold", hex: "#D4A537", usage: "Primary gold" },
      { name: "Bright Gold", hex: "#D4AF37", usage: "Decorative accents" },
      { name: "Antique Gold", hex: "#C49A3C", usage: "Gold glint shadow" },
      { name: "Warm Gold", hex: "#B8944F", usage: "Metallic highlights" },
      { name: "Dark Gold", hex: "#B8860B", usage: "Rich gold variant" },
      { name: "Light Gold", hex: "#F0D78C", usage: "Soft gold backgrounds" },
      { name: "Gold Cream", hex: "#FDF5E2", usage: "Gold-tinted light backgrounds" },
      { name: "Gold Tint", hex: "#FDF8EC", usage: "Subtle warm tint" },
      { name: "Hover Gold", hex: "#DBB68C", usage: "Button hover states" },
    ],
  },
  {
    id: "fctg-neutral",
    title: "Neutral Family",
    subtitle: "Whites, grays, and dark text",
    swatches: [
      { name: "Pure White", hex: "#FFFFFF", usage: "Text on dark backgrounds" },
      { name: "Off White", hex: "#F5F5F5", usage: "Alternate light backgrounds" },
      { name: "Warm White", hex: "#FFFBF0", usage: "Warm-tinted backgrounds" },
      { name: "Gray White", hex: "#F3F3F3", usage: "Card backgrounds" },
      { name: "Cream", hex: "#FDFBF7", usage: "Body text containers" },
      { name: "Slate Gray", hex: "#606060", usage: "Body text on light" },
      { name: "Charcoal", hex: "#2D2D2D", usage: "Dark text on mid-tone" },
      { name: "Obsidian", hex: "#08080A", usage: "Darkest hero sections" },
    ],
  },
  {
    id: "fctg-accent",
    title: "Accent Colors",
    subtitle: "Emphasis, alerts, and decorative",
    swatches: [
      { name: "Orange CTA", hex: "#E76F21", usage: "All CTA buttons" },
      { name: "Burnt Orange", hex: "#CC5500", usage: "Secondary accent, emphasis" },
      { name: "Coral Red", hex: "#FF6B6B", usage: "Alert / emphasis" },
      { name: "Emerald", hex: "#043927", usage: "Afrocentric sections" },
      { name: "Deep Emerald", hex: "#065238", usage: "Emerald section gradient" },
      { name: "Sage Green", hex: "#3F494A", usage: "Muted green accents" },
      { name: "Dark Leather", hex: "#614536", usage: "Header border, warm brown" },
      { name: "Dark Rum", hex: "#433B2B", usage: "Primary dark fills" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Palette Collections
// Format: [bg, accent, body, heading]
// ---------------------------------------------------------------------------

export const PALETTE_COLLECTIONS: PaletteCollection[] = [
  {
    id: "fctg-signature",
    title: "FCTG Brand",
    subtitle: "On-brand combinations from the FCTG palette",
    presets: [
      { id: "fctg-cream-classic", name: "Cream Classic", colors: ["#FDFBF7", "#D4A537", "#2D2D2D", "#433B2B"] },
      { id: "fctg-dark-rum-hero", name: "Dark Rum Hero", colors: ["#433B2B", "#D4A537", "#FDFBF7", "#FDFBF7"] },
      { id: "fctg-obsidian-glow", name: "Obsidian Glow", colors: ["#08080A", "#D4A537", "#FDFBF7", "#FDFBF7"] },
      { id: "fctg-emerald-ascend", name: "Emerald Ascend", colors: ["#043927", "#D4A537", "#FDFBF7", "#F0D78C"] },
      { id: "fctg-leather-gold", name: "Leather & Gold", colors: ["#614536", "#D4A537", "#FDF5E2", "#FFFFFF"] },
      { id: "fctg-warm-cream", name: "Warm Cream", colors: ["#FFFBF0", "#B8944F", "#2D2D2D", "#433B2B"] },
      { id: "fctg-gold-cream", name: "Gold Cream", colors: ["#FDF5E2", "#B8860B", "#433B2B", "#08080A"] },
      { id: "fctg-burnt-orange", name: "Burnt Orange Power", colors: ["#08080A", "#CC5500", "#FDFBF7", "#D4A537"] },
      { id: "fctg-coral-call", name: "Coral Call", colors: ["#FFFBF0", "#FF6B6B", "#2D2D2D", "#433B2B"] },
      { id: "fctg-sage-stillness", name: "Sage Stillness", colors: ["#FDFBF7", "#3F494A", "#2D2D2D", "#043927"] },
      { id: "fctg-orange-cta", name: "Orange CTA", colors: ["#FDFBF7", "#E76F21", "#2D2D2D", "#08080A"] },
      { id: "fctg-mono-charcoal", name: "Charcoal Mono", colors: ["#F3F3F3", "#D4A537", "#2D2D2D", "#08080A"] },
    ],
  },
  {
    id: "modern-minimal",
    title: "Modern Minimal",
    subtitle: "Clean, spacious, contemporary",
    presets: [
      { id: "mm-snow", name: "Snow", colors: ["#FFFFFF", "#111827", "#374151", "#111827"] },
      { id: "mm-paper", name: "Paper", colors: ["#FAFAF9", "#0F172A", "#475569", "#0F172A"] },
      { id: "mm-fog", name: "Fog", colors: ["#F4F4F5", "#18181B", "#52525B", "#18181B"] },
      { id: "mm-linen", name: "Linen", colors: ["#F5F1EA", "#1F2937", "#4B5563", "#111827"] },
      { id: "mm-mist", name: "Mist", colors: ["#ECEFF1", "#263238", "#455A64", "#263238"] },
      { id: "mm-ink", name: "Pure Ink", colors: ["#FFFFFF", "#000000", "#404040", "#000000"] },
    ],
  },
  {
    id: "editorial-luxe",
    title: "Editorial Luxe",
    subtitle: "Magazine-grade, serif-friendly",
    presets: [
      { id: "el-vogue", name: "Vogue", colors: ["#FFFFFF", "#A88B6A", "#1A1A1A", "#1A1A1A"] },
      { id: "el-noir", name: "Noir", colors: ["#0A0A0A", "#C8A876", "#E5E5E5", "#FFFFFF"] },
      { id: "el-bordeaux", name: "Bordeaux", colors: ["#FAF7F2", "#7A1F2B", "#2C1810", "#7A1F2B"] },
      { id: "el-saffron", name: "Saffron", colors: ["#1C1814", "#E1A03F", "#F4E9D8", "#F4E9D8"] },
      { id: "el-pearl", name: "Pearl", colors: ["#F8F4ED", "#9C7B47", "#3E2F20", "#1C1814"] },
      { id: "el-ivory", name: "Ivory & Ink", colors: ["#FFF8E7", "#1B1B1B", "#3D3D3D", "#1B1B1B"] },
    ],
  },
  {
    id: "warm-sunset",
    title: "Warm Sunset",
    subtitle: "Terracotta, peach, golden hour",
    presets: [
      { id: "ws-terracotta", name: "Terracotta", colors: ["#F8E5D5", "#C66A4A", "#3E2723", "#8B3A1F"] },
      { id: "ws-peach", name: "Peach Cream", colors: ["#FFE5D9", "#FF8C6B", "#3E1F11", "#8B4513"] },
      { id: "ws-golden-hour", name: "Golden Hour", colors: ["#1A0F08", "#FF9E40", "#FFD9B5", "#FFD9B5"] },
      { id: "ws-sienna", name: "Sienna", colors: ["#FCF3E8", "#A0522D", "#3E2818", "#5C2C0E"] },
      { id: "ws-amber", name: "Amber", colors: ["#FFF8E1", "#F59E0B", "#1F1611", "#92400E"] },
      { id: "ws-rust", name: "Rust", colors: ["#FAF0E6", "#B7410E", "#2A1A12", "#7A2A09"] },
    ],
  },
  {
    id: "cool-calm",
    title: "Cool & Calm",
    subtitle: "Blues, teals, slate \u2014 reassuring",
    presets: [
      { id: "cc-ocean", name: "Ocean", colors: ["#F0F8FF", "#0077B6", "#1A2332", "#03045E"] },
      { id: "cc-arctic", name: "Arctic", colors: ["#E8F1F8", "#0EA5E9", "#0C2533", "#0C4A6E"] },
      { id: "cc-pine", name: "Pine", colors: ["#F0F4F1", "#1B4332", "#2D3A2E", "#0E1F18"] },
      { id: "cc-slate", name: "Slate", colors: ["#F1F5F9", "#475569", "#334155", "#0F172A"] },
      { id: "cc-mineral", name: "Mineral", colors: ["#0B132B", "#5BC0BE", "#E0FBFC", "#FFFFFF"] },
      { id: "cc-twilight", name: "Twilight", colors: ["#1E1B4B", "#A78BFA", "#E0E7FF", "#FFFFFF"] },
    ],
  },
  {
    id: "bold-vibrant",
    title: "Bold & Vibrant",
    subtitle: "Maximum attention, social-first",
    presets: [
      { id: "bv-electric", name: "Electric", colors: ["#0F0F0F", "#FFD60A", "#F2F2F2", "#FFD60A"] },
      { id: "bv-cyber", name: "Cyber", colors: ["#0D0221", "#FF006E", "#F1FAEE", "#FFBE0B"] },
      { id: "bv-tropic", name: "Tropic", colors: ["#FEFAE0", "#FF6F61", "#283618", "#606C38"] },
      { id: "bv-magenta", name: "Magenta Pop", colors: ["#FFFFFF", "#D62598", "#1A1A1A", "#831843"] },
      { id: "bv-lime", name: "Lime Strike", colors: ["#0F1108", "#A3E635", "#F7FEE7", "#FFFFFF"] },
      { id: "bv-citrus", name: "Citrus", colors: ["#FFF7E6", "#FF6B35", "#1A1A1A", "#D62828"] },
    ],
  },
  {
    id: "earth-grounded",
    title: "Earth & Grounded",
    subtitle: "Natural, organic, woody",
    presets: [
      { id: "eg-moss", name: "Moss", colors: ["#F4F1EA", "#5F7C4F", "#2B2B1F", "#3A4A2E"] },
      { id: "eg-clay", name: "Clay", colors: ["#EFE6DA", "#9C6B3F", "#2A1F14", "#5C3A1B"] },
      { id: "eg-stone", name: "Stone", colors: ["#E8E2D5", "#6B5D4F", "#2D2419", "#3E342A"] },
      { id: "eg-walnut", name: "Walnut", colors: ["#F4EDE0", "#5C4033", "#2B1810", "#3E2418"] },
      { id: "eg-olive", name: "Olive", colors: ["#FAF6E9", "#708238", "#2A2818", "#4A4F1F"] },
      { id: "eg-bark", name: "Bark", colors: ["#1F1813", "#C19A6B", "#F5EBD8", "#F5EBD8"] },
    ],
  },
  {
    id: "monochrome-tones",
    title: "Monochrome",
    subtitle: "Single-hue gradients of depth",
    presets: [
      { id: "mt-charcoal", name: "Charcoal", colors: ["#FAFAFA", "#404040", "#171717", "#000000"] },
      { id: "mt-navy", name: "Navy", colors: ["#F0F4F8", "#243B53", "#102A43", "#0A2540"] },
      { id: "mt-emerald", name: "Emerald Mono", colors: ["#ECFDF5", "#047857", "#064E3B", "#022C22"] },
      { id: "mt-violet", name: "Violet Mono", colors: ["#F5F3FF", "#6D28D9", "#3C1361", "#1E0B36"] },
      { id: "mt-rose", name: "Rose Mono", colors: ["#FFF1F2", "#BE123C", "#7F1D1D", "#4C0519"] },
      { id: "mt-graphite", name: "Graphite", colors: ["#1A1A1A", "#737373", "#E5E5E5", "#FFFFFF"] },
    ],
  },
  {
    id: "afrocentric",
    title: "Afrocentric & Cultural",
    subtitle: "Heritage palettes for cultural storytelling",
    presets: [
      { id: "afro-kente", name: "Kente", colors: ["#FFF8E7", "#D4A537", "#1C1208", "#7B2D26"] },
      { id: "afro-ankara", name: "Ankara", colors: ["#0E1F18", "#E76F21", "#FFD8A8", "#D4A537"] },
      { id: "afro-savanna", name: "Savanna", colors: ["#F5E6C8", "#A0522D", "#2C1810", "#5C2E0E"] },
      { id: "afro-pan", name: "Pan-African", colors: ["#0E0E0E", "#D4A537", "#FFFFFF", "#0F5132"] },
      { id: "afro-baobab", name: "Baobab", colors: ["#FAF0E6", "#5C2E0E", "#1F0F08", "#3E1F11"] },
      { id: "afro-twilight", name: "Sahel Dusk", colors: ["#2A1810", "#E76F21", "#FFEFD5", "#D4A537"] },
    ],
  },
];

/** Flat lookup of every preset, useful for "active palette" detection. */
export const ALL_PRESETS: PalettePreset[] = PALETTE_COLLECTIONS.flatMap((c) => c.presets);

/**
 * Return whether the given hex strings (case-insensitive, ignoring leading #)
 * match a preset's colors in order.
 */
export function isPaletteActive(current: string[], preset: PalettePreset): boolean {
  if (current.length !== preset.colors.length) return false;
  for (let i = 0; i < preset.colors.length; i++) {
    if ((current[i] ?? "").toLowerCase() !== preset.colors[i].toLowerCase()) return false;
  }
  return true;
}
