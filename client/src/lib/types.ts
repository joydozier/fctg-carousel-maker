export interface SlideElement {
  id: string;
  type: "heading" | "subheading" | "body" | "cta" | "image" | "shape" | "slideNumber";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  opacity?: number;
  src?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  padding?: number;
}

export interface Slide {
  id: string;
  order: number;
  backgroundColor: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  backgroundPattern?: "none" | "dots" | "lines" | "diagonal" | "grid";
  patternOpacity?: number;
  elements: SlideElement[];
  layout: "default" | "quote" | "split" | "centered" | "minimal";
}

export interface CarouselProject {
  id?: number;
  name: string;
  platform: "instagram" | "linkedin" | "tiktok" | "facebook" | "x";
  width: number;
  height: number;
  slides: Slide[];
  globalStyles: GlobalStyles;
}

export interface GlobalStyles {
  headingFont: string;
  bodyFont: string;
  headingFontSize: number;
  bodyFontSize: number;
  colorPalette: string[];
  brandingEnabled: boolean;
  brandName: string;
  brandColor: string;
  slideNumberEnabled: boolean;
  slideNumberStyle: "plain" | "padded" | "hash" | "dot";
  swipeIndicatorEnabled: boolean;
  swipeText: string;
}

export interface ColorPaletteData {
  id?: number;
  name: string;
  colors: string[];
  isBuiltIn: boolean;
}

export const PLATFORM_SIZES: Record<string, { width: number; height: number; label: string }> = {
  "instagram-square": { width: 1080, height: 1080, label: "Instagram Square" },
  "instagram-portrait": { width: 1080, height: 1350, label: "Instagram Portrait" },
  "instagram-story": { width: 1080, height: 1920, label: "Instagram Story" },
  "linkedin": { width: 1080, height: 1080, label: "LinkedIn" },
  "tiktok": { width: 1080, height: 1920, label: "TikTok" },
  "facebook": { width: 1080, height: 1080, label: "Facebook" },
  "x": { width: 1080, height: 1080, label: "X (Twitter)" },
  "custom": { width: 1080, height: 1080, label: "Custom" },
};

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
  darkRum: "#433B2B",
  obsidian: "#08080A",
  gold: "#D4A537",
  warmGold: "#B8944F",
  cream: "#FDFBF7",
  white: "#FFFFFF",
};

export function createDefaultSlide(order: number, palette: string[]): Slide {
  const id = crypto.randomUUID();
  return {
    id,
    order,
    backgroundColor: palette[0] || "#1a1a2e",
    elements: [
      {
        id: crypto.randomUUID(),
        type: "heading",
        x: 80,
        y: order === 0 ? 300 : 200,
        width: 920,
        height: 120,
        rotation: 0,
        content: order === 0 ? "Your Title Here" : `Slide ${order + 1}`,
        fontSize: order === 0 ? 64 : 48,
        fontFamily: "General Sans",
        fontWeight: "700",
        textAlign: "center",
        color: palette[3] || "#ffffff",
        lineHeight: 1.2,
      },
      {
        id: crypto.randomUUID(),
        type: "body",
        x: 80,
        y: order === 0 ? 450 : 360,
        width: 920,
        height: 200,
        rotation: 0,
        content: order === 0 ? "Swipe to learn more" : "Add your content here. Click to edit this text and make it your own.",
        fontSize: 24,
        fontFamily: "General Sans",
        fontWeight: "400",
        textAlign: "center",
        color: palette[2] || "#cccccc",
        lineHeight: 1.6,
      },
    ],
    layout: "default",
    backgroundPattern: "none",
    patternOpacity: 10,
  };
}

export function createDefaultProject(): CarouselProject {
  const palette = [FCTG_BRAND_COLORS.darkRum, FCTG_BRAND_COLORS.gold, FCTG_BRAND_COLORS.cream, FCTG_BRAND_COLORS.cream];
  return {
    name: "Untitled Carousel",
    platform: "instagram",
    width: 1080,
    height: 1080,
    slides: [
      createDefaultSlide(0, palette),
      createDefaultSlide(1, palette),
      createDefaultSlide(2, palette),
      createDefaultSlide(3, palette),
      createDefaultSlide(4, palette),
    ],
    globalStyles: {
      headingFont: "General Sans",
      bodyFont: "General Sans",
      headingFontSize: 48,
      bodyFontSize: 24,
      colorPalette: palette,
      brandingEnabled: true,
      brandName: "From Chains To Glory",
      brandColor: FCTG_BRAND_COLORS.gold,
      slideNumberEnabled: true,
      slideNumberStyle: "padded",
      swipeIndicatorEnabled: true,
      swipeText: "Swipe →",
    },
  };
}
