import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus, Copy, Trash2, ArrowLeft, ArrowRight, Settings, ImageIcon, X, Eye, PlusCircle, ChevronRightIcon, Sparkles, Download, Paintbrush, Palette, Type, Layers, Link2, Columns2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SlideRenderer } from "@/components/slide-renderer";
import { MediaModal } from "@/components/media-modal";
import { ComparisonPanel } from "@/components/panels/comparison-panel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Slide, SlideLayout, VideoSplitLayout } from "@/lib/types";
import { getVideoLayoutWarning, applyComparisonLayout } from "@/lib/types";
import { AlertTriangle, Film, ArrowUpFromLine, ArrowDownFromLine, ArrowLeftFromLine, ArrowRightFromLine, Maximize } from "lucide-react";
import { Slider } from "@/components/ui/slider";


interface SlideCanvasProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
  activeTopPanel: string | null;
  activeLeftPanel?: string;
  setActiveLeftPanel?: (panel: string) => void;
}

/* ─────────── Floating Canvas Sidebar (PostNitro style) ─────────── */
const CANVAS_SIDEBAR_ITEMS = [
  { id: "ai", label: "AI", icon: Sparkles, accent: true },
  { id: "import", label: "Import", icon: Download },
  { id: "brand", label: "Brand", icon: Paintbrush },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "text", label: "Text", icon: Type },
];

/* ─────────────────── Layout Tab Definitions ─────────────────── */
/* Comparison sits FIRST and gets a Featured star + gold ring (Tier 3 of
   the visibility upgrade) so newcomers always see it before the older
   layouts. The `featured` flag drives the special render below. */
const LAYOUT_TABS: { value: SlideLayout; label: string; featured?: boolean }[] = [
  { value: "comparison", label: "Comparison", featured: true },
  { value: "default", label: "Default" },
  { value: "quote-card", label: "Quote Card" },
  { value: "infographics", label: "Infographics" },
  { value: "testimonial", label: "Testimonial" },
  { value: "bento-grid", label: "Bento Grid" },
  { value: "video", label: "Video" },
];

/* ── Video split layout definitions ── */
const VIDEO_SPLIT_LAYOUTS: { value: VideoSplitLayout; label: string; icon: typeof ArrowUpFromLine; desc: string }[] = [
  { value: "video-top", label: "Video Top", icon: ArrowUpFromLine, desc: "Video on top, text below" },
  { value: "video-bottom", label: "Video Bottom", icon: ArrowDownFromLine, desc: "Text on top, video below" },
  { value: "video-left", label: "Video Left", icon: ArrowLeftFromLine, desc: "Video left, text right" },
  { value: "video-right", label: "Video Right", icon: ArrowRightFromLine, desc: "Text left, video right" },
  { value: "video-center", label: "Video Center", icon: Maximize, desc: "Video centered, text top & bottom" },
];

/* Testimonial layout thumbnails (4 variants) */
const TESTIMONIAL_LAYOUTS = [
  { id: 0, desc: "Stars top, quote bottom" },
  { id: 1, desc: "Stars right, text left" },
  { id: 2, desc: "Centered minimal" },
  { id: 3, desc: "Side avatar, angled" },
];

/* ─────────────────── Video Layout Section ─────────────────── */
function VideoLayoutSection({
  slide,
  canvasWidth,
  canvasHeight,
  updateSlide,
}: {
  slide: Slide;
  canvasWidth: number;
  canvasHeight: number;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
}) {
  const [videoUrl, setVideoUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const currentLayout = slide.videoSplitLayout || "video-top";
  const currentRatio = slide.videoSplitRatio ?? 0.6;
  const warning = getVideoLayoutWarning(canvasWidth, canvasHeight, currentLayout);

  const applyVideoSrc = (src: string) => {
    const videoEl = slide.elements.find(el => el.type === "video");
    if (videoEl) {
      const updatedElements = slide.elements.map(el =>
        el.type === "video" ? { ...el, videoSrc: src, visible: true } : el
      );
      updateSlide(slide.id, { elements: updatedElements, showVideo: true } as any);
    } else {
      const newVideoEl = {
        id: crypto.randomUUID(),
        type: "video" as const,
        x: 80, y: 80,
        width: canvasWidth - 160,
        height: Math.round((canvasHeight - 160) * (slide.videoSplitRatio ?? 0.6)),
        rotation: 0,
        visible: true,
        videoSrc: src,
        videoMuted: true,
        videoLoop: true,
        placeholder: "Video",
        borderRadius: 12,
      };
      updateSlide(slide.id, {
        elements: [...slide.elements, newVideoEl],
        showVideo: true,
      } as any);
    }
  };

  const handleVideoUrl = () => {
    setUrlError("");
    const trimmed = videoUrl.trim();
    if (!trimmed) return;
    try {
      const parsed = new URL(trimmed);
      if (!parsed.protocol.startsWith("http")) {
        setUrlError("URL must start with http:// or https://");
        return;
      }
      // Check for common video URL patterns
      const isVideoUrl = /\.(mp4|mov|webm|ogv)$/i.test(parsed.pathname) ||
        /youtube\.com|youtu\.be|vimeo\.com|streamable\.com/i.test(parsed.hostname);
      if (!isVideoUrl) {
        setUrlError("URL should be a direct video link (.mp4, .mov, .webm) or from YouTube/Vimeo");
        return;
      }
      applyVideoSrc(trimmed);
      setVideoUrl("");
    } catch {
      setUrlError("Please enter a valid URL");
    }
  };

  return (
    <div className="space-y-4 pt-2" data-testid="video-layout-section">
      {/* Split Layout Picker */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#8A8580]">Video Placement</label>
        <div className="grid grid-cols-5 gap-1.5">
          {VIDEO_SPLIT_LAYOUTS.map((vl) => {
            const Icon = vl.icon;
            const isSelected = currentLayout === vl.value;
            return (
              <button
                key={vl.value}
                onClick={() => updateSlide(slide.id, { videoSplitLayout: vl.value } as any)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all",
                  isSelected
                    ? "border-[#D4A537] bg-[#D4A537]/10"
                    : "border-[#4A4B4D] hover:border-[#B8944F]/50"
                )}
                title={vl.desc}
                data-testid={`video-layout-${vl.value}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-medium leading-tight text-center">{vl.label.replace("Video ", "")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Split Ratio Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[#8A8580]">Video Size</label>
          <span className="text-[10px] font-mono text-[#8A8580]">{Math.round(currentRatio * 100)}%</span>
        </div>
        <Slider
          value={[currentRatio * 100]}
          min={30}
          max={80}
          step={5}
          onValueChange={([v]) => updateSlide(slide.id, { videoSplitRatio: v / 100 } as any)}
          data-testid="video-split-ratio-slider"
        />
        <div className="flex justify-between text-[9px] text-[#8A8580]">
          <span>30% — More text</span>
          <span>80% — More video</span>
        </div>
      </div>

      {/* Video Upload Zone */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#8A8580]">Upload Video</label>
        <label
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-[#5A5B5D] hover:border-[#B8944F]/50 cursor-pointer transition-colors"
          data-testid="video-upload-zone"
        >
          <Film className="w-6 h-6 text-[#8A8580]" />
          <span className="text-xs text-[#8A8580]">Click to upload MP4, MOV, or WebM</span>
          <span className="text-[10px] text-[#8A8580]">Max 60 seconds for Instagram</span>
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const blobUrl = URL.createObjectURL(file);
                applyVideoSrc(blobUrl);
              }
            }}
          />
        </label>
      </div>

      {/* OR Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#5A5B5D]/40" />
        <span className="text-[10px] font-medium text-[#8A8580] uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-[#5A5B5D]/40" />
      </div>

      {/* Video URL Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#8A8580]">Video URL</label>
        <div className="flex gap-2">
          <Input
            value={videoUrl}
            onChange={(e) => { setVideoUrl(e.target.value); setUrlError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleVideoUrl(); }}
            placeholder="https://example.com/video.mp4"
            className="h-8 text-xs bg-[#2D2D2D] border-[#5A5B5D] text-[#FDFBF7] placeholder:text-[#8A8580] focus:border-[#B8944F]"
            data-testid="video-url-input"
          />
          <Button
            size="sm"
            onClick={handleVideoUrl}
            className="h-8 px-3 text-xs bg-[#B8944F] hover:bg-[#D4A537] text-[#08080A]"
            data-testid="video-url-apply"
          >
            <Link2 className="w-3.5 h-3.5" />
          </Button>
        </div>
        <span className="text-[10px] text-[#8A8580]">Paste a direct video link (.mp4, .mov, .webm) or YouTube/Vimeo URL</span>
        {urlError && (
          <span className="text-[10px] text-red-400" data-testid="video-url-error">{urlError}</span>
        )}
      </div>

      {/* Compatibility Warning */}
      {warning && (
        <div
          className="flex items-start gap-2 p-3 rounded-lg bg-[#D4A537]/10 border border-[#D4A537]/30"
          data-testid="video-layout-warning"
        >
          <AlertTriangle className="w-4 h-4 text-[#D4A537] shrink-0 mt-0.5" />
          <span className="text-xs text-[#D4A537] leading-relaxed">{warning}</span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────── Configure Modal ─────────────────── */
function ConfigureModal({
  slide,
  store,
  project,
  slideIndex,
  onClose,
}: {
  slide: Slide;
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
  project: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>["project"];
  slideIndex: number;
  onClose: () => void;
}) {
  const { updateSlide } = store;
  const layout = slide.layout || "default";

  const setLayout = (l: SlideLayout) => {
    if (l === "comparison") {
      // Hydrate comparison fields the first time the layout is selected
      if (!slide.comparisonGlobal) {
        const hydrated = applyComparisonLayout(slide, "pro-con");
        updateSlide(slide.id, hydrated);
        return;
      }
    }
    updateSlide(slide.id, { layout: l });
  };

  const toggleContentElement = (key: string, value: boolean) => {
    const typeMap: Record<string, string> = {
      showSubtitle: "subtitle",
      showTitle: "heading",
      showDescription: "body",
      showImage: "image",
      showCta: "cta",
    };
    const elType = typeMap[key];
    if (elType) {
      const updatedElements = slide.elements.map((el) =>
        el.type === elType ? { ...el, visible: value } : el
      );
      updateSlide(slide.id, { [key]: value, elements: updatedElements } as any);
    } else {
      updateSlide(slide.id, { [key]: value } as any);
    }
  };

  /* ── Content Elements list depends on layout ── */
  const getContentElements = () => {
    switch (layout) {
      case "quote-card":
        return [
          { key: "showTitle", label: "Title" },
          { key: "showDescription", label: "Description" },
        ];
      case "infographics":
        return [
          { key: "showTitle", label: "Title" },
          { key: "showDescription", label: "Description" },
        ];
      case "bento-grid":
        return [
          { key: "showTitle", label: "Title" },
          { key: "showDescription", label: "Description" },
        ];
      case "testimonial":
        return [
          { key: "showTitle", label: "Title" },
          { key: "showDescription", label: "Description" },
        ];
      case "video":
        return [
          { key: "showTitle", label: "Title" },
          { key: "showDescription", label: "Description" },
          { key: "showVideo", label: "Video" },
          { key: "showCta", label: "CTA" },
        ];
      case "comparison":
        return []; // comparison has its own dedicated control panel
      default:
        return [
          { key: "showSubtitle", label: "Subtitle" },
          { key: "showTitle", label: "Title" },
          { key: "showDescription", label: "Description" },
          { key: "showImage", label: "Image" },
          { key: "showCta", label: "CTA" },
        ];
    }
  };

  /* ── Live preview scale ── */
  const previewScale = Math.min(300 / project.width, 400 / project.height);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
      data-testid="configure-modal-overlay"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div
        className="relative bg-[#343536] rounded-2xl shadow-2xl w-[880px] max-w-[92vw] max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        data-testid="configure-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#4A4B4D]">
          <h2 className="text-lg font-semibold text-[#E2DDD5]">Configure</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#464849] transition-colors"
            data-testid="configure-modal-close"
          >
            <X className="w-5 h-5 text-[#8A8580]" />
          </button>
        </div>

        {/* Body: Left controls + Right preview */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left — Controls */}
          <div className="w-[460px] flex-shrink-0 overflow-y-auto p-5 space-y-5 border-r border-[#2a2b2d]">
            {/* Layout section */}
            <div className="bg-[#2D2E30] rounded-xl p-3 space-y-3">
              <h3 className="text-sm font-semibold text-[#E2DDD5]">Layout</h3>
              <div className="flex gap-0.5 overflow-x-auto">
                {LAYOUT_TABS.map((tab) => {
                  const isActive = layout === tab.value;
                  // Featured tab (Comparison) gets a gold ring + star icon
                  // even when inactive so users always notice it.
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setLayout(tab.value)}
                      className={cn(
                        "relative px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap inline-flex items-center gap-1",
                        isActive
                          ? "bg-[#D4A537] text-[#08080A] shadow-sm"
                          : tab.featured
                            ? "text-[#D4A537] ring-1 ring-[#D4A537]/60 hover:bg-[#D4A537]/10"
                            : "text-[#8A8580] hover:bg-[#464849]"
                      )}
                      data-testid={`layout-tab-${tab.value}`}
                      title={tab.featured ? "Featured layout \u2014 side-by-side comparisons" : tab.label}
                    >
                      {tab.featured && (
                        <Star
                          className={cn(
                            "w-3 h-3",
                            isActive ? "fill-[#08080A] text-[#08080A]" : "fill-[#D4A537] text-[#D4A537]"
                          )}
                        />
                      )}
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* ── Layout-specific options ── */}
              {layout === "infographics" && (
                <div className="space-y-3 pt-2">
                  {/* Infographics Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#8A8580]">Infographics Type</label>
                    <div className="flex rounded-lg overflow-hidden border border-[#4A4B4D]">
                      <button
                        onClick={() => updateSlide(slide.id, { infographicsType: "grid" })}
                        className={cn(
                          "flex-1 py-1.5 text-xs font-medium transition-colors",
                          (slide.infographicsType || "grid") === "grid"
                            ? "bg-[#D4A537] text-[#08080A]"
                            : "text-[#8A8580] hover:bg-[#464849]"
                        )}
                        data-testid="infographics-type-grid"
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => updateSlide(slide.id, { infographicsType: "cyclic" })}
                        className={cn(
                          "flex-1 py-1.5 text-xs font-medium transition-colors border-l border-[#4A4B4D]",
                          slide.infographicsType === "cyclic"
                            ? "bg-[#D4A537] text-[#08080A]"
                            : "text-[#8A8580] hover:bg-[#464849]"
                        )}
                        data-testid="infographics-type-cyclic"
                      >
                        Cyclic
                      </button>
                    </div>
                  </div>
                  {/* Columns Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#E2DDD5]">Columns Header</span>
                    <Switch
                      checked={slide.showColumnsHeader ?? true}
                      onCheckedChange={(v) => updateSlide(slide.id, { showColumnsHeader: v })}
                      data-testid="toggle-columns-header"
                    />
                  </div>
                  {/* Counter */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#E2DDD5]">Counter</span>
                    <Switch
                      checked={slide.showCounter ?? true}
                      onCheckedChange={(v) => updateSlide(slide.id, { showCounter: v })}
                      data-testid="toggle-counter"
                    />
                  </div>
                  {/* Columns count */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#8A8580]">Columns</label>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={slide.infographicsColumns ?? 1}
                      onChange={(e) => updateSlide(slide.id, { infographicsColumns: parseInt(e.target.value) || 1 })}
                      className="w-full h-9 px-3 rounded-lg border border-[#4A4B4D] bg-[#343536] text-sm text-[#E2DDD5]"
                      data-testid="infographics-columns"
                    />
                  </div>
                </div>
              )}

              {layout === "testimonial" && (
                <div className="space-y-3 pt-2">
                  {/* Testimonial Layout thumbnails */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#8A8580]">Testimonial Layout</label>
                    <div className="grid grid-cols-4 gap-2">
                      {TESTIMONIAL_LAYOUTS.map((tl) => (
                        <button
                          key={tl.id}
                          onClick={() => updateSlide(slide.id, { testimonialLayout: tl.id })}
                          className={cn(
                            "aspect-[4/3] rounded-lg border-2 flex items-center justify-center transition-all overflow-hidden",
                            (slide.testimonialLayout ?? 0) === tl.id
                              ? "border-[#D4A537] bg-[#D4A537]/10"
                              : "border-[#4A4B4D] hover:border-[#B8944F]/50"
                          )}
                          data-testid={`testimonial-layout-${tl.id}`}
                        >
                          {/* Mini thumbnail representation */}
                          <div className="w-full h-full p-1.5 flex flex-col gap-0.5 items-center justify-center">
                            {tl.id === 0 && (
                              <>
                                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400" />)}</div>
                                <div className="w-full h-1 bg-[#5A5B5D] rounded mt-0.5" />
                                <div className="w-3/4 h-1 bg-[#5A5B5D] rounded" />
                              </>
                            )}
                            {tl.id === 1 && (
                              <div className="flex w-full gap-1 items-center">
                                <div className="flex-1 space-y-0.5">
                                  <div className="w-full h-1 bg-[#5A5B5D] rounded" />
                                  <div className="w-3/4 h-1 bg-[#5A5B5D] rounded" />
                                </div>
                                <div className="flex flex-col gap-0.5">{[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-amber-400" />)}</div>
                              </div>
                            )}
                            {tl.id === 2 && (
                              <>
                                <div className="w-full h-1 bg-[#5A5B5D] rounded" />
                                <div className="w-3/4 h-1 bg-[#5A5B5D] rounded" />
                                <div className="w-3 h-3 rounded-full bg-[#5A5B5D] mt-1" />
                              </>
                            )}
                            {tl.id === 3 && (
                              <div className="flex w-full gap-1 items-center">
                                <div className="w-4 h-4 rounded-full bg-[#5A5B5D] shrink-0" />
                                <div className="flex-1 space-y-0.5">
                                  <div className="w-full h-1 bg-[#5A5B5D] rounded" />
                                  <div className="w-2/3 h-1 bg-[#5A5B5D] rounded" />
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Testimonial-specific toggles (2-column grid) */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {[
                      { key: "showStars", label: "Stars" },
                      { key: "showAvatar", label: "Avatar" },
                      { key: "showTitle", label: "Title" },
                      { key: "showName", label: "Name" },
                      { key: "showDescription", label: "Description" },
                      { key: "showDesignation", label: "Designation" },
                      { key: "showQuoteElement", label: "Quote Element" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#E2DDD5]">{label}</span>
                        <Switch
                          checked={(slide as any)[key] ?? true}
                          onCheckedChange={(v) => {
                            if (key === "showTitle" || key === "showDescription") {
                              toggleContentElement(key, v);
                            } else {
                              updateSlide(slide.id, { [key]: v } as any);
                            }
                          }}
                          data-testid={`toggle-${key}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {layout === "bento-grid" && (
                <div className="space-y-3 pt-2">
                  {/* Rows Count */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#8A8580]">Rows Count</label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={slide.bentoRowsCount ?? 1}
                      onChange={(e) => updateSlide(slide.id, { bentoRowsCount: parseInt(e.target.value) || 1 })}
                      className="w-full h-9 px-3 rounded-lg border border-[#4A4B4D] bg-[#343536] text-sm text-[#E2DDD5]"
                      data-testid="bento-rows-count"
                    />
                  </div>
                  {/* Box Theme */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#E2DDD5]">Box Theme</span>
                    <Switch
                      checked={slide.showBoxTheme ?? true}
                      onCheckedChange={(v) => updateSlide(slide.id, { showBoxTheme: v })}
                      data-testid="toggle-box-theme"
                    />
                  </div>
                </div>
              )}

              {/* ── Video Layout Options ── */}
              {layout === "video" && (
                <VideoLayoutSection
                  slide={slide}
                  canvasWidth={project.width}
                  canvasHeight={project.height}
                  updateSlide={updateSlide}
                />
              )}
            </div>

            {/* ── Comparison-specific control panel ── */}
            {layout === "comparison" && (
              <ComparisonPanel slide={slide} updateSlide={updateSlide} />
            )}

            {/* Background Image Overlay section — hidden for comparison (its own bg system) */}
            {layout !== "comparison" && (
            <div className="bg-[#2D2E30] rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-[#E2DDD5] flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#B8944F]" />
                Image Overlay
              </h3>
              <p className="text-[10px] text-[#8A8580] leading-relaxed">
                Layer a semi-transparent image on top of your background color. Great for adding texture or visual depth.
              </p>

              {slide.backgroundOverlayImage ? (
                <div className="space-y-3">
                  {/* Preview */}
                  <div className="relative rounded-lg overflow-hidden border border-[#4A4B4D] h-20">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${slide.backgroundOverlayImage})`,
                        opacity: (slide.backgroundOverlayOpacity ?? 40) / 100,
                      }}
                    />
                    <div className="absolute inset-0" style={{ background: slide.backgroundGradient || slide.backgroundColor }} />
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${slide.backgroundOverlayImage})`,
                        opacity: (slide.backgroundOverlayOpacity ?? 40) / 100,
                      }}
                    />
                  </div>

                  {/* Opacity slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-[#8A8580]">Overlay Opacity</label>
                      <span className="text-xs font-medium text-[#E2DDD5] px-1.5 py-0.5 rounded bg-[#464849]">
                        {slide.backgroundOverlayOpacity ?? 40}%
                      </span>
                    </div>
                    <Slider
                      value={[slide.backgroundOverlayOpacity ?? 40]}
                      min={5}
                      max={100}
                      step={5}
                      onValueChange={([v]) => updateSlide(slide.id, { backgroundOverlayOpacity: v })}
                      data-testid="overlay-opacity-slider"
                    />
                  </div>

                  {/* Remove overlay */}
                  <button
                    onClick={() => updateSlide(slide.id, { backgroundOverlayImage: undefined, backgroundOverlayOpacity: undefined })}
                    className="w-full text-xs py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    data-testid="remove-overlay-btn"
                  >
                    Remove Overlay
                  </button>
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-[#5A5B5D] hover:border-[#B8944F]/50 cursor-pointer transition-colors"
                  data-testid="overlay-upload-zone"
                >
                  <ImageIcon className="w-5 h-5 text-[#8A8580]" />
                  <span className="text-xs text-[#8A8580]">Click to upload an overlay image</span>
                  <span className="text-[10px] text-[#8A8580]">PNG, JPG, screenshots — any image works</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const dataUrl = ev.target?.result as string;
                        updateSlide(slide.id, { backgroundOverlayImage: dataUrl, backgroundOverlayOpacity: 40 });
                      };
                      reader.readAsDataURL(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
            )}

            {/* Content Elements section — hidden for comparison */}
            {layout !== "comparison" && getContentElements().length > 0 && (
            <div className="bg-[#2D2E30] rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-[#E2DDD5]">Content Elements</h3>
              <div className="space-y-2.5">
                {getContentElements().map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#E2DDD5]">{label}</span>
                    <Switch
                      checked={(slide as any)[key] ?? false}
                      onCheckedChange={(v) => toggleContentElement(key, v)}
                      data-testid={`content-toggle-${key}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>

          {/* Right — Live Preview */}
          <div className="flex-1 flex items-center justify-center p-5 bg-[#2D2E30]/50 overflow-hidden">
            <div
              className="rounded-xl overflow-hidden shadow-lg"
              style={{
                width: project.width * previewScale,
                height: project.height * previewScale,
              }}
            >
              <div
                style={{
                  width: project.width,
                  height: project.height,
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
              >
                <SlideRenderer
                  slide={slide}
                  project={project}
                  store={store}
                  slideIndex={slideIndex}
                  isSelected={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Slide Canvas ─────────────────── */
export function SlideCanvas({ store, activeTopPanel, activeLeftPanel, setActiveLeftPanel }: SlideCanvasProps) {
  const {
    project, selectedSlideIndex, setSelectedSlideIndex, setSelectedElementId,
    addSlide, addComparisonSlide, duplicateSlide, deleteSlide, moveSlide, updateSlide,
  } = store;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [configureOpen, setConfigureOpen] = useState<number | null>(null);

  /* Listen for the toolbar quick-action (Tier 1) and the empty-state hero
     card (Tier 4) — both dispatch `fctg:open-configure` after creating or
     converting a comparison slide so we can pop the Configure modal open. */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail?.index === "number") {
        setConfigureOpen(detail.index);
      }
    };
    window.addEventListener("fctg:open-configure", handler);
    return () => window.removeEventListener("fctg:open-configure", handler);
  }, []);
  const [mediaModalOpen, setMediaModalOpen] = useState<number | null>(null);
  const [recentUploads, setRecentUploads] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const confirmDeleteRef = useRef<HTMLDivElement>(null);

  // Close confirm popup on outside click
  useEffect(() => {
    if (confirmDelete === null) return;
    const handler = (e: MouseEvent) => {
      if (confirmDeleteRef.current && !confirmDeleteRef.current.contains(e.target as Node)) {
        setConfirmDelete(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [confirmDelete]);

  // Calculate scale to fit slides in viewport height (filmstrip view)
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [, forceUpdate] = useState(0);

  // Measure available canvas height via ResizeObserver for responsive scaling
  useEffect(() => {
    if (!canvasRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.round(entry.contentRect.height);
        setCanvasHeight(h);
      }
    });
    observer.observe(canvasRef.current);
    // Immediate measure on mount
    setCanvasHeight(canvasRef.current.clientHeight);
    return () => observer.disconnect();
  }, []);

  // Force a measurement after first paint
  useEffect(() => {
    if (canvasHeight === 0 && canvasRef.current) {
      setCanvasHeight(canvasRef.current.clientHeight);
    }
  });

  // Filmstrip scale: slides fill available height minus toolbar + labels
  const toolbarHeight = 44;
  const labelHeight = 32;
  const effectiveHeight = canvasHeight || 700; // fallback before measurement
  const availableHeight = effectiveHeight - toolbarHeight - labelHeight - 24;
  const scale = Math.min(Math.max(availableHeight / project.height, 0.2), 1);
  const displayWidth = project.width * scale;
  const displayHeight = project.height * scale;

  const scrollToSlide = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const DIVIDER_WIDTH = 1;
    const SPACER_WIDTH = 64; // left spacer for floating sidebar
    const scrollTarget = SPACER_WIDTH + index * (displayWidth + DIVIDER_WIDTH);
    container.scrollTo({ left: scrollTarget - container.clientWidth / 2 + displayWidth / 2, behavior: "smooth" });
  };

  const handleSlideClick = (index: number) => {
    setSelectedSlideIndex(index);
    setSelectedElementId(null);
    scrollToSlide(index);
  };

  const scrollPrev = () => {
    if (selectedSlideIndex > 0) handleSlideClick(selectedSlideIndex - 1);
  };

  const scrollNext = () => {
    if (selectedSlideIndex < project.slides.length - 1) handleSlideClick(selectedSlideIndex + 1);
  };

  const handleMediaSelect = (value: string, slideIndex: number) => {
    const slide = project.slides[slideIndex];
    if (!slide) return;
    // If value is a CSS gradient (starts with "linear-gradient"), set it as backgroundGradient
    // If it's a data URL or image URL, set it as backgroundImage
    if (value.startsWith("linear-gradient")) {
      updateSlide(slide.id, { backgroundGradient: value, backgroundImage: undefined });
    } else {
      updateSlide(slide.id, { backgroundImage: value, backgroundGradient: undefined });
    }
    setMediaModalOpen(null);
  };

  const handleMediaUpload = (dataUrl: string) => {
    setRecentUploads((prev) => [dataUrl, ...prev].slice(0, 20));
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 canvas-workspace flex flex-col relative overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedElementId(null);
        }
      }}
      data-testid="slide-canvas"
    >
      {/* Floating canvas sidebar — PostNitro style vertical pill */}
      <div
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center bg-card rounded-xl shadow-lg border py-2 px-1 gap-0.5"
        data-testid="canvas-floating-sidebar"
      >
        {CANVAS_SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (setActiveLeftPanel) {
                if (item.id === "ai") return;
                setActiveLeftPanel(activeLeftPanel === item.id ? "" : item.id);
              }
            }}
            className={cn(
              "w-10 h-10 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors",
              item.accent
                ? "text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
              activeLeftPanel === item.id && !item.accent && "bg-accent text-foreground"
            )}
            data-testid={`canvas-sidebar-${item.id}`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-[9px] font-medium leading-none">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Navigation arrow — left */}
      {selectedSlideIndex > 0 && (
        <button
          onClick={scrollPrev}
          className="absolute left-16 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/80 border shadow-sm flex items-center justify-center hover:bg-accent transition-colors"
          data-testid="nav-prev"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {/* Navigation arrow — right */}
      {selectedSlideIndex < project.slides.length - 1 && (
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/80 border shadow-sm flex items-center justify-center hover:bg-accent transition-colors"
          data-testid="nav-next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Filmstrip slides area */}
      <div
        ref={scrollRef}
        className="flex-1 flex items-start overflow-x-auto overflow-y-hidden w-full custom-scrollbar"
        style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
      >
        {/* Left spacer for floating sidebar */}
        <div className="flex-shrink-0 w-16" />

        {project.slides.map((slide, index) => (
          <div
            key={slide.id}
            className="flex-shrink-0 flex flex-col items-center relative"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Per-slide toolbar above slide */}
            <div className={cn(
              "flex items-center gap-1 h-[40px] px-2 transition-opacity",
              selectedSlideIndex === index ? "opacity-100" : "opacity-50 hover:opacity-75"
            )}>
              {/* Eye / visibility */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const vis = slide.visible !== false;
                  updateSlide(slide.id, { visible: !vis });
                }}
                className={cn(
                  "w-7 h-7 flex items-center justify-center rounded-md transition-colors",
                  slide.visible === false
                    ? "text-muted-foreground/40 hover:bg-accent"
                    : "text-muted-foreground hover:bg-accent"
                )}
                title={slide.visible === false ? "Show slide" : "Hide slide"}
                data-testid={`visibility-btn-${index}`}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-4 bg-border mx-0.5" />

              {/* Configure */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfigureOpen(configureOpen === index ? null : index);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors hover:bg-accent",
                  configureOpen === index && "bg-accent text-foreground"
                )}
                data-testid={`configure-btn-${index}`}
              >
                <Settings className="w-3.5 h-3.5" />
                Configure
              </button>

              {/* Background Image */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMediaModalOpen(index);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors hover:bg-accent",
                  mediaModalOpen === index && "bg-accent text-foreground"
                )}
                data-testid={`bg-image-btn-${index}`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Background Image
              </button>

              <div className="w-px h-4 bg-border mx-0.5" />

              {/* Move backward */}
              <button
                onClick={(e) => { e.stopPropagation(); moveSlide(index, "left"); }}
                disabled={index === 0}
                className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors disabled:opacity-30"
                title="Move backward"
                data-testid={`move-left-${index}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Move forward */}
              <button
                onClick={(e) => { e.stopPropagation(); moveSlide(index, "right"); }}
                disabled={index === project.slides.length - 1}
                className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors disabled:opacity-30"
                title="Move forward"
                data-testid={`move-right-${index}`}
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>

              {/* Duplicate */}
              <button
                onClick={(e) => { e.stopPropagation(); duplicateSlide(index); }}
                className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
                title="Duplicate slide"
                data-testid={`duplicate-${index}`}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              {/* Delete — with confirmation popup */}
              <div className="relative" ref={confirmDelete === index ? confirmDeleteRef : undefined}>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(confirmDelete === index ? null : index); }}
                  disabled={project.slides.length <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30"
                  title="Delete slide"
                  data-testid={`delete-${index}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {confirmDelete === index && (
                  <div
                    className="absolute top-9 left-1/2 -translate-x-1/2 z-50 bg-[#2D2E30] border border-[#4A4B4D] rounded-xl shadow-xl p-3 w-44 flex flex-col gap-2"
                    onClick={(e) => e.stopPropagation()}
                    data-testid={`delete-confirm-popup-${index}`}
                  >
                    <p className="text-xs font-medium text-[#E2DDD5] text-center">Delete this slide?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }}
                        className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-[#3A3B3D] text-[#8A8580] hover:text-[#E2DDD5] hover:bg-[#464849] transition-colors"
                        data-testid={`delete-cancel-${index}`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteSlide(index); setConfirmDelete(null); }}
                        className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                        data-testid={`delete-confirm-${index}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Add slide — Tier 2 of the comparison visibility upgrade.
                  The plain '+' is now a dropdown that exposes both a blank
                  slide and a featured "Comparison Slide" option, so users
                  who scroll the filmstrip can spawn a comparison without
                  going up to the toolbar. */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
                    title="Add a slide after this one"
                    data-testid={`add-slide-inline-${index}`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem
                    onClick={(e) => { e.stopPropagation(); addSlide(index); }}
                    data-testid={`add-slide-blank-${index}`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Blank Slide
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIdx = addComparisonSlide("pro-con", index);
                      requestAnimationFrame(() => {
                        window.dispatchEvent(
                          new CustomEvent("fctg:open-configure", { detail: { index: newIdx } })
                        );
                      });
                    }}
                    className="text-[#D4A537] focus:text-[#D4A537] focus:bg-[#D4A537]/10"
                    data-testid={`add-slide-comparison-${index}`}
                  >
                    <Columns2 className="w-4 h-4 mr-2" />
                    <span className="flex-1">Comparison Slide</span>
                    <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#FF4D6D] text-white">
                      NEW
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Slide + divider container */}
            <div className="flex items-stretch">
              {/* The slide itself */}
              <div
                onClick={() => handleSlideClick(index)}
                className={cn(
                  "overflow-hidden cursor-pointer relative",
                  selectedSlideIndex === index && "ring-2 ring-primary/40 ring-offset-1"
                )}
                style={{
                  width: displayWidth,
                  height: displayHeight,
                }}
              >
                <div
                  style={{
                    width: project.width,
                    height: project.height,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                  data-slide-export
                >
                  <SlideRenderer
                    slide={slide}
                    project={project}
                    store={store}
                    slideIndex={index}
                    isSelected={selectedSlideIndex === index}
                  />
                </div>
              </div>

              {/* Vertical divider line between slides */}
              {index < project.slides.length - 1 && (
                <div className="w-px bg-border/60 flex-shrink-0" />
              )}
            </div>

            {/* Slide label below */}
            <div className={cn(
              "h-[28px] flex items-center justify-center text-xs font-medium gap-1.5",
              selectedSlideIndex === index ? "text-foreground" : "text-muted-foreground"
            )}>
              <span className="capitalize text-[10px] px-1.5 py-0.5 rounded bg-muted">{slide.slideType}</span>
              <span>{index + 1}</span>
            </div>
          </div>
        ))}

        {/* Right spacer */}
        <div className="flex-shrink-0 w-16" />
      </div>

      {/* Slide counter pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-card border shadow-sm">
        <span className="text-xs font-medium">
          {selectedSlideIndex + 1} / {project.slides.length}
        </span>
      </div>

      {/* Configure Modal (full centered modal, PostNitro style) */}
      {configureOpen !== null && project.slides[configureOpen] && (
        <ConfigureModal
          slide={project.slides[configureOpen]}
          store={store}
          project={project}
          slideIndex={configureOpen}
          onClose={() => setConfigureOpen(null)}
        />
      )}

      {/* Media Modal (Background Image picker, PostNitro style) */}
      {mediaModalOpen !== null && (
        <MediaModal
          onSelect={(value) => handleMediaSelect(value, mediaModalOpen)}
          onClose={() => setMediaModalOpen(null)}
          recentUploads={recentUploads}
          onUpload={handleMediaUpload}
        />
      )}
    </div>
  );
}
