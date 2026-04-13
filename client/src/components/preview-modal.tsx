import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Play, Pause, Maximize2, Minimize2, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { SlideRenderer } from "@/components/slide-renderer";
import type { CarouselProject } from "@/lib/types";

const MOCKUP_PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#E1306C" },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { id: "tiktok", label: "TikTok", color: "#000000" },
  { id: "facebook", label: "Facebook", color: "#1877F2" },
  { id: "x", label: "X", color: "#000000" },
] as const;

function PhoneMockup({
  platform,
  children,
  slideWidth,
  slideHeight,
}: {
  platform: string;
  children: React.ReactNode;
  slideWidth: number;
  slideHeight: number;
}) {
  const platformData = MOCKUP_PLATFORMS.find(p => p.id === platform) || MOCKUP_PLATFORMS[0];
  
  // Phone dimensions - simulate iPhone-style aspect ratio
  const phoneWidth = 375;
  const phoneHeight = 812;
  // Content area (inside phone chrome)
  const contentTop = 88; // status bar + nav bar
  const contentBottom = 50; // bottom nav
  const contentWidth = phoneWidth;
  const contentHeight = phoneHeight - contentTop - contentBottom;
  
  // Scale slide to fit content area
  const slideScale = Math.min(contentWidth / slideWidth, contentHeight / slideHeight);
  const scaledW = slideWidth * slideScale;
  const scaledH = slideHeight * slideScale;
  
  return (
    <div
      className="relative bg-black rounded-[3rem] border-[3px] border-gray-700 overflow-hidden shadow-2xl"
      style={{ width: phoneWidth, height: phoneHeight }}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-2xl z-20" />
      
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 h-[44px] bg-black z-10 flex items-end justify-between px-6 pb-1">
        <span className="text-white text-[11px] font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-2 border border-white/80 rounded-sm relative">
            <div className="absolute inset-[1px] right-[2px] bg-white/80 rounded-[1px]" />
          </div>
        </div>
      </div>
      
      {/* Platform header/nav bar */}
      {platform === "instagram" && (
        <div className="absolute top-[44px] left-0 right-0 h-[44px] bg-black flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-black" />
            </div>
            <span className="text-white text-sm font-semibold">fromchainstoglory</span>
          </div>
          <div className="flex items-center gap-4 text-white">
            <span className="text-lg">···</span>
          </div>
        </div>
      )}
      {platform === "linkedin" && (
        <div className="absolute top-[44px] left-0 right-0 h-[44px] bg-white flex items-center justify-between px-4 z-10 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-xs font-bold">F</div>
            <span className="text-gray-900 text-sm font-semibold">From Chains To Glory</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <span className="text-lg">···</span>
          </div>
        </div>
      )}
      {platform === "tiktok" && (
        <div className="absolute top-[44px] left-0 right-0 h-[44px] bg-black flex items-center justify-center z-10">
          <div className="flex items-center gap-6">
            <span className="text-white/60 text-sm">Following</span>
            <span className="text-white text-sm font-semibold border-b-2 border-white pb-0.5">For You</span>
          </div>
        </div>
      )}
      {platform === "facebook" && (
        <div className="absolute top-[44px] left-0 right-0 h-[44px] bg-white flex items-center justify-between px-4 z-10 border-b border-gray-200">
          <span className="text-[#1877F2] text-lg font-bold">facebook</span>
          <div className="flex items-center gap-3 text-gray-500">
            <span className="text-lg">🔍</span>
          </div>
        </div>
      )}
      {platform === "x" && (
        <div className="absolute top-[44px] left-0 right-0 h-[44px] bg-black flex items-center justify-center z-10 border-b border-gray-800">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      )}
      
      {/* Content area — slide goes here */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{
          top: contentTop,
          height: contentHeight,
          backgroundColor: platform === "linkedin" || platform === "facebook" ? "#f3f2ef" : "#000",
        }}
      >
        <div style={{ width: scaledW, height: scaledH, overflow: "hidden" }}>
          {children}
        </div>
      </div>
      
      {/* Engagement bar (below slide, platform-specific) */}
      {platform === "instagram" && (
        <div className="absolute left-0 right-0 flex items-center gap-4 px-4 py-2 bg-black z-10" style={{ top: contentTop + contentHeight }}>
          <span className="text-white text-xl">♡</span>
          <span className="text-white text-xl">💬</span>
          <span className="text-white text-xl">➤</span>
          <div className="flex-1" />
          <span className="text-white text-xl">⊡</span>
        </div>
      )}
      
      {/* Bottom nav bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-around py-3 z-10"
        style={{
          height: contentBottom,
          backgroundColor: platform === "linkedin" || platform === "facebook" ? "#fff" : "#000",
          borderTop: `1px solid ${platform === "linkedin" || platform === "facebook" ? "#e0e0e0" : "#333"}`,
        }}
      >
        {[1,2,3,4,5].map(i => (
          <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: platform === "linkedin" || platform === "facebook" ? "#666" : "#555", opacity: 0.3 }} />
        ))}
      </div>
      
      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] rounded-full bg-white/40 z-20" />
    </div>
  );
}

interface PreviewModalProps {
  project: CarouselProject;
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
  initialSlide?: number;
  onClose: () => void;
}

export function PreviewModal({ project, store, initialSlide = 0, onClose }: PreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialSlide);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState(3000); // ms per slide
  const [mockupMode, setMockupMode] = useState(false);
  const [mockupPlatform, setMockupPlatform] = useState<string>(project.platform || "instagram");
  const slides = project.slides;
  const total = slides.length;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= total - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "p" || e.key === "P") {
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPlaying, goNext, autoPlayInterval]);

  // Stop autoplay when reaching the last slide
  useEffect(() => {
    if (currentIndex >= total - 1) {
      setIsPlaying(false);
    }
  }, [currentIndex, total]);

  // Calculate scale to fit slide in viewport
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1280;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 720;
  const maxWidth = viewportWidth * 0.75;
  const maxHeight = viewportHeight * 0.78;
  const scale = Math.min(maxWidth / project.width, maxHeight / project.height);

  const currentSlide = slides[currentIndex];
  if (!currentSlide) return null;

  const content = (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={onClose}
      data-testid="preview-overlay"
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-3 bg-black/60 border-b border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white/80">{project.name}</span>
          <span className="text-xs text-white/40 font-mono">
            Slide {currentIndex + 1} of {total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Auto-play toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              isPlaying
                ? "bg-[#D4A537] text-[#08080A]"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            )}
            data-testid="preview-autoplay"
            title={isPlaying ? "Pause slideshow (P)" : "Play slideshow (P)"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          {/* Mockup toggle */}
          <button
            onClick={() => setMockupMode(!mockupMode)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              mockupMode
                ? "bg-[#D4A537] text-[#08080A]"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            )}
            data-testid="preview-mockup-toggle"
            title={mockupMode ? "Switch to clean preview" : "Show in device mockup"}
          >
            <Smartphone className="w-3.5 h-3.5" />
            {mockupMode ? "Mockup" : "Device"}
          </button>

          {/* Platform selector — only visible when mockup mode is on */}
          {mockupMode && (
            <div className="flex items-center gap-1 ml-1">
              {MOCKUP_PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setMockupPlatform(p.id)}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-medium transition-colors",
                    mockupPlatform === p.id
                      ? "text-white"
                      : "text-white/40 hover:text-white/70"
                  )}
                  style={mockupPlatform === p.id ? { backgroundColor: p.color } : {}}
                  data-testid={`mockup-platform-${p.id}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            data-testid="preview-close"
            title="Close preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main slide area */}
      <div
        className="flex-1 flex items-center justify-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left arrow */}
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className={cn(
            "absolute left-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all",
            currentIndex === 0
              ? "opacity-20 cursor-not-allowed"
              : "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white hover:scale-105"
          )}
          data-testid="preview-prev"
          title="Previous slide (←)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Slide container */}
        {mockupMode ? (
          <div style={{ transform: `scale(${Math.min(maxHeight / 812, maxWidth / 375)})`, transformOrigin: 'center center' }}>
            <PhoneMockup
              platform={mockupPlatform}
              slideWidth={project.width}
              slideHeight={project.height}
            >
              <div
                style={{
                  width: project.width,
                  height: project.height,
                  transform: `scale(${Math.min(375 / project.width, (812 - 138) / project.height)})`,
                  transformOrigin: "top left",
                }}
              >
                <SlideRenderer
                  slide={currentSlide}
                  project={project}
                  store={store}
                  slideIndex={currentIndex + 1}
                  isSelected={false}
                  previewMode
                />
              </div>
            </PhoneMockup>
          </div>
        ) : (
          <div
            className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            style={{
              width: project.width * scale,
              height: project.height * scale,
            }}
          >
            <div
              style={{
                width: project.width,
                height: project.height,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <SlideRenderer
                slide={currentSlide}
                project={project}
                store={store}
                slideIndex={currentIndex + 1}
                isSelected={false}
                previewMode
              />
            </div>
          </div>
        )}

        {/* Right arrow */}
        <button
          onClick={goNext}
          disabled={currentIndex >= total - 1}
          className={cn(
            "absolute right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all",
            currentIndex >= total - 1
              ? "opacity-20 cursor-not-allowed"
              : "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white hover:scale-105"
          )}
          data-testid="preview-next"
          title="Next slide (→)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom thumbnail strip */}
      <div
        className="flex items-center justify-center gap-2 px-6 py-3 bg-black/60 border-t border-white/10 overflow-x-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {slides.map((slide, idx) => {
          const thumbScale = 60 / project.height;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "rounded-md overflow-hidden border-2 transition-all shrink-0",
                idx === currentIndex
                  ? "border-[#D4A537] ring-1 ring-[#D4A537]/50"
                  : "border-transparent opacity-50 hover:opacity-80"
              )}
              style={{
                width: project.width * thumbScale,
                height: 60,
              }}
              data-testid={`preview-thumb-${idx}`}
              title={`Slide ${idx + 1}`}
            >
              <div
                style={{
                  width: project.width,
                  height: project.height,
                  transform: `scale(${thumbScale})`,
                  transformOrigin: "top left",
                  pointerEvents: "none",
                }}
              >
                <SlideRenderer
                  slide={slide}
                  project={project}
                  store={store}
                  slideIndex={idx + 1}
                  isSelected={false}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Keyboard hints */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] text-white/30 font-mono pointer-events-none">
        <span>← → Navigate</span>
        <span>Space Next</span>
        <span>P Play/Pause</span>
        <span>Esc Close</span>
      </div>

      {/* Progress bar */}
      <div className="absolute top-[52px] left-0 right-0 h-0.5 bg-white/5">
        <div
          className="h-full bg-[#D4A537] transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
