import { useState, useRef, useEffect } from "react";
import type { Slide, SlideElement, CarouselProject } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SlideRendererProps {
  slide: Slide;
  project: CarouselProject;
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
  slideIndex: number;
  isSelected: boolean;
}

function getPatternSVG(pattern: string, opacity: number, color: string = "rgba(255,255,255,") {
  const a = opacity / 100;
  switch (pattern) {
    case "dots":
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='${encodeURIComponent(`rgba(255,255,255,${a})`)}'/%3E%3C/svg%3E")`;
    case "lines":
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='20' x2='20' y2='20' stroke='${encodeURIComponent(`rgba(255,255,255,${a})`)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case "diagonal":
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='20' x2='20' y2='0' stroke='${encodeURIComponent(`rgba(255,255,255,${a})`)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case "grid":
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' fill='none' stroke='${encodeURIComponent(`rgba(255,255,255,${a})`)}' stroke-width='0.5'/%3E%3C/svg%3E")`;
    default:
      return "none";
  }
}

function ElementRenderer({
  element,
  slideId,
  store,
  isSlideSelected,
}: {
  element: SlideElement;
  slideId: string;
  store: SlideRendererProps["store"];
  isSlideSelected: boolean;
}) {
  const { selectedElementId, setSelectedElementId, updateElement, removeElement } = store;
  const isSelected = selectedElementId === element.id && isSlideSelected;
  const editRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === "shape") return;
    setIsEditing(true);
    setSelectedElementId(element.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editRef.current) {
      const newContent = editRef.current.innerText;
      updateElement(slideId, element.id, { content: newContent });
    }
  };

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.type === "shape" ? element.height : "auto",
    minHeight: element.height,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    opacity: element.opacity ?? 1,
  };

  if (element.type === "shape") {
    return (
      <div
        onClick={handleClick}
        style={{
          ...baseStyle,
          backgroundColor: element.backgroundColor,
          borderRadius: element.borderRadius,
        }}
        className={cn(
          "cursor-pointer transition-shadow",
          isSelected && "ring-2 ring-blue-500 ring-offset-2"
        )}
        data-testid={`element-${element.id}`}
      />
    );
  }

  // Text-based elements
  const textStyle: React.CSSProperties = {
    ...baseStyle,
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    fontWeight: element.fontWeight as any,
    textAlign: element.textAlign,
    color: element.color,
    lineHeight: element.lineHeight || 1.4,
    letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined,
    textTransform: element.textTransform,
    backgroundColor: element.backgroundColor,
    borderRadius: element.borderRadius,
    padding: element.padding || (element.type === "cta" ? 16 : 0),
    display: element.type === "cta" ? "inline-flex" : undefined,
    alignItems: element.type === "cta" ? "center" : undefined,
    justifyContent: element.type === "cta" ? "center" : undefined,
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={textStyle}
      className={cn(
        "cursor-pointer select-none transition-shadow",
        isSelected && "ring-2 ring-blue-500",
        isEditing && "ring-2 ring-blue-400 ring-dashed"
      )}
      data-testid={`element-${element.id}`}
    >
      {isEditing ? (
        <div
          ref={editRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              handleBlur();
            }
          }}
          className="outline-none w-full inline-editable"
          style={{
            fontSize: "inherit",
            fontFamily: "inherit",
            fontWeight: "inherit",
            textAlign: "inherit",
            color: "inherit",
            lineHeight: "inherit",
          }}
        >
          {element.content}
        </div>
      ) : (
        <span>{element.content}</span>
      )}
    </div>
  );
}

export function SlideRenderer({ slide, project, store, slideIndex, isSelected }: SlideRendererProps) {
  const { globalStyles } = project;
  const bgPattern = slide.backgroundPattern && slide.backgroundPattern !== "none"
    ? getPatternSVG(slide.backgroundPattern, slide.patternOpacity || 10)
    : "none";

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        width: project.width,
        height: project.height,
        background: slide.backgroundGradient || slide.backgroundColor,
        fontFamily: globalStyles.bodyFont,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && isSelected) {
          store.setSelectedElementId(null);
        }
      }}
    >
      {/* Background pattern overlay */}
      {bgPattern !== "none" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: bgPattern }}
        />
      )}

      {/* Background image */}
      {slide.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.backgroundImage})` }}
        />
      )}

      {/* Slide elements */}
      {slide.elements.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          slideId={slide.id}
          store={store}
          isSlideSelected={isSelected}
        />
      ))}

      {/* Branding badge */}
      {globalStyles.brandingEnabled && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ backgroundColor: globalStyles.brandColor + "22", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: globalStyles.brandColor, color: slide.backgroundColor }}
          >
            {globalStyles.brandName?.charAt(0) || "F"}
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: globalStyles.brandColor }}
          >
            {globalStyles.brandName}
          </span>
        </div>
      )}

      {/* Slide number */}
      {globalStyles.slideNumberEnabled && (
        <div
          className="absolute top-6 right-8 text-lg font-bold"
          style={{ color: globalStyles.colorPalette[1] || "#D4A537" }}
        >
          {globalStyles.slideNumberStyle === "padded"
            ? String(slideIndex + 1).padStart(2, "0")
            : globalStyles.slideNumberStyle === "hash"
              ? `#${slideIndex + 1}`
              : String(slideIndex + 1)}
        </div>
      )}

      {/* Swipe indicator (first slide only) */}
      {globalStyles.swipeIndicatorEnabled && slideIndex === 0 && (
        <div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-sm font-medium animate-pulse"
          style={{ color: globalStyles.colorPalette[2] || "#ccc" }}
        >
          {globalStyles.swipeText}
        </div>
      )}
    </div>
  );
}
