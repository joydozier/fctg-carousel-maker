import type { CarouselProject, Slide, SlideElement, GlobalStyles } from "@/lib/types";

function uid(): string { return crypto.randomUUID(); }

export interface BuiltInTemplate {
  name: string;
  description: string;
  templateCategory: "educational" | "story" | "interactive" | "platform";
  backgroundGradient: string;
  project: Omit<CarouselProject, "id">;
}

// ─── Helper: default GlobalStyles shell ───────────────────────────────────────
function makeGlobalStyles(
  headingFont: string,
  bodyFont: string,
  palette: string[],
): GlobalStyles {
  return {
    headingFont,
    bodyFont,
    headingFontSize: 48,
    bodyFontSize: 22,
    customFontSizes: false,
    customFontPairing: true,
    colorPalette: palette,
    alternateColors: [palette[1], palette[0], palette[3], palette[2]],
    alternateColorsEnabled: false,
    brandingEnabled: false,
    brandName: "Your Brand",
    brandHandle: "@yourbrand",
    brandColor: palette[1],
    brandOnlyIntroOutro: true,
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
    decorativeElementsEnabled: true,
    decorativeOpacity: 12,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 1 — Step-by-Step Tutorial
// Dark bg, electric lime accent | Clash Display + Satoshi | 8 slides
// ═══════════════════════════════════════════════════════════════════════════════
(function () { })(); // namespace separator

const t1_palette = ["#0F0F0F", "#C8FF00", "#CCCCCC", "#FFFFFF"];
const t1_styles = makeGlobalStyles("Clash Display", "Satoshi", t1_palette);

const t1_slides: Slide[] = [
  // Slide 0 — Intro
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#0F0F0F", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 220, width: 920, height: 44, rotation: 0,
        content: "STEP-BY-STEP GUIDE", fontSize: 16, fontFamily: "Satoshi",
        fontWeight: "600", textAlign: "left", color: "#C8FF00", lineHeight: 1.4,
        letterSpacing: 3, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 274, width: 920, height: 220, rotation: 0,
        content: "How to [Topic] in 5 Easy Steps", fontSize: 72,
        fontFamily: "Clash Display", fontWeight: "700", textAlign: "left",
        color: "#FFFFFF", accentColor: "#C8FF00", lineHeight: 1.1,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 514, width: 820, height: 80, rotation: 0,
        content: "The exact process that helped [result]. Swipe through each step to get started.",
        fontSize: 22, fontFamily: "Satoshi", fontWeight: "400",
        textAlign: "left", color: "#CCCCCC", lineHeight: 1.5,
      },
    ],
  },
  // Slides 1–6 — Content steps
  ...([1, 2, 3, 4, 5, 6].map((n): Slide => ({
    id: uid(), order: n, slideType: "content", layout: "default",
    backgroundColor: n % 2 === 0 ? "#0F0F0F" : "#141414",
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 180, width: 120, height: 44, rotation: 0,
        content: `0${n}`, fontSize: 64, fontFamily: "Clash Display",
        fontWeight: "700", textAlign: "left", color: "#C8FF00", lineHeight: 1,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 270, width: 920, height: 140, rotation: 0,
        content: [
          "Define Your Goal Clearly",
          "Research Your Audience",
          "Build Your Content Outline",
          "Create a First Draft",
          "Review and Refine",
          "Publish and Promote",
        ][n - 1],
        fontSize: 58, fontFamily: "Clash Display", fontWeight: "700",
        textAlign: "left", color: "#FFFFFF", lineHeight: 1.15,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 430, width: 920, height: 120, rotation: 0,
        content: [
          "Write down exactly what success looks like. Vague goals produce vague results — be specific about what you want to achieve and by when.",
          "Spend 30 minutes understanding who you're talking to. What do they already know? What frustrates them? What outcome do they want?",
          "Map out each section before writing a single word. A good outline makes the actual writing 3× faster and keeps your message coherent.",
          "Write without editing. Get all your ideas onto the page first. Perfectionism at this stage kills momentum — you can fix it later.",
          "Read it out loud, cut anything that doesn't add value, and check that each section flows naturally into the next.",
          "Choose the right platform for your audience, schedule at peak engagement times, and repurpose across channels for maximum reach.",
        ][n - 1],
        fontSize: 22, fontFamily: "Satoshi", fontWeight: "400",
        textAlign: "left", color: "#CCCCCC", lineHeight: 1.6,
      },
    ],
  }))),
  // Slide 7 — Outro
  {
    id: uid(), order: 7, slideType: "outro", layout: "default",
    backgroundColor: "#0F0F0F", backgroundPattern: "noise", patternOpacity: 8,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 220, width: 920, height: 40, rotation: 0,
        content: "FOUND THIS USEFUL?", fontSize: 16, fontFamily: "Satoshi",
        fontWeight: "600", textAlign: "left", color: "#C8FF00", lineHeight: 1.4,
        letterSpacing: 3, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 270, width: 920, height: 200, rotation: 0,
        content: "Save this post and share it with someone who needs it!",
        fontSize: 60, fontFamily: "Clash Display", fontWeight: "700",
        textAlign: "left", color: "#FFFFFF", accentColor: "#C8FF00", lineHeight: 1.15,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 510, width: 260, height: 56, rotation: 0,
        content: "Follow for More Tips",
        fontSize: 18, fontFamily: "Satoshi", fontWeight: "700",
        textAlign: "center", color: "#0F0F0F",
        backgroundColor: "#C8FF00", borderRadius: 4, padding: 16,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 2 — Framework Breakdown
// Clean white, cobalt accent | Cabinet Grotesk + General Sans | 10 slides
// ═══════════════════════════════════════════════════════════════════════════════
const t2_palette = ["#FFFFFF", "#2563EB", "#374151", "#111827"];
const t2_styles = makeGlobalStyles("Cabinet Grotesk", "General Sans", t2_palette);

const t2_stages = [
  { label: "DIAGNOSE", title: "Identify the Core Problem", body: "Before solutions, understand the root cause. Most people jump to fixes before they truly understand what's broken. Spend time here." },
  { label: "DESIGN", title: "Map Your Ideal Outcome", body: "Define what success looks like in measurable terms. Work backwards from the end state to create a clear roadmap." },
  { label: "DEVELOP", title: "Build in Small Iterations", body: "Don't wait for perfect. Ship small versions fast, gather feedback, and improve. Progress beats perfection every time." },
  { label: "DEPLOY", title: "Execute with Consistency", body: "Most strategies fail at implementation. Create systems that remove friction and keep you accountable to daily action." },
  { label: "DEBRIEF", title: "Review, Learn & Iterate", body: "Schedule a weekly debrief. What worked? What didn't? The data in your results is your best teacher." },
];

const t2_slides: Slide[] = [
  // Intro
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#FFFFFF", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 200, width: 920, height: 40, rotation: 0,
        content: "The 5D Framework", fontSize: 18, fontFamily: "General Sans",
        fontWeight: "600", textAlign: "left", color: "#2563EB", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 250, width: 920, height: 220, rotation: 0,
        content: "The [Framework] Method That Changes Everything",
        fontSize: 64, fontFamily: "Cabinet Grotesk", fontWeight: "800",
        textAlign: "left", color: "#111827", accentColor: "#2563EB", lineHeight: 1.1,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 490, width: 860, height: 80, rotation: 0,
        content: "A proven 5-stage process used by top performers to solve complex problems and get consistent results. Swipe to explore each stage.",
        fontSize: 22, fontFamily: "General Sans", fontWeight: "400",
        textAlign: "left", color: "#374151", lineHeight: 1.5,
      },
    ],
  },
  // Overview slide
  {
    id: uid(), order: 1, slideType: "content", layout: "default",
    backgroundColor: "#2563EB", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: false, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 200, width: 920, height: 120, rotation: 0,
        content: "5 Stages at a Glance", fontSize: 58, fontFamily: "Cabinet Grotesk",
        fontWeight: "800", textAlign: "left", color: "#FFFFFF", lineHeight: 1.1,
      },
      ...(t2_stages.map((s, i): SlideElement => ({
        id: uid(), type: "body", visible: true,
        x: 80, y: 350 + i * 70, width: 920, height: 60, rotation: 0,
        content: `${i + 1}. ${s.label} — ${s.title}`,
        fontSize: 22, fontFamily: "General Sans", fontWeight: i === 0 ? "600" : "400",
        textAlign: "left", color: "#FFFFFF", lineHeight: 1.4,
      }))),
    ],
  },
  // Stage slides
  ...t2_stages.map((s, i): Slide => ({
    id: uid(), order: i + 2, slideType: "content", layout: "default",
    backgroundColor: "#FFFFFF", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 180, width: 200, height: 36, rotation: 0,
        content: `Stage ${i + 1} of 5`, fontSize: 16, fontFamily: "General Sans",
        fontWeight: "500", textAlign: "left", color: "#2563EB", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 226, width: 920, height: 60, rotation: 0,
        content: s.label, fontSize: 72, fontFamily: "Cabinet Grotesk",
        fontWeight: "800", textAlign: "left", color: "#2563EB", lineHeight: 1,
        letterSpacing: 2, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 314, width: 920, height: 100, rotation: 0,
        content: s.title, fontSize: 42, fontFamily: "Cabinet Grotesk",
        fontWeight: "700", textAlign: "left", color: "#111827", lineHeight: 1.2,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 434, width: 920, height: 140, rotation: 0,
        content: s.body, fontSize: 23, fontFamily: "General Sans", fontWeight: "400",
        textAlign: "left", color: "#374151", lineHeight: 1.6,
      },
    ],
  })),
  // Summary slide
  {
    id: uid(), order: 7, slideType: "content", layout: "default",
    backgroundColor: "#F9FAFB", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: false, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 180, width: 920, height: 120, rotation: 0,
        content: "The Framework in Summary", fontSize: 52, fontFamily: "Cabinet Grotesk",
        fontWeight: "800", textAlign: "left", color: "#111827", lineHeight: 1.15,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 320, width: 920, height: 400, rotation: 0,
        content: "Diagnose the real problem → Design your ideal outcome → Develop iteratively → Deploy with systems → Debrief weekly.\n\nRepeat this cycle and you'll compound your results faster than you thought possible.",
        fontSize: 22, fontFamily: "General Sans", fontWeight: "400",
        textAlign: "left", color: "#374151", lineHeight: 1.6,
      },
    ],
  },
  // Outro
  {
    id: uid(), order: 8, slideType: "outro", layout: "default",
    backgroundColor: "#111827", backgroundPattern: "noise", patternOpacity: 6,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 200, width: 920, height: 40, rotation: 0,
        content: "Which stage are you stuck on?",
        fontSize: 20, fontFamily: "General Sans", fontWeight: "500",
        textAlign: "left", color: "#2563EB", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 250, width: 920, height: 220, rotation: 0,
        content: "Drop your answer in the comments below.",
        fontSize: 60, fontFamily: "Cabinet Grotesk", fontWeight: "800",
        textAlign: "left", color: "#FFFFFF", accentColor: "#2563EB", lineHeight: 1.15,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 500, width: 280, height: 56, rotation: 0,
        content: "Save This Framework",
        fontSize: 18, fontFamily: "General Sans", fontWeight: "600",
        textAlign: "center", color: "#FFFFFF",
        backgroundColor: "#2563EB", borderRadius: 6, padding: 16,
      },
    ],
  },
  // Slide index 9 (10th slide)
  {
    id: uid(), order: 9, slideType: "outro", layout: "default",
    backgroundColor: "#2563EB", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: false, showTitle: true, showDescription: true,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 220, width: 920, height: 200, rotation: 0,
        content: "Follow for more frameworks like this.",
        fontSize: 58, fontFamily: "Cabinet Grotesk", fontWeight: "800",
        textAlign: "left", color: "#FFFFFF", lineHeight: 1.15,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 440, width: 920, height: 80, rotation: 0,
        content: "New post every week. No fluff — just proven processes.",
        fontSize: 22, fontFamily: "General Sans", fontWeight: "400",
        textAlign: "left", color: "#DBEAFE", lineHeight: 1.5,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 550, width: 200, height: 52, rotation: 0,
        content: "Follow Now",
        fontSize: 18, fontFamily: "General Sans", fontWeight: "700",
        textAlign: "center", color: "#2563EB",
        backgroundColor: "#FFFFFF", borderRadius: 6, padding: 14,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 3 — Data Storytelling
// Deep navy bg, amber accent | Bebas Neue + Open Sans | 7 slides
// ═══════════════════════════════════════════════════════════════════════════════
const t3_palette = ["#0A1628", "#F59E0B", "#94A3B8", "#E2E8F0"];
const t3_styles = makeGlobalStyles("Bebas Neue", "Open Sans", t3_palette);

const t3_stats = [
  { stat: "87%", label: "of people forget information within 24 hours without visual anchors.", context: "The Forgetting Curve" },
  { stat: "3.2×", label: "more likely to be shared — content with strong data visuals.", context: "Content Sharing Study" },
  { stat: "$4.6T", label: "in value created annually by data-driven decision making globally.", context: "McKinsey Global Institute" },
  { stat: "68%", label: "of marketers say data storytelling drives their best-performing posts.", context: "HubSpot 2025 Report" },
  { stat: "12 Sec", label: "— the average attention span before a reader decides to scroll away.", context: "Microsoft Research" },
];

const t3_slides: Slide[] = [
  // Intro
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#0A1628",
    backgroundGradient: "linear-gradient(160deg, #0A1628 60%, #0F2340 100%)",
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 200, width: 920, height: 40, rotation: 0,
        content: "DATA STORYTELLING", fontSize: 15, fontFamily: "Open Sans",
        fontWeight: "700", textAlign: "left", color: "#F59E0B", lineHeight: 1.4,
        letterSpacing: 4, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 250, width: 920, height: 220, rotation: 0,
        content: "5 Stats That Will Change How You Think About [Topic]",
        fontSize: 68, fontFamily: "Bebas Neue", fontWeight: "400",
        textAlign: "left", color: "#E2E8F0", accentColor: "#F59E0B", lineHeight: 1.1,
        letterSpacing: 1,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 490, width: 860, height: 80, rotation: 0,
        content: "Each slide = one powerful number with the context you actually need. No filler.",
        fontSize: 22, fontFamily: "Open Sans", fontWeight: "400",
        textAlign: "left", color: "#94A3B8", lineHeight: 1.5,
      },
    ],
  },
  // Stat slides
  ...t3_stats.map((s, i): Slide => ({
    id: uid(), order: i + 1, slideType: "content", layout: "default",
    backgroundColor: i % 2 === 0 ? "#0A1628" : "#061020",
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 160, width: 920, height: 36, rotation: 0,
        content: s.context, fontSize: 15, fontFamily: "Open Sans",
        fontWeight: "600", textAlign: "left", color: "#F59E0B", lineHeight: 1.4,
        letterSpacing: 2, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 210, width: 920, height: 180, rotation: 0,
        content: s.stat, fontSize: 160, fontFamily: "Bebas Neue", fontWeight: "400",
        textAlign: "left", color: "#F59E0B", lineHeight: 0.95,
        letterSpacing: 2,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 410, width: 920, height: 120, rotation: 0,
        content: s.label, fontSize: 26, fontFamily: "Open Sans", fontWeight: "400",
        textAlign: "left", color: "#E2E8F0", lineHeight: 1.5,
      },
    ],
  })),
  // Outro
  {
    id: uid(), order: 6, slideType: "outro", layout: "default",
    backgroundColor: "#0A1628", backgroundPattern: "noise", patternOpacity: 8,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 200, width: 920, height: 40, rotation: 0,
        content: "THE TAKEAWAY", fontSize: 15, fontFamily: "Open Sans",
        fontWeight: "700", textAlign: "left", color: "#F59E0B", lineHeight: 1.4,
        letterSpacing: 4, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 248, width: 920, height: 200, rotation: 0,
        content: "Data without story is just noise. Tell the story.",
        fontSize: 64, fontFamily: "Bebas Neue", fontWeight: "400",
        textAlign: "left", color: "#E2E8F0", accentColor: "#F59E0B",
        lineHeight: 1.1, letterSpacing: 1,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 480, width: 240, height: 56, rotation: 0,
        content: "Save for Reference",
        fontSize: 17, fontFamily: "Open Sans", fontWeight: "700",
        textAlign: "center", color: "#0A1628",
        backgroundColor: "#F59E0B", borderRadius: 4, padding: 16,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 4 — Things I Wish I Knew
// Warm earth tones | Playfair Display + Lato | 6 slides
// ═══════════════════════════════════════════════════════════════════════════════
const t4_palette = ["#FAF5EE", "#C2714F", "#5C4033", "#2C1810"];
const t4_styles = makeGlobalStyles("Playfair Display", "Lato", t4_palette);

const t4_lessons = [
  { num: "01", title: "Done beats perfect every time.", body: "I spent months polishing things nobody saw. The work that shipped — even imperfectly — is the only work that ever mattered. Ship first, iterate forever." },
  { num: "02", title: "Your network is your net worth.", body: "I resisted networking for years. The opportunities I have today came entirely from relationships I almost didn't make. Invest in people before you need them." },
  { num: "03", title: "Say no to almost everything.", body: "Every yes to the wrong thing is a no to the right thing. Protect your time with the same ferocity you protect your money — it's rarer and irreplaceable." },
  { num: "04", title: "Consistency compounds faster than talent.", body: "The most talented people I know aren't the most successful. The most consistent ones are. Show up every day — especially when you don't feel like it." },
];

const t4_slides: Slide[] = [
  // Intro
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#FAF5EE", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 200, width: 920, height: 40, rotation: 0,
        content: "Personal lessons from 10 years in the industry",
        fontSize: 20, fontFamily: "Lato", fontWeight: "400",
        textAlign: "left", color: "#C2714F", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 250, width: 920, height: 260, rotation: 0,
        content: "4 Things I Wish Someone Had Told Me Earlier",
        fontSize: 66, fontFamily: "Playfair Display", fontWeight: "700",
        textAlign: "left", color: "#2C1810", accentColor: "#C2714F", lineHeight: 1.15,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 530, width: 860, height: 80, rotation: 0,
        content: "Hard-won lessons I learned the expensive way. Swipe to save yourself the same pain.",
        fontSize: 22, fontFamily: "Lato", fontWeight: "400",
        textAlign: "left", color: "#5C4033", lineHeight: 1.5,
      },
    ],
  },
  // Lesson slides
  ...t4_lessons.map((l, i): Slide => ({
    id: uid(), order: i + 1, slideType: "content", layout: "default",
    backgroundColor: i % 2 === 0 ? "#FAF5EE" : "#F5EDE0",
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 180, width: 100, height: 60, rotation: 0,
        content: l.num, fontSize: 48, fontFamily: "Playfair Display", fontWeight: "700",
        textAlign: "left", color: "#C2714F", lineHeight: 1,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 256, width: 920, height: 160, rotation: 0,
        content: l.title, fontSize: 52, fontFamily: "Playfair Display", fontWeight: "700",
        textAlign: "left", color: "#2C1810", lineHeight: 1.2,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 434, width: 920, height: 180, rotation: 0,
        content: l.body, fontSize: 23, fontFamily: "Lato", fontWeight: "400",
        textAlign: "left", color: "#5C4033", lineHeight: 1.6,
      },
    ],
  })),
  // Outro
  {
    id: uid(), order: 5, slideType: "outro", layout: "default",
    backgroundColor: "#2C1810", backgroundPattern: "noise", patternOpacity: 10,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 220, width: 920, height: 40, rotation: 0,
        content: "Which one hit home for you?",
        fontSize: 20, fontFamily: "Lato", fontWeight: "400",
        textAlign: "left", color: "#C2714F", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 270, width: 920, height: 220, rotation: 0,
        content: "Share this with someone who needs to hear it.",
        fontSize: 58, fontFamily: "Playfair Display", fontWeight: "700",
        textAlign: "left", color: "#FAF5EE", accentColor: "#C2714F", lineHeight: 1.2,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 520, width: 240, height: 56, rotation: 0,
        content: "Follow for More",
        fontSize: 18, fontFamily: "Lato", fontWeight: "700",
        textAlign: "center", color: "#2C1810",
        backgroundColor: "#C2714F", borderRadius: 6, padding: 14,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 5 — Before & After
// High contrast dark/white | Montserrat + Open Sans | 5 slides
// ═══════════════════════════════════════════════════════════════════════════════
const t5_palette = ["#18181B", "#FF6B35", "#A1A1AA", "#FAFAFA"];
const t5_styles = makeGlobalStyles("Montserrat", "Open Sans", t5_palette);

const t5_slides: Slide[] = [
  // Intro
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#18181B", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 200, width: 920, height: 40, rotation: 0,
        content: "TRANSFORMATION STORY", fontSize: 15, fontFamily: "Open Sans",
        fontWeight: "700", textAlign: "left", color: "#FF6B35", lineHeight: 1.4,
        letterSpacing: 3, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 250, width: 920, height: 250, rotation: 0,
        content: "Before & After: The [Transformation] Story",
        fontSize: 72, fontFamily: "Montserrat", fontWeight: "900",
        textAlign: "left", color: "#FAFAFA", accentColor: "#FF6B35", lineHeight: 1.1,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 520, width: 860, height: 80, rotation: 0,
        content: "What changed, how it changed, and what made the difference. A real transformation in 5 slides.",
        fontSize: 22, fontFamily: "Open Sans", fontWeight: "400",
        textAlign: "left", color: "#A1A1AA", lineHeight: 1.5,
      },
    ],
  },
  // Before slide
  {
    id: uid(), order: 1, slideType: "content", layout: "default",
    backgroundColor: "#27272A", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 160, width: 200, height: 50, rotation: 0,
        content: "BEFORE", fontSize: 48, fontFamily: "Montserrat", fontWeight: "900",
        textAlign: "left", color: "#A1A1AA", lineHeight: 1,
        letterSpacing: 3, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 230, width: 920, height: 160, rotation: 0,
        content: "The Situation Before Everything Changed",
        fontSize: 50, fontFamily: "Montserrat", fontWeight: "800",
        textAlign: "left", color: "#FAFAFA", lineHeight: 1.2,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 410, width: 920, height: 200, rotation: 0,
        content: "Describe the starting point honestly. What was broken, painful, or inefficient? What did a typical day look like? The more specific and relatable this is, the more powerful the transformation will feel.",
        fontSize: 22, fontFamily: "Open Sans", fontWeight: "400",
        textAlign: "left", color: "#A1A1AA", lineHeight: 1.6,
      },
    ],
  },
  // Turning point
  {
    id: uid(), order: 2, slideType: "content", layout: "default",
    backgroundColor: "#FF6B35", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 160, width: 600, height: 40, rotation: 0,
        content: "THE TURNING POINT", fontSize: 15, fontFamily: "Open Sans",
        fontWeight: "700", textAlign: "left", color: "#18181B", lineHeight: 1.4,
        letterSpacing: 3, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 210, width: 920, height: 200, rotation: 0,
        content: "The Exact Moment That Made Me Change Everything",
        fontSize: 58, fontFamily: "Montserrat", fontWeight: "900",
        textAlign: "left", color: "#18181B", lineHeight: 1.1,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 430, width: 920, height: 160, rotation: 0,
        content: "Describe the catalyst — the realization, conversation, failure, or event that forced a decision. What did you decide to do differently? This is the emotional core of your transformation story.",
        fontSize: 22, fontFamily: "Open Sans", fontWeight: "400",
        textAlign: "left", color: "#2D1A12", lineHeight: 1.6,
      },
    ],
  },
  // After slide
  {
    id: uid(), order: 3, slideType: "content", layout: "default",
    backgroundColor: "#FAFAFA", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 160, width: 200, height: 50, rotation: 0,
        content: "AFTER", fontSize: 48, fontFamily: "Montserrat", fontWeight: "900",
        textAlign: "left", color: "#FF6B35", lineHeight: 1,
        letterSpacing: 3, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 230, width: 920, height: 160, rotation: 0,
        content: "The Results After Making the Change",
        fontSize: 50, fontFamily: "Montserrat", fontWeight: "800",
        textAlign: "left", color: "#18181B", lineHeight: 1.2,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 410, width: 920, height: 200, rotation: 0,
        content: "Share the concrete outcomes — numbers, feelings, habits, relationships. What does your life/work look like now? Specifics build credibility and inspire belief that the same transformation is possible for your reader.",
        fontSize: 22, fontFamily: "Open Sans", fontWeight: "400",
        textAlign: "left", color: "#3F3F46", lineHeight: 1.6,
      },
    ],
  },
  // Outro
  {
    id: uid(), order: 4, slideType: "outro", layout: "default",
    backgroundColor: "#18181B", backgroundPattern: "noise", patternOpacity: 8,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 220, width: 920, height: 40, rotation: 0,
        content: "Your transformation is possible too.",
        fontSize: 20, fontFamily: "Open Sans", fontWeight: "400",
        textAlign: "left", color: "#FF6B35", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 270, width: 920, height: 220, rotation: 0,
        content: "What would your 'After' look like?",
        fontSize: 64, fontFamily: "Montserrat", fontWeight: "900",
        textAlign: "left", color: "#FAFAFA", accentColor: "#FF6B35", lineHeight: 1.15,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 520, width: 260, height: 56, rotation: 0,
        content: "Share Your Story",
        fontSize: 18, fontFamily: "Open Sans", fontWeight: "700",
        textAlign: "center", color: "#18181B",
        backgroundColor: "#FF6B35", borderRadius: 6, padding: 16,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 6 — Behind the Scenes
// Muted warm tones | General Sans + General Sans | 6 slides
// ═══════════════════════════════════════════════════════════════════════════════
const t6_palette = ["#F0EBE3", "#8B7355", "#6B6057", "#1A1410"];
const t6_styles = makeGlobalStyles("General Sans", "General Sans", t6_palette);

const t6_bts = [
  { title: "The Messy Reality of [Project]", body: "This is not the polished version. This is what it actually looked like — the sticky notes, the failed attempts, the pivots, and the 'what are we doing' moments. The final result hides all of this." },
  { title: "What We Tried (That Didn't Work)", body: "Version 1 was too complex. Version 2 was too simple. Version 3 was almost there but fundamentally broken. Three weeks of iteration before we had anything worth showing." },
  { title: "The Decision That Changed Everything", body: "We almost scrapped the whole thing at week four. Then someone asked a simple question that reframed the entire problem. This is the moment we stopped making it harder than it needed to be." },
  { title: "How the Final Version Came Together", body: "Once we had the right framing, everything clicked into place within 48 hours. The constraint we resented became the creative edge that made it work." },
];

const t6_slides: Slide[] = [
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#F0EBE3", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 200, width: 920, height: 40, rotation: 0,
        content: "Behind the Scenes", fontSize: 20, fontFamily: "General Sans",
        fontWeight: "500", textAlign: "left", color: "#8B7355", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 248, width: 920, height: 240, rotation: 0,
        content: "What Building [Project] Really Looks Like",
        fontSize: 62, fontFamily: "General Sans", fontWeight: "700",
        textAlign: "left", color: "#1A1410", accentColor: "#8B7355", lineHeight: 1.15,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 508, width: 860, height: 80, rotation: 0,
        content: "The unfiltered version. No highlight reel. Just the actual process.",
        fontSize: 22, fontFamily: "General Sans", fontWeight: "400",
        textAlign: "left", color: "#6B6057", lineHeight: 1.5,
      },
    ],
  },
  ...t6_bts.map((b, i): Slide => ({
    id: uid(), order: i + 1, slideType: "content", layout: "default",
    backgroundColor: i % 2 === 0 ? "#F0EBE3" : "#E8E0D5",
    backgroundPattern: i === 1 ? "dots" : "none", patternOpacity: 6,
    showSubtitle: false, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 180, width: 920, height: 160, rotation: 0,
        content: b.title, fontSize: 46, fontFamily: "General Sans", fontWeight: "700",
        textAlign: "left", color: "#1A1410", lineHeight: 1.2,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 360, width: 920, height: 200, rotation: 0,
        content: b.body, fontSize: 23, fontFamily: "General Sans", fontWeight: "400",
        textAlign: "left", color: "#6B6057", lineHeight: 1.6,
      },
    ],
  })),
  {
    id: uid(), order: 5, slideType: "outro", layout: "default",
    backgroundColor: "#1A1410", backgroundPattern: "noise", patternOpacity: 10,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 220, width: 920, height: 40, rotation: 0,
        content: "Transparency builds trust.",
        fontSize: 20, fontFamily: "General Sans", fontWeight: "500",
        textAlign: "left", color: "#8B7355", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 270, width: 920, height: 220, rotation: 0,
        content: "Want more behind-the-scenes content like this?",
        fontSize: 54, fontFamily: "General Sans", fontWeight: "700",
        textAlign: "left", color: "#F0EBE3", accentColor: "#8B7355", lineHeight: 1.2,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 520, width: 240, height: 56, rotation: 0,
        content: "Follow Along",
        fontSize: 18, fontFamily: "General Sans", fontWeight: "600",
        textAlign: "center", color: "#1A1410",
        backgroundColor: "#8B7355", borderRadius: 8, padding: 14,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 7 — Case Study
// Professional blue | Poppins + Inter | 8 slides
// ═══════════════════════════════════════════════════════════════════════════════
const t7_palette = ["#F8FAFC", "#0EA5E9", "#475569", "#0F172A"];
const t7_styles = makeGlobalStyles("Poppins", "Inter", t7_palette);

const t7_sections = [
  { tag: "THE CLIENT", title: "Who We Worked With", body: "Company overview, industry, team size, and the context of why they reached out. Understanding the client sets the stage for everything that follows." },
  { tag: "THE PROBLEM", title: "What Wasn't Working", body: "The core challenge they were facing — specific, measurable, and painful. We always start by understanding the problem before proposing any solution." },
  { tag: "OUR APPROACH", title: "How We Thought About It", body: "The strategic framework we brought to the engagement. Why this approach instead of the obvious one? Walk through the reasoning that shaped the entire project." },
  { tag: "THE EXECUTION", title: "What We Actually Did", body: "Step by step — the deliverables, timeline, and key decisions made along the way. Include the pivots and the moments of uncertainty." },
  { tag: "THE RESULTS", title: "[X]% Improvement in [Metric]", body: "Before vs. after numbers. Revenue, conversion, efficiency, satisfaction — whichever metrics mattered most to this client and tell the most compelling story." },
  { tag: "KEY LESSON", title: "What This Taught Us", body: "The insight that came from doing this work — something that will inform how you serve future clients. Authentic reflection is more valuable than a polished summary." },
];

const t7_slides: Slide[] = [
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#F8FAFC", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 180, width: 920, height: 40, rotation: 0,
        content: "Case Study", fontSize: 18, fontFamily: "Inter",
        fontWeight: "500", textAlign: "left", color: "#0EA5E9", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 228, width: 920, height: 240, rotation: 0,
        content: "How [Company] Achieved [Result] in [Timeframe]",
        fontSize: 60, fontFamily: "Poppins", fontWeight: "700",
        textAlign: "left", color: "#0F172A", accentColor: "#0EA5E9", lineHeight: 1.1,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 488, width: 860, height: 80, rotation: 0,
        content: "A detailed breakdown of the strategy, execution, and measurable impact. Real numbers, real lessons.",
        fontSize: 22, fontFamily: "Inter", fontWeight: "400",
        textAlign: "left", color: "#475569", lineHeight: 1.5,
      },
    ],
  },
  ...t7_sections.map((s, i): Slide => ({
    id: uid(), order: i + 1, slideType: "content", layout: "default",
    backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#EFF6FF",
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 160, width: 920, height: 36, rotation: 0,
        content: s.tag, fontSize: 13, fontFamily: "Inter",
        fontWeight: "700", textAlign: "left", color: "#0EA5E9", lineHeight: 1.4,
        letterSpacing: 3, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 208, width: 920, height: 160, rotation: 0,
        content: s.title, fontSize: 46, fontFamily: "Poppins", fontWeight: "700",
        textAlign: "left", color: "#0F172A", lineHeight: 1.2,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 388, width: 920, height: 180, rotation: 0,
        content: s.body, fontSize: 22, fontFamily: "Inter", fontWeight: "400",
        textAlign: "left", color: "#475569", lineHeight: 1.6,
      },
    ],
  })),
  {
    id: uid(), order: 7, slideType: "outro", layout: "default",
    backgroundColor: "#0F172A", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 180, width: 920, height: 40, rotation: 0,
        content: "Want results like these?",
        fontSize: 20, fontFamily: "Inter", fontWeight: "500",
        textAlign: "left", color: "#0EA5E9", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 230, width: 920, height: 220, rotation: 0,
        content: "Let's talk about what this could look like for your business.",
        fontSize: 54, fontFamily: "Poppins", fontWeight: "700",
        textAlign: "left", color: "#F8FAFC", accentColor: "#0EA5E9", lineHeight: 1.2,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 480, width: 240, height: 56, rotation: 0,
        content: "Book a Discovery Call",
        fontSize: 17, fontFamily: "Inter", fontWeight: "600",
        textAlign: "center", color: "#0F172A",
        backgroundColor: "#0EA5E9", borderRadius: 8, padding: 14,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 8 — This or That
// Bold bright two-tone | Oswald + Source Sans 3 | 5 slides
// ═══════════════════════════════════════════════════════════════════════════════
const t8_palette = ["#1C1C2E", "#7C3AED", "#C4B5FD", "#FFFFFF"];
const t8_styles = makeGlobalStyles("Oswald", "Source Sans 3", t8_palette);

const t8_pairs = [
  { a: "Morning Person", b: "Night Owl", q: "When do you do your best work?" },
  { a: "Deep Work", b: "Multitasking", q: "Which is your default mode?" },
  { a: "Plans Everything", b: "Wing It", q: "How do you approach big projects?" },
];

const t8_slides: Slide[] = [
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#1C1C2E",
    backgroundGradient: "linear-gradient(135deg, #1C1C2E 0%, #2D1B69 100%)",
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 200, width: 920, height: 40, rotation: 0,
        content: "THIS OR THAT", fontSize: 16, fontFamily: "Source Sans 3",
        fontWeight: "700", textAlign: "left", color: "#7C3AED", lineHeight: 1.4,
        letterSpacing: 4, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 250, width: 920, height: 240, rotation: 0,
        content: "Which Type of [Topic] Person Are You?",
        fontSize: 72, fontFamily: "Oswald", fontWeight: "700",
        textAlign: "left", color: "#FFFFFF", accentColor: "#7C3AED",
        lineHeight: 1.1, textTransform: "uppercase",
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 510, width: 860, height: 80, rotation: 0,
        content: "Swipe through and tell us your answers in the comments!",
        fontSize: 22, fontFamily: "Source Sans 3", fontWeight: "400",
        textAlign: "left", color: "#C4B5FD", lineHeight: 1.5,
      },
    ],
  },
  ...t8_pairs.map((p, i): Slide => ({
    id: uid(), order: i + 1, slideType: "content", layout: "default",
    backgroundColor: "#1C1C2E",
    backgroundGradient: "linear-gradient(135deg, #1C1C2E 0%, #2D1B69 100%)",
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 140, width: 920, height: 50, rotation: 0,
        content: p.q, fontSize: 22, fontFamily: "Source Sans 3",
        fontWeight: "400", textAlign: "center", color: "#C4B5FD", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 220, width: 430, height: 200, rotation: 0,
        content: p.a, fontSize: 56, fontFamily: "Oswald", fontWeight: "700",
        textAlign: "center", color: "#FFFFFF",
        lineHeight: 1.1, textTransform: "uppercase",
        backgroundColor: "#7C3AED", borderRadius: 16, padding: 20,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 540, y: 310, width: 60, height: 60, rotation: 0,
        content: "OR", fontSize: 28, fontFamily: "Oswald",
        fontWeight: "700", textAlign: "center", color: "#C4B5FD",
        lineHeight: 1, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 570, y: 220, width: 430, height: 200, rotation: 0,
        content: p.b, fontSize: 56, fontFamily: "Oswald", fontWeight: "700",
        textAlign: "center", color: "#7C3AED",
        lineHeight: 1.1, textTransform: "uppercase",
        backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20,
      },
    ],
  })),
  {
    id: uid(), order: 4, slideType: "outro", layout: "default",
    backgroundColor: "#7C3AED", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 220, width: 920, height: 40, rotation: 0,
        content: "Drop your answers below 👇",
        fontSize: 22, fontFamily: "Source Sans 3", fontWeight: "400",
        textAlign: "center", color: "#DDD6FE", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 270, width: 920, height: 200, rotation: 0,
        content: "Which type are you? Comment A or B!",
        fontSize: 62, fontFamily: "Oswald", fontWeight: "700",
        textAlign: "center", color: "#FFFFFF",
        lineHeight: 1.1, textTransform: "uppercase",
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 300, y: 510, width: 480, height: 56, rotation: 0,
        content: "Follow for More Polls Like This",
        fontSize: 18, fontFamily: "Source Sans 3", fontWeight: "700",
        textAlign: "center", color: "#7C3AED",
        backgroundColor: "#FFFFFF", borderRadius: 8, padding: 14,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 9 — Myth vs Fact
// Bold red/emerald contrast | Bebas Neue + Open Sans | 6 slides
// ═══════════════════════════════════════════════════════════════════════════════
const t9_palette = ["#111111", "#10B981", "#D1D5DB", "#F9FAFB"];
const t9_styles = makeGlobalStyles("Bebas Neue", "Open Sans", t9_palette);

const t9_mvf = [
  { myth: "You need to post every day to grow.", fact: "Consistent quality beats constant quantity. 3 great posts a week outperform 7 average ones every time.", tag: "MYTH" },
  { myth: "Viral content is always the goal.", fact: "Deeply resonant content for a small audience builds a real business. Viral reach means nothing without conversion.", tag: "MYTH" },
  { myth: "More followers = more success.", fact: "10,000 engaged followers who trust you are worth more than 100,000 passive ones who scroll past your content.", tag: "MYTH" },
  { myth: "Hashtags are the key to discovery.", fact: "In 2025, the algorithm prioritises content quality and save rate over hashtags. Focus on creating save-worthy content.", tag: "MYTH" },
];

const t9_slides: Slide[] = [
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#111111", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 200, width: 920, height: 40, rotation: 0,
        content: "MYTH VS FACT", fontSize: 16, fontFamily: "Open Sans",
        fontWeight: "700", textAlign: "left", color: "#10B981", lineHeight: 1.4,
        letterSpacing: 4, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 250, width: 920, height: 250, rotation: 0,
        content: "4 [Topic] Myths It's Time to Stop Believing",
        fontSize: 80, fontFamily: "Bebas Neue", fontWeight: "400",
        textAlign: "left", color: "#F9FAFB", accentColor: "#10B981",
        lineHeight: 1.05, letterSpacing: 1,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 520, width: 860, height: 80, rotation: 0,
        content: "These misconceptions are holding people back. Let's set the record straight.",
        fontSize: 22, fontFamily: "Open Sans", fontWeight: "400",
        textAlign: "left", color: "#D1D5DB", lineHeight: 1.5,
      },
    ],
  },
  ...t9_mvf.flatMap((m, i): Slide[] => ([
    // Myth slide
    {
      id: uid(), order: i * 2 + 1, slideType: "content", layout: "default",
      backgroundColor: "#1F0A0A", backgroundPattern: "none", patternOpacity: 0,
      showSubtitle: true, showTitle: true, showDescription: true,
      showImage: false, showCta: false,
      elements: [
        {
          id: uid(), type: "subtitle", visible: true,
          x: 80, y: 140, width: 200, height: 50, rotation: 0,
          content: "\u2717 MYTH", fontSize: 32, fontFamily: "Bebas Neue", fontWeight: "400",
          textAlign: "left", color: "#EF4444", lineHeight: 1,
          letterSpacing: 2, textTransform: "uppercase",
        },
        {
          id: uid(), type: "heading", visible: true,
          x: 80, y: 210, width: 920, height: 240, rotation: 0,
          content: `"${m.myth}"`, fontSize: 54, fontFamily: "Bebas Neue", fontWeight: "400",
          textAlign: "left", color: "#F9FAFB", lineHeight: 1.1,
          letterSpacing: 1,
        },
      ],
    },
    // Fact slide
    {
      id: uid(), order: i * 2 + 2, slideType: "content", layout: "default",
      backgroundColor: "#071F16", backgroundPattern: "none", patternOpacity: 0,
      showSubtitle: true, showTitle: true, showDescription: true,
      showImage: false, showCta: false,
      elements: [
        {
          id: uid(), type: "subtitle", visible: true,
          x: 80, y: 140, width: 200, height: 50, rotation: 0,
          content: "✓ FACT", fontSize: 32, fontFamily: "Bebas Neue", fontWeight: "400",
          textAlign: "left", color: "#10B981", lineHeight: 1,
          letterSpacing: 2, textTransform: "uppercase",
        },
        {
          id: uid(), type: "heading", visible: true,
          x: 80, y: 210, width: 920, height: 240, rotation: 0,
          content: m.fact, fontSize: 48, fontFamily: "Bebas Neue", fontWeight: "400",
          textAlign: "left", color: "#F9FAFB", lineHeight: 1.1,
          letterSpacing: 1,
        },
      ],
    },
  ])).slice(0, 4), // keep 4 content slides (2 myth+fact pairs)
  {
    id: uid(), order: 5, slideType: "outro", layout: "default",
    backgroundColor: "#10B981", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 220, width: 920, height: 40, rotation: 0,
        content: "Which myth were you believing?",
        fontSize: 22, fontFamily: "Open Sans", fontWeight: "400",
        textAlign: "left", color: "#064E3B", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 270, width: 920, height: 200, rotation: 0,
        content: "Share this to help someone break free from bad advice.",
        fontSize: 62, fontFamily: "Bebas Neue", fontWeight: "400",
        textAlign: "left", color: "#111111", lineHeight: 1.1,
        letterSpacing: 1,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 510, width: 260, height: 56, rotation: 0,
        content: "Follow for More Facts",
        fontSize: 18, fontFamily: "Open Sans", fontWeight: "700",
        textAlign: "center", color: "#10B981",
        backgroundColor: "#111111", borderRadius: 4, padding: 16,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 10 — Testimonial Stack
// Warm purple | Playfair Display + Lato | 5 slides
// ═══════════════════════════════════════════════════════════════════════════════
const t10_palette = ["#2D1B69", "#E879F9", "#C4B5FD", "#FFFFFF"];
const t10_styles = makeGlobalStyles("Playfair Display", "Lato", t10_palette);

const t10_testimonials = [
  { quote: "This completely changed how I approach [topic]. I went from overwhelmed to confident in two weeks.", name: "Alex M.", role: "Founder, [Company]" },
  { quote: "I've tried a dozen methods. Nothing stuck until this. The simplicity is the genius.", name: "Sam K.", role: "Product Designer" },
  { quote: "My team productivity doubled after we implemented this framework. I cannot recommend it enough.", name: "Jordan P.", role: "Head of Operations" },
];

const t10_slides: Slide[] = [
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#2D1B69",
    backgroundGradient: "linear-gradient(160deg, #2D1B69 0%, #4C1D95 100%)",
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 200, width: 920, height: 40, rotation: 0,
        content: "What people are saying", fontSize: 20, fontFamily: "Lato",
        fontWeight: "400", textAlign: "left", color: "#E879F9", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 250, width: 920, height: 240, rotation: 0,
        content: "Real Results from Real People",
        fontSize: 66, fontFamily: "Playfair Display", fontWeight: "700",
        textAlign: "left", color: "#FFFFFF", accentColor: "#E879F9", lineHeight: 1.15,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 510, width: 860, height: 80, rotation: 0,
        content: "These aren't carefully selected highlights — they're the messages that arrive every week.",
        fontSize: 22, fontFamily: "Lato", fontWeight: "400",
        textAlign: "left", color: "#C4B5FD", lineHeight: 1.5,
      },
    ],
  },
  ...t10_testimonials.map((t, i): Slide => ({
    id: uid(), order: i + 1, slideType: "content", layout: "default",
    backgroundColor: "#F9F5FF",
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: false, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 160, width: 80, height: 120, rotation: 0,
        content: "\u201C", fontSize: 140, fontFamily: "Playfair Display", fontWeight: "700",
        textAlign: "left", color: "#E879F9", lineHeight: 0.8,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 240, width: 920, height: 280, rotation: 0,
        content: t.quote, fontSize: 30, fontFamily: "Playfair Display",
        fontWeight: "400", textAlign: "left", color: "#2D1B69",
        lineHeight: 1.5,
      },
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 545, width: 920, height: 50, rotation: 0,
        content: `— ${t.name}, ${t.role}`, fontSize: 18, fontFamily: "Lato",
        fontWeight: "700", textAlign: "left", color: "#7C3AED", lineHeight: 1.4,
      },
    ],
  })),
  {
    id: uid(), order: 4, slideType: "outro", layout: "default",
    backgroundColor: "#2D1B69",
    backgroundGradient: "linear-gradient(160deg, #2D1B69 0%, #4C1D95 100%)",
    backgroundPattern: "noise", patternOpacity: 8,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 220, width: 920, height: 40, rotation: 0,
        content: "Join hundreds of people already seeing results.",
        fontSize: 20, fontFamily: "Lato", fontWeight: "400",
        textAlign: "left", color: "#E879F9", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 270, width: 920, height: 220, rotation: 0,
        content: "Ready to get your own result story?",
        fontSize: 58, fontFamily: "Playfair Display", fontWeight: "700",
        textAlign: "left", color: "#FFFFFF", accentColor: "#E879F9", lineHeight: 1.2,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 520, width: 240, height: 56, rotation: 0,
        content: "Get Started Today",
        fontSize: 18, fontFamily: "Lato", fontWeight: "700",
        textAlign: "center", color: "#2D1B69",
        backgroundColor: "#E879F9", borderRadius: 8, padding: 14,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 11 — LinkedIn Authority
// Slate/white professional | Cabinet Grotesk + General Sans | 10 slides
// ═══════════════════════════════════════════════════════════════════════════════
const t11_palette = ["#F1F5F9", "#334155", "#64748B", "#0F172A"];
const t11_styles = makeGlobalStyles("Cabinet Grotesk", "General Sans", t11_palette);

const t11_sections = [
  { num: "01", title: "The conventional wisdom is wrong.", body: "Most [industry] advice was written for a market that no longer exists. Here's what actually works in 2025 and why the old playbook is actively hurting you." },
  { num: "02", title: "The data tells a different story.", body: "After analyzing 200+ cases across the past three years, a clear pattern emerges — the strategies driving real results share three counterintuitive traits." },
  { num: "03", title: "Trait #1: They go narrower, not wider.", body: "The temptation is to serve everyone. The businesses that grew fastest in our data set served a hyper-specific segment and said no to everyone else. Ruthless focus compounds." },
  { num: "04", title: "Trait #2: They invest in depth, not reach.", body: "One piece of deeply researched, genuinely useful content outperformed 20 surface-level posts in every case study. The depth is the differentiator." },
  { num: "05", title: "Trait #3: They lead with systems, not effort.", body: "Effort is not scarce. Reliable systems are. The businesses that scaled created repeatable processes that delivered consistent results independent of heroic individual effort." },
  { num: "06", title: "The mistake almost everyone makes.", body: "Chasing what worked for someone else, six months ago, in a slightly different context. Strategy is context-dependent. Borrow principles, not tactics." },
  { num: "07", title: "What to do differently starting today.", body: "Pick one segment. Go three layers deeper on their real problem. Build one system that serves them consistently. That's the entire playbook compressed into three sentences." },
  { num: "08", title: "The result you can expect.", body: "Not overnight success — compounding credibility. The person who does this for 90 days will have built more genuine authority than someone who's been posting for two years." },
];

const t11_slides: Slide[] = [
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#F1F5F9", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 180, width: 920, height: 40, rotation: 0,
        content: "A LinkedIn thread worth saving", fontSize: 18, fontFamily: "General Sans",
        fontWeight: "500", textAlign: "left", color: "#334155", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 228, width: 920, height: 240, rotation: 0,
        content: "Everything You Think You Know About [Topic] is Outdated",
        fontSize: 60, fontFamily: "Cabinet Grotesk", fontWeight: "800",
        textAlign: "left", color: "#0F172A", accentColor: "#334155", lineHeight: 1.1,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 488, width: 860, height: 80, rotation: 0,
        content: "8 slides. Researched. Opinionated. Based on data — not recycled wisdom.",
        fontSize: 22, fontFamily: "General Sans", fontWeight: "400",
        textAlign: "left", color: "#64748B", lineHeight: 1.5,
      },
    ],
  },
  ...t11_sections.map((s, i): Slide => ({
    id: uid(), order: i + 1, slideType: "content", layout: "default",
    backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 160, width: 100, height: 40, rotation: 0,
        content: s.num, fontSize: 18, fontFamily: "Cabinet Grotesk",
        fontWeight: "800", textAlign: "left", color: "#334155", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 208, width: 920, height: 160, rotation: 0,
        content: s.title, fontSize: 46, fontFamily: "Cabinet Grotesk", fontWeight: "800",
        textAlign: "left", color: "#0F172A", lineHeight: 1.2,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 388, width: 920, height: 200, rotation: 0,
        content: s.body, fontSize: 22, fontFamily: "General Sans", fontWeight: "400",
        textAlign: "left", color: "#475569", lineHeight: 1.65,
      },
    ],
  })),
  {
    id: uid(), order: 9, slideType: "outro", layout: "default",
    backgroundColor: "#0F172A", backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 180, width: 920, height: 40, rotation: 0,
        content: "If this was valuable, repost it.",
        fontSize: 20, fontFamily: "General Sans", fontWeight: "500",
        textAlign: "left", color: "#94A3B8", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 228, width: 920, height: 240, rotation: 0,
        content: "What question would you add? Drop it in the comments.",
        fontSize: 54, fontFamily: "Cabinet Grotesk", fontWeight: "800",
        textAlign: "left", color: "#F1F5F9", accentColor: "#94A3B8", lineHeight: 1.2,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 80, y: 500, width: 260, height: 56, rotation: 0,
        content: "Follow for Weekly Insights",
        fontSize: 17, fontFamily: "General Sans", fontWeight: "600",
        textAlign: "center", color: "#0F172A",
        backgroundColor: "#F1F5F9", borderRadius: 6, padding: 14,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 12 — Instagram Story-Style
// Trendy gradients, bold neon | Clash Display + Satoshi | 8 slides | 1080×1920
// ═══════════════════════════════════════════════════════════════════════════════
const t12_palette = ["#0D0D0D", "#FF3CAC", "#F8F8F8", "#FFFFFF"];
const t12_styles = makeGlobalStyles("Clash Display", "Satoshi", t12_palette);

const t12_content = [
  { tag: "TREND #1", title: "Everyone is doing X wrong", body: "The most common approach to [topic] is optimised for vanity metrics, not results. Here's the counterintuitive method that actually works." },
  { tag: "TREND #2", title: "The 10-minute rule that changes everything", body: "Set a 10-minute timer. Work on nothing else. When it rings, you'll find you almost always keep going. Getting started is the only hard part." },
  { tag: "TREND #3", title: "Stop trying to go viral", body: "Chasing virality is a distraction. Focus on creating content so useful and specific that your ideal audience saves it, shares it, and comes back for more." },
  { tag: "TREND #4", title: "The compound effect is real", body: "One post won't change your life. 300 posts, made consistently over 18 months, absolutely will. The math always works — if you show up." },
  { tag: "TREND #5", title: "Your audience doesn't want perfection", body: "They want truth. Raw, honest, slightly imperfect content from someone who genuinely knows their stuff will always beat polished emptiness." },
  { tag: "TREND #6", title: "Format is your strategy", body: "Carousels, reels, stories — the format you choose signals your intention. Carousels teach. Reels entertain. Stories connect. Pick the format that matches your goal." },
];

const t12_gradients = [
  "linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)",
  "linear-gradient(135deg, #0D0D0D 0%, #1A0033 100%)",
  "linear-gradient(135deg, #FF3CAC 0%, #FF6B6B 100%)",
  "linear-gradient(160deg, #0D0D0D 0%, #0A2540 100%)",
  "linear-gradient(135deg, #784BA0 0%, #2B86C5 100%)",
  "linear-gradient(135deg, #FF6B6B 0%, #FF3CAC 100%)",
];

const t12_slides: Slide[] = [
  {
    id: uid(), order: 0, slideType: "intro", layout: "default",
    backgroundColor: "#0D0D0D",
    backgroundGradient: "linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)",
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 320, width: 920, height: 50, rotation: 0,
        content: "6 THINGS TO KNOW ABOUT [TOPIC]", fontSize: 16, fontFamily: "Satoshi",
        fontWeight: "700", textAlign: "center", color: "rgba(255,255,255,0.85)", lineHeight: 1.4,
        letterSpacing: 3, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 60, y: 390, width: 960, height: 440, rotation: 0,
        content: "What Nobody Is Telling You About [Topic] in 2025",
        fontSize: 84, fontFamily: "Clash Display", fontWeight: "700",
        textAlign: "center", color: "#FFFFFF", lineHeight: 1.05,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 860, width: 920, height: 100, rotation: 0,
        content: "Swipe for the full breakdown →",
        fontSize: 24, fontFamily: "Satoshi", fontWeight: "500",
        textAlign: "center", color: "rgba(255,255,255,0.8)", lineHeight: 1.5,
      },
    ],
  },
  ...t12_content.map((c, i): Slide => ({
    id: uid(), order: i + 1, slideType: "content", layout: "default",
    backgroundColor: "#0D0D0D",
    backgroundGradient: t12_gradients[i],
    backgroundPattern: "none", patternOpacity: 0,
    showSubtitle: true, showTitle: true, showDescription: true,
    showImage: false, showCta: false,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 300, width: 920, height: 50, rotation: 0,
        content: c.tag, fontSize: 18, fontFamily: "Satoshi",
        fontWeight: "700", textAlign: "left", color: "rgba(255,255,255,0.7)", lineHeight: 1.4,
        letterSpacing: 3, textTransform: "uppercase",
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 80, y: 360, width: 920, height: 360, rotation: 0,
        content: c.title, fontSize: 78, fontFamily: "Clash Display", fontWeight: "700",
        textAlign: "left", color: "#FFFFFF", lineHeight: 1.05,
      },
      {
        id: uid(), type: "body", visible: true,
        x: 80, y: 750, width: 920, height: 240, rotation: 0,
        content: c.body, fontSize: 28, fontFamily: "Satoshi", fontWeight: "400",
        textAlign: "left", color: "rgba(255,255,255,0.85)", lineHeight: 1.5,
      },
    ],
  })),
  {
    id: uid(), order: 7, slideType: "outro", layout: "default",
    backgroundColor: "#0D0D0D",
    backgroundGradient: "linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)",
    backgroundPattern: "noise", patternOpacity: 6,
    showSubtitle: true, showTitle: true, showDescription: false,
    showImage: false, showCta: true,
    elements: [
      {
        id: uid(), type: "subtitle", visible: true,
        x: 80, y: 400, width: 920, height: 50, rotation: 0,
        content: "Follow for more like this",
        fontSize: 22, fontFamily: "Satoshi", fontWeight: "500",
        textAlign: "center", color: "rgba(255,255,255,0.75)", lineHeight: 1.4,
      },
      {
        id: uid(), type: "heading", visible: true,
        x: 60, y: 460, width: 960, height: 360, rotation: 0,
        content: "Save this. You'll want to come back to it.",
        fontSize: 80, fontFamily: "Clash Display", fontWeight: "700",
        textAlign: "center", color: "#FFFFFF", lineHeight: 1.05,
      },
      {
        id: uid(), type: "cta", visible: true,
        x: 220, y: 880, width: 640, height: 72, rotation: 0,
        content: "Follow @yourbrand",
        fontSize: 22, fontFamily: "Satoshi", fontWeight: "700",
        textAlign: "center", color: "#FF3CAC",
        backgroundColor: "#FFFFFF", borderRadius: 100, padding: 18,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export const BUILT_IN_TEMPLATES: BuiltInTemplate[] = [
  {
    name: "Step-by-Step Tutorial",
    description: "Numbered steps with bold headings and a progress-forward feel",
    templateCategory: "educational",
    backgroundGradient: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #C8FF00 200%)",
    project: {
      name: "Step-by-Step Tutorial",
      platform: "instagram",
      width: 1080,
      height: 1350,
      slideCount: 8,
      slides: t1_slides,
      globalStyles: t1_styles,
    },
  },
  {
    name: "Framework Breakdown",
    description: "Intro hook, 5-stage framework with detail slides and a summary",
    templateCategory: "educational",
    backgroundGradient: "linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 50%, #BFDBFE 100%)",
    project: {
      name: "Framework Breakdown",
      platform: "linkedin",
      width: 1080,
      height: 1080,
      slideCount: 10,
      slides: t2_slides,
      globalStyles: t2_styles,
    },
  },
  {
    name: "Data Storytelling",
    description: "One powerful stat per slide in an infographic-inspired layout",
    templateCategory: "educational",
    backgroundGradient: "linear-gradient(135deg, #0A1628 0%, #0F2340 60%, #F59E0B 200%)",
    project: {
      name: "Data Storytelling",
      platform: "linkedin",
      width: 1080,
      height: 1080,
      slideCount: 7,
      slides: t3_slides,
      globalStyles: t3_styles,
    },
  },
  {
    name: "Things I Wish I Knew",
    description: "Personal lessons told with warmth and honest editorial voice",
    templateCategory: "educational",
    backgroundGradient: "linear-gradient(135deg, #FAF5EE 0%, #F5EDE0 50%, #C2714F 150%)",
    project: {
      name: "Things I Wish I Knew",
      platform: "instagram",
      width: 1080,
      height: 1350,
      slideCount: 6,
      slides: t4_slides,
      globalStyles: t4_styles,
    },
  },
  {
    name: "Before & After",
    description: "High-contrast transformation narrative with a clear turning point",
    templateCategory: "story",
    backgroundGradient: "linear-gradient(135deg, #18181B 0%, #27272A 50%, #FF6B35 150%)",
    project: {
      name: "Before & After",
      platform: "instagram",
      width: 1080,
      height: 1350,
      slideCount: 5,
      slides: t5_slides,
      globalStyles: t5_styles,
    },
  },
  {
    name: "Behind the Scenes",
    description: "Raw, unfiltered look at a project with muted tonal design",
    templateCategory: "story",
    backgroundGradient: "linear-gradient(135deg, #F0EBE3 0%, #E8E0D5 50%, #8B7355 150%)",
    project: {
      name: "Behind the Scenes",
      platform: "instagram",
      width: 1080,
      height: 1080,
      slideCount: 6,
      slides: t6_slides,
      globalStyles: t6_styles,
    },
  },
  {
    name: "Case Study",
    description: "Problem → approach → execution → results with a professional blue palette",
    templateCategory: "story",
    backgroundGradient: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #0EA5E9 200%)",
    project: {
      name: "Case Study",
      platform: "linkedin",
      width: 1080,
      height: 1080,
      slideCount: 8,
      slides: t7_slides,
      globalStyles: t7_styles,
    },
  },
  {
    name: "This or That",
    description: "Two-option engagement format with bold split-panel slide design",
    templateCategory: "interactive",
    backgroundGradient: "linear-gradient(135deg, #1C1C2E 0%, #2D1B69 50%, #7C3AED 150%)",
    project: {
      name: "This or That",
      platform: "instagram",
      width: 1080,
      height: 1350,
      slideCount: 5,
      slides: t8_slides,
      globalStyles: t8_styles,
    },
  },
  {
    name: "Myth vs Fact",
    description: "Debunking misconceptions with red myth and green fact contrast slides",
    templateCategory: "interactive",
    backgroundGradient: "linear-gradient(135deg, #111111 0%, #1F0A0A 40%, #071F16 100%)",
    project: {
      name: "Myth vs Fact",
      platform: "instagram",
      width: 1080,
      height: 1350,
      slideCount: 6,
      slides: t9_slides,
      globalStyles: t9_styles,
    },
  },
  {
    name: "Testimonial Stack",
    description: "Quote card social proof with warm purple tones and editorial typography",
    templateCategory: "interactive",
    backgroundGradient: "linear-gradient(135deg, #2D1B69 0%, #4C1D95 60%, #E879F9 200%)",
    project: {
      name: "Testimonial Stack",
      platform: "instagram",
      width: 1080,
      height: 1080,
      slideCount: 5,
      slides: t10_slides,
      globalStyles: t10_styles,
    },
  },
  {
    name: "LinkedIn Authority",
    description: "Text-forward, research-backed professional carousel for thought leadership",
    templateCategory: "platform",
    backgroundGradient: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 50%, #334155 200%)",
    project: {
      name: "LinkedIn Authority",
      platform: "linkedin",
      width: 1080,
      height: 1080,
      slideCount: 10,
      slides: t11_slides,
      globalStyles: t11_styles,
    },
  },
  {
    name: "Instagram Story-Style",
    description: "Trendy full-bleed gradients with oversized type optimised for Stories format",
    templateCategory: "platform",
    backgroundGradient: "linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)",
    project: {
      name: "Instagram Story-Style",
      platform: "instagram",
      width: 1080,
      height: 1920,
      slideCount: 8,
      slides: t12_slides,
      globalStyles: t12_styles,
    },
  },
];
