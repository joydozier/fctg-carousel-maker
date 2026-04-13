import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Search, ChevronRight, HelpCircle, Palette, Type, Layout, Download, Image, Layers, Film, BookTemplate, Sparkles, MousePointer, Columns } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HelpModalProps {
  onClose: () => void;
}

interface HelpTopic {
  id: string;
  icon: React.ReactNode;
  title: string;
  category: "getting-started" | "editor" | "design" | "export" | "templates";
  items: { q: string; a: string }[];
}

const HELP_TOPICS: HelpTopic[] = [
  {
    id: "getting-started",
    icon: <Sparkles className="w-4 h-4" />,
    title: "Getting Started",
    category: "getting-started",
    items: [
      {
        q: "How do I create a new carousel?",
        a: "From the Dashboard, click \"+ New Carousel\" or \"Blank Carousel\" to start fresh. You can also pick a template from the Built-In library to start with a pre-designed layout.",
      },
      {
        q: "How do I use a template?",
        a: "On the Dashboard, scroll to the Templates section. Click any template card to create a copy and open it in the editor. Your changes won't affect the original template.",
      },
      {
        q: "How do I save my project?",
        a: "Click the \"Save\" button in the top-right of the editor. Your project is saved to the cloud (Supabase) and will appear on your Dashboard under Recent Projects.",
      },
      {
        q: "How do I save to my computer?",
        a: "Click \"File\" → \"Save to Computer\" to download a .json file. You can reload it later with \"File\" → \"Open from Computer\".",
      },
    ],
  },
  {
    id: "slides",
    icon: <Layers className="w-4 h-4" />,
    title: "Slides",
    category: "editor",
    items: [
      {
        q: "How do I add a new slide?",
        a: "Click the \"+\" icon on any slide in the filmstrip at the bottom of the editor. The new slide will be inserted after that slide and will automatically inherit the design (colors, fonts, layout) of the template you're using.",
      },
      {
        q: "How do I delete a slide?",
        a: "Hover over a slide in the filmstrip and click the trash icon. You must keep at least one slide.",
      },
      {
        q: "How do I duplicate a slide?",
        a: "Hover over a slide in the filmstrip and click the copy icon. This creates an exact duplicate with all content and styling.",
      },
      {
        q: "How do I reorder slides?",
        a: "Use the left/right arrow icons on the slide's toolbar in the filmstrip to move it.",
      },
      {
        q: "How do I change the slide count?",
        a: "Use the slide count dropdown in the top header bar (shows \"X slides\"). Note: changing this regenerates all slides from scratch with the current palette.",
      },
      {
        q: "What are slide types?",
        a: "Each slide has a type: Intro (first), Content (middle), and Outro (last). Templates design each type differently — intros have big headlines, content slides show information, and outros have calls-to-action.",
      },
    ],
  },
  {
    id: "editing",
    icon: <MousePointer className="w-4 h-4" />,
    title: "Editing Content",
    category: "editor",
    items: [
      {
        q: "How do I edit text on a slide?",
        a: "Click directly on any text element on the slide canvas. A text cursor will appear and you can type your content. Click outside to deselect.",
      },
      {
        q: "How do I use the Configure dialog?",
        a: "Click \"Configure\" in the slide toolbar at the top. This opens a modal where you can toggle which elements appear (subtitle, title, description, image, CTA) and switch between layout types.",
      },
      {
        q: "What layouts are available?",
        a: "Default, Quote Card, Infographics, Testimonial, Bento Grid, and Video. Each layout arranges elements differently. Switch layouts in the Configure dialog.",
      },
      {
        q: "How do I add an image?",
        a: "Enable \"Show Image\" in the Configure dialog, then click the image placeholder on the canvas. Or click \"Background Image\" to set a full-slide background.",
      },
    ],
  },
  {
    id: "colors",
    icon: <Palette className="w-4 h-4" />,
    title: "Colors & Palettes",
    category: "design",
    items: [
      {
        q: "How do I change colors?",
        a: "Click \"Colors\" in the left sidebar. You'll see your current 4-color palette (Background, Accent, Body Text, Heading Text). Click any color swatch to change it with a color picker.",
      },
      {
        q: "What are the FCTG brand palettes?",
        a: "Scroll down in the Colors panel to see 10 pre-loaded FCTG brand palettes (Primary, Dark, Cream, Gold + Obsidian, CTA Orange, Emerald, Slate, Gold Family, Neutral Family, Accent Colors). Click any to apply it to all slides.",
      },
      {
        q: "How do I use custom colors?",
        a: "Toggle the \"Custom\" switch at the top of the Colors panel. You can then set any hex color. Use \"Save as Color Preset\" to save your custom palette for reuse.",
      },
      {
        q: "How do I apply a palette to all slides?",
        a: "Click any palette in the Presets section. It immediately applies to all slides — updating backgrounds, text colors, and accent colors.",
      },
    ],
  },
  {
    id: "typography",
    icon: <Type className="w-4 h-4" />,
    title: "Fonts & Typography",
    category: "design",
    items: [
      {
        q: "How do I change fonts?",
        a: "Click \"Text\" in the left sidebar. Choose from font pairings like Clash/Satoshi, Playfair/Lato, Poppins/Inter, and more. The heading font and body font are set separately.",
      },
      {
        q: "Can I adjust font sizes?",
        a: "Yes — toggle \"Custom Font Sizes\" in the Text panel to get sliders for heading and body font sizes.",
      },
    ],
  },
  {
    id: "backgrounds",
    icon: <Image className="w-4 h-4" />,
    title: "Backgrounds",
    category: "design",
    items: [
      {
        q: "How do I add a background image?",
        a: "Click \"Background Image\" in the slide toolbar. You can upload your own image or choose from 20 built-in FCTG brand backgrounds.",
      },
      {
        q: "What patterns are available?",
        a: "In the Configure dialog, you can add subtle patterns over your background: dots, lines, diagonal, grid, waves, crosses, zigzag, or noise. Adjust the opacity with the slider.",
      },
    ],
  },
  {
    id: "canvas",
    icon: <Columns className="w-4 h-4" />,
    title: "Canvas Size & Platforms",
    category: "editor",
    items: [
      {
        q: "How do I change the canvas size?",
        a: "Click the size display (e.g., \"1080 × 1350\") or the platform label (e.g., \"Portrait (4:5)\") in the top header. A modal shows all available sizes with platform recommendations.",
      },
      {
        q: "What sizes are available?",
        a: "Square (1:1) for Instagram/LinkedIn, Landscape (4:3) for X/Twitter, Presentation (16:9) for decks, Portrait (4:5 or 3:4) for Instagram carousels, Story (9:16) for Reels/TikTok, Pinterest Pin (2:3), and Ultra Wide for TikTok carousels.",
      },
      {
        q: "What does \"Best for\" mean?",
        a: "Each canvas size shows which social platforms it works best on. For example, Portrait 4:5 is labeled \"Best for: Instagram Carousel, LinkedIn\" because those platforms display that ratio best.",
      },
    ],
  },
  {
    id: "branding",
    icon: <Layout className="w-4 h-4" />,
    title: "Branding",
    category: "design",
    items: [
      {
        q: "How do I add my brand logo/name?",
        a: "Click \"Brand\" in the left sidebar. Toggle \"Branding\" on to show your brand name and handle on slides. You can set the brand name, handle, color, size, and position.",
      },
      {
        q: "Can I show branding only on intro/outro?",
        a: "Yes — enable \"Only Intro & Outro\" in the Brand panel. This hides branding on content slides for a cleaner look.",
      },
      {
        q: "How do I add slide numbers?",
        a: "Toggle \"Slide Numbers\" in the Brand panel. Choose a style: plain, padded (01, 02), hash (#1, #2), or dot.",
      },
      {
        q: "What is the swipe indicator?",
        a: "The \"Swipe\" toggle adds a subtle \"Next ▶\" prompt at the bottom of each slide to encourage viewers to swipe. You can customize the text.",
      },
    ],
  },
  {
    id: "video",
    icon: <Film className="w-4 h-4" />,
    title: "Video Slides",
    category: "editor",
    items: [
      {
        q: "How do I add a video to a slide?",
        a: "In the Configure dialog, switch the layout to \"Video\". Then choose a split layout (video top, bottom, left, right, or center). Upload your video file.",
      },
      {
        q: "What video layouts are available?",
        a: "Video Top, Video Bottom, Video Left, Video Right, and Video Center. The app will show a warning if your chosen layout doesn't work well with the current canvas size.",
      },
    ],
  },
  {
    id: "templates-help",
    icon: <BookTemplate className="w-4 h-4" />,
    title: "Templates",
    category: "templates",
    items: [
      {
        q: "How do I save my project as a template?",
        a: "Click \"File\" → \"Save as Template\". This creates a reusable template that appears under \"My Templates\" on the Dashboard.",
      },
      {
        q: "What are built-in templates?",
        a: "12 professionally designed templates covering Educational (tutorials, frameworks, data stories), Story (before & after, personal lessons), Interactive (quizzes, polls), and Platform-specific formats.",
      },
      {
        q: "Can I modify a built-in template?",
        a: "When you use a built-in template, a copy is created as a new project. You can freely change anything — colors, fonts, text, layouts. The original template stays unchanged.",
      },
    ],
  },
  {
    id: "export",
    icon: <Download className="w-4 h-4" />,
    title: "Exporting",
    category: "export",
    items: [
      {
        q: "How do I export my carousel?",
        a: "Click the \"Export\" button in the top-right. Choose from: ZIP (each slide as PNG + video slides as WebM), All as PNG (downloads each slide separately), or Video (WebM with transitions).",
      },
      {
        q: "What format should I use for Instagram?",
        a: "Use \"Export as ZIP\" — it gives you individual PNG files for each slide, which you can upload directly to Instagram as a carousel post.",
      },
      {
        q: "Can I export as video?",
        a: "Yes — \"Export as Video (WebM)\" creates a video with 3-second holds per slide and smooth crossfade transitions. Great for Reels, TikTok, or Stories.",
      },
      {
        q: "How do I save the project file?",
        a: "Click \"File\" → \"Save to Computer\" to download a .json project file. This preserves everything and can be reloaded later with \"Open from Computer\".",
      },
    ],
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  "getting-started": "Getting Started",
  "editor": "Editor",
  "design": "Design",
  "export": "Export",
  "templates": "Templates",
};

export function HelpModal({ onClose }: HelpModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTopic, setExpandedTopic] = useState<string | null>("getting-started");

  // Filter topics and items by search
  const filteredTopics = searchQuery
    ? HELP_TOPICS.map((topic) => ({
        ...topic,
        items: topic.items.filter(
          (item) =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((t) => t.items.length > 0)
    : HELP_TOPICS;

  // Group by category
  const groupedByCategory = filteredTopics.reduce(
    (acc, topic) => {
      if (!acc[topic.category]) acc[topic.category] = [];
      acc[topic.category].push(topic);
      return acc;
    },
    {} as Record<string, typeof filteredTopics>
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[80vh] bg-[#2D2E30] rounded-xl border border-[#3A3B3D] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        data-testid="help-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A3B3D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4A537]/20 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-[#D4A537]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#E2DDD5]">Help Center</h2>
              <p className="text-xs text-[#8A8580]">Learn how to use the Carousel Maker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A8580] hover:text-[#E2DDD5] hover:bg-[#3A3B3D] transition-colors"
            data-testid="help-close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-[#3A3B3D]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8580]" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setExpandedTopic(null);
              }}
              placeholder="Search for help..."
              className="pl-10 h-9 text-sm bg-[#3A3B3D] border-[#4A4B4D] text-[#E2DDD5] placeholder:text-[#666] focus:border-[#D4A537]/60 focus:ring-[#D4A537]/20"
              data-testid="help-search"
              autoFocus
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {Object.entries(groupedByCategory).length === 0 && (
            <div className="text-center py-12 text-[#8A8580]">
              <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No results found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}

          {Object.entries(groupedByCategory).map(([category, topics]) => (
            <div key={category}>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#D4A537]/70 mb-3">
                {CATEGORY_LABELS[category] || category}
              </h3>
              <div className="space-y-2">
                {topics.map((topic) => {
                  const isExpanded = expandedTopic === topic.id || !!searchQuery;
                  return (
                    <div key={topic.id} className="rounded-lg border border-[#3A3B3D] overflow-hidden">
                      {/* Topic header */}
                      <button
                        onClick={() => setExpandedTopic(isExpanded && !searchQuery ? null : topic.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#3A3B3D]/50 transition-colors"
                        data-testid={`help-topic-${topic.id}`}
                      >
                        <div className="w-7 h-7 rounded-md bg-[#D4A537]/10 flex items-center justify-center text-[#D4A537] flex-shrink-0">
                          {topic.icon}
                        </div>
                        <span className="text-sm font-semibold text-[#E2DDD5] flex-1">{topic.title}</span>
                        <span className="text-[10px] text-[#8A8580] mr-1">{topic.items.length}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 text-[#8A8580] transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                      </button>

                      {/* FAQ items */}
                      {isExpanded && (
                        <div className="border-t border-[#3A3B3D] bg-[#262729]">
                          {topic.items.map((item, idx) => (
                            <div
                              key={idx}
                              className={`px-4 py-3 ${idx > 0 ? "border-t border-[#333]" : ""}`}
                            >
                              <p className="text-sm font-medium text-[#E2DDD5] mb-1.5">{item.q}</p>
                              <p className="text-xs text-[#8A8580] leading-relaxed">{item.a}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#3A3B3D] flex items-center justify-between">
          <p className="text-[10px] text-[#8A8580]">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-[#3A3B3D] text-[#D4A537] text-[9px] font-mono">?</kbd> anywhere to open help
          </p>
          <button
            onClick={onClose}
            className="text-xs font-medium text-[#D4A537] hover:text-[#D4A537]/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
