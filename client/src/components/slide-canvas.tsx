import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Copy, Trash2, ArrowLeft, ArrowRight, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { SlideRenderer } from "@/components/slide-renderer";

interface SlideCanvasProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
  activeTopPanel: string | null;
}

export function SlideCanvas({ store, activeTopPanel }: SlideCanvasProps) {
  const {
    project, selectedSlideIndex, setSelectedSlideIndex, setSelectedElementId,
    addSlide, duplicateSlide, deleteSlide, moveSlide,
  } = store;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Calculate scale to fit slides in viewport
  const CANVAS_PADDING = 60;
  const SLIDE_GAP = 32;
  const maxSlideHeight = 500; // viewport height for slide display
  const scale = Math.min(maxSlideHeight / project.height, 400 / project.width);
  const displayWidth = project.width * scale;
  const displayHeight = project.height * scale;

  const scrollToSlide = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollTarget = index * (displayWidth + SLIDE_GAP);
    container.scrollTo({ left: scrollTarget - container.clientWidth / 2 + displayWidth / 2, behavior: "smooth" });
  };

  const handleSlideClick = (index: number) => {
    setSelectedSlideIndex(index);
    setSelectedElementId(null);
    scrollToSlide(index);
  };

  const scrollPrev = () => {
    if (selectedSlideIndex > 0) {
      handleSlideClick(selectedSlideIndex - 1);
    }
  };

  const scrollNext = () => {
    if (selectedSlideIndex < project.slides.length - 1) {
      handleSlideClick(selectedSlideIndex + 1);
    }
  };

  return (
    <div
      className="flex-1 canvas-workspace flex flex-col items-center justify-center relative overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedElementId(null);
        }
      }}
      data-testid="slide-canvas"
    >
      {/* Navigation arrows */}
      {selectedSlideIndex > 0 && (
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
          data-testid="nav-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {selectedSlideIndex < project.slides.length - 1 && (
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
          data-testid="nav-next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Slides scroll area */}
      <div
        ref={scrollRef}
        className="flex items-center gap-8 overflow-x-auto px-16 py-6 w-full max-w-full custom-scrollbar"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {project.slides.map((slide, index) => (
          <div
            key={slide.id}
            className="flex-shrink-0 flex flex-col items-center"
            style={{ scrollSnapAlign: "center" }}
          >
            {/* Per-slide toolbar */}
            <div className={cn(
              "flex items-center gap-1 mb-2 opacity-0 transition-opacity",
              selectedSlideIndex === index && "opacity-100"
            )}>
              <Button
                variant="ghost" size="sm"
                onClick={() => moveSlide(index, "left")}
                disabled={index === 0}
                className="h-7 w-7 p-0"
                data-testid={`move-left-${index}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost" size="sm"
                onClick={() => duplicateSlide(index)}
                className="h-7 w-7 p-0"
                data-testid={`duplicate-${index}`}
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost" size="sm"
                onClick={() => deleteSlide(index)}
                disabled={project.slides.length <= 1}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                data-testid={`delete-${index}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost" size="sm"
                onClick={() => moveSlide(index, "right")}
                disabled={index === project.slides.length - 1}
                className="h-7 w-7 p-0"
                data-testid={`move-right-${index}`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Slide */}
            <div
              onClick={() => handleSlideClick(index)}
              className={cn(
                "slide-card rounded-xl overflow-hidden cursor-pointer relative",
                selectedSlideIndex === index && "active"
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

            {/* Slide number label */}
            <div className={cn(
              "mt-2 text-xs font-medium",
              selectedSlideIndex === index ? "text-foreground" : "text-muted-foreground"
            )}>
              {index + 1}
            </div>
          </div>
        ))}

        {/* Add slide button */}
        <div className="flex-shrink-0">
          <button
            onClick={addSlide}
            className="rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            style={{ width: displayWidth, height: displayHeight }}
            data-testid="add-slide"
          >
            <Plus className="w-8 h-8" />
            <span className="text-xs font-medium">Add Slide</span>
          </button>
        </div>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border shadow-sm">
        <span className="text-xs font-medium">
          {selectedSlideIndex + 1} / {project.slides.length}
        </span>
      </div>
    </div>
  );
}
