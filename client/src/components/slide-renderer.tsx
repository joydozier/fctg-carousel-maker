import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import type { Slide, SlideElement, CarouselProject } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GripVertical, ImagePlus, Film, Bold, Italic, Pipette } from "lucide-react";
import { ComparisonSlide } from "@/components/ComparisonSlide";
import { BRAND_FAMILIES } from "@/lib/brand-palettes";

interface SlideRendererProps {
  slide: Slide;
  project: CarouselProject;
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
  slideIndex: number;
  isSelected: boolean;
  previewMode?: boolean; // When true, videos play unmuted (for Preview modal)
}

function getPatternSVG(pattern: string, opacity: number) {
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
    case "waves":
      return `url("data:image/svg+xml,%3Csvg width='40' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q10 0 20 10 Q30 20 40 10' fill='none' stroke='${encodeURIComponent(`rgba(255,255,255,${a})`)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case "crosses":
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 4v12M4 10h12' stroke='${encodeURIComponent(`rgba(255,255,255,${a})`)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case "zigzag":
      return `url("data:image/svg+xml,%3Csvg width='40' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 15 L10 5 L20 15 L30 5 L40 15' fill='none' stroke='${encodeURIComponent(`rgba(255,255,255,${a})`)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case "noise":
      return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${a}'/%3E%3C/svg%3E")`;
    default:
      return "none";
  }
}

/** Render text content with accent-colored first word */
function AccentText({
  content,
  accentColor,
  baseColor,
  style,
}: {
  content: string;
  accentColor?: string;
  baseColor?: string;
  style?: React.CSSProperties;
}) {
  if (!accentColor || !content) {
    return <span style={style}>{content}</span>;
  }
  const firstSpaceIndex = content.indexOf(" ");
  if (firstSpaceIndex === -1) {
    return <span style={{ ...style, color: accentColor }}>{content}</span>;
  }
  const firstWord = content.substring(0, firstSpaceIndex);
  const rest = content.substring(firstSpaceIndex);
  return (
    <span style={style}>
      <span style={{ color: accentColor }}>{firstWord}</span>
      <span style={{ color: baseColor }}>{rest}</span>
    </span>
  );
}

// ─── Resize handle types ──────────────────────────────────────────────────────
type ResizeHandle =
  | "nw" | "n" | "ne"
  | "w"  |       "e"
  | "sw" | "s" | "se";

const HANDLE_CURSORS: Record<ResizeHandle, string> = {
  nw: "nw-resize", n: "n-resize",  ne: "ne-resize",
  w:  "w-resize",                   e:  "e-resize",
  sw: "sw-resize", s: "s-resize",  se: "se-resize",
};

// ─── Context menu ─────────────────────────────────────────────────────────────
interface ContextMenuState {
  x: number;
  y: number;
  elementId: string;
}

// ─── Floating Inline Text Toolbar ─────────────────────────────────────────────
// Sits just above a selected text-like element. Lets the user:
//   • Apply FCTG brand colors (or any hex) to the current text selection
//     (via document.execCommand('foreColor')) — falls back to recoloring the
//     entire element when no caret/selection is active.
//   • Toggle bold / italic on the whole element.
function FloatingTextToolbar({
  element,
  slideId,
  updateElement,
  editRef,
  isEditing,
}: {
  element: SlideElement;
  slideId: string;
  updateElement: (slideId: string, elementId: string, patch: Partial<SlideElement>) => void;
  editRef: React.RefObject<HTMLDivElement>;
  isEditing: boolean;
}) {
  // Only show on text-like elements
  const isTextLike =
    element.type === "heading" ||
    element.type === "subtitle" ||
    element.type === "body" ||
    element.type === "cta";
  if (!isTextLike) return null;

  // FCTG core swatches (8 primary brand colors)
  const fctgSwatches = BRAND_FAMILIES[0]?.swatches ?? [];

  /** True when there's a non-empty text selection inside the editable element */
  const hasLiveSelection = (): boolean => {
    if (!isEditing || !editRef.current) return false;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return false;
    // Must be within the editable region
    const range = sel.getRangeAt(0);
    return editRef.current.contains(range.commonAncestorContainer);
  };

  const applyColor = (hex: string) => {
    if (hasLiveSelection()) {
      // Color only the highlighted run
      try {
        document.execCommand("styleWithCSS", false, "true");
        document.execCommand("foreColor", false, hex);
        // Persist updated HTML so it survives blur — innerHTML is read elsewhere via innerText,
        // so we also store it on the element so re-renders keep the run color via inline spans.
        // (We keep it lightweight: rely on browser-injected <span style="color:.."> tags inside
        //  the contentEditable; on blur the parent commits innerText only, but the span colors
        //  remain visible during the editing session. For full persistence the user can apply
        //  the color to the entire element by clicking the swatch with no selection.)
      } catch {
        updateElement(slideId, element.id, { color: hex });
      }
    } else {
      // Recolor the whole element
      updateElement(slideId, element.id, { color: hex });
    }
  };

  const toggleBold = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const currentWeight = element.fontWeight;
    const isBold = currentWeight === "bold" || (typeof currentWeight === "number" && currentWeight >= 600);
    updateElement(slideId, element.id, { fontWeight: isBold ? "normal" : "bold" } as Partial<SlideElement>);
  };

  const toggleItalic = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const isItalic = element.fontStyle === "italic";
    updateElement(slideId, element.id, { fontStyle: isItalic ? "normal" : "italic" } as Partial<SlideElement>);
  };

  const isBold = element.fontWeight === "bold" || (typeof element.fontWeight === "number" && element.fontWeight >= 600);
  const isItalic = element.fontStyle === "italic";

  // Stop the toolbar from triggering element drag / blur
  const stop = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      onMouseDown={stop}
      onPointerDown={stop}
      onClick={(e) => e.stopPropagation()}
      className="absolute -top-12 left-0 z-40 flex items-center gap-1 rounded-lg bg-zinc-900/95 px-2 py-1.5 shadow-lg ring-1 ring-amber-500/40 backdrop-blur"
      style={{ pointerEvents: "auto" }}
      data-testid="floating-text-toolbar"
    >
      {/* Bold */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={toggleBold}
        title="Bold"
        data-testid="toolbar-bold"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded text-white hover:bg-zinc-700 transition-colors",
          isBold && "bg-amber-500 text-zinc-900 hover:bg-amber-400"
        )}
      >
        <Bold className="h-3.5 w-3.5" />
      </button>

      {/* Italic */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={toggleItalic}
        title="Italic"
        data-testid="toolbar-italic"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded text-white hover:bg-zinc-700 transition-colors",
          isItalic && "bg-amber-500 text-zinc-900 hover:bg-amber-400"
        )}
      >
        <Italic className="h-3.5 w-3.5" />
      </button>

      <div className="h-5 w-px bg-zinc-700 mx-1" />

      {/* FCTG Brand swatches */}
      <span className="text-[10px] font-semibold text-amber-400/80 mr-1 select-none">FCTG</span>
      {fctgSwatches.map((sw) => (
        <button
          key={sw.hex}
          type="button"
          onMouseDown={stop}
          onClick={(e) => {
            e.stopPropagation();
            applyColor(sw.hex);
          }}
          title={`${sw.name} (${sw.hex})`}
          data-testid={`toolbar-swatch-${sw.hex}`}
          className="h-6 w-6 rounded-full ring-1 ring-white/20 hover:ring-2 hover:ring-amber-400 transition-all"
          style={{ backgroundColor: sw.hex }}
        />
      ))}

      <div className="h-5 w-px bg-zinc-700 mx-1" />

      {/* Native color picker */}
      <label
        title="Custom color"
        className="flex h-7 items-center gap-1 rounded bg-zinc-800 px-2 text-xs text-white hover:bg-zinc-700 cursor-pointer"
        onMouseDown={stop}
      >
        <Pipette className="h-3.5 w-3.5" />
        <input
          type="color"
          defaultValue={element.color || "#FDFBF7"}
          onChange={(e) => applyColor(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          className="h-4 w-5 cursor-pointer border-0 bg-transparent p-0"
          data-testid="toolbar-color-picker"
        />
      </label>
    </div>
  );
}

// ─── ElementRenderer ──────────────────────────────────────────────────────────
function ElementRenderer({
  element,
  slideId,
  store,
  isSlideSelected,
  previewMode,
  slideScale,
  onContextMenu,
}: {
  element: SlideElement;
  slideId: string;
  store: SlideRendererProps["store"];
  isSlideSelected: boolean;
  previewMode?: boolean;
  slideScale: number;
  onContextMenu: (e: React.MouseEvent, elementId: string) => void;
}) {
  const { selectedElementId, setSelectedElementId, updateElement, updateElementSilent, pushSnapshot } = store;
  const isSelected = selectedElementId === element.id && isSlideSelected;
  const editRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // ── Drag state ──
  const dragState = useRef<{
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
    active: boolean;
  } | null>(null);

  // ── Resize state ──
  const resizeState = useRef<{
    handle: ResizeHandle;
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

  // ── Drag handlers ──
  // We don't initiate a drag while the user is editing text — their mouse moves
  // need to stay with the native text-selection caret. Drag also only kicks in
  // after the cursor moves past a small threshold so a true "click" never
  // accidentally starts a drag (which used to swallow caret placement).
  const DRAG_THRESHOLD = 4; // px in screen space
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (previewMode) return;
    if (e.button !== 0) return;
    if (isEditing) return; // let the contentEditable handle the cursor / selection
    e.stopPropagation();

    setSelectedElementId(element.id);

    dragState.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: element.x,
      startY: element.y,
      active: false,
    };

    let snapshotted = false;

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragState.current) return;
      const dxScreen = ev.clientX - dragState.current.startMouseX;
      const dyScreen = ev.clientY - dragState.current.startMouseY;
      // Wait until the user has actually moved before snapshotting & starting drag
      if (!dragState.current.active) {
        if (Math.abs(dxScreen) < DRAG_THRESHOLD && Math.abs(dyScreen) < DRAG_THRESHOLD) return;
        if (!snapshotted) {
          pushSnapshot();
          snapshotted = true;
        }
        dragState.current.active = true;
        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
      }
      const dx = dxScreen / slideScale;
      const dy = dyScreen / slideScale;
      updateElementSilent(slideId, element.id, {
        x: dragState.current.startX + dx,
        y: dragState.current.startY + dy,
      });
    };

    const onMouseUp = () => {
      if (dragState.current) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        dragState.current = null;
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [element.id, element.x, element.y, previewMode, pushSnapshot, setSelectedElementId, slideId, slideScale, updateElementSilent]);

  // ── Resize handlers ──
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: ResizeHandle) => {
    if (previewMode) return;
    e.stopPropagation();
    e.preventDefault();

    pushSnapshot();

    resizeState.current = {
      handle,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: element.x,
      startY: element.y,
      startW: element.width,
      startH: element.height ?? 0,
    };

    document.body.style.cursor = HANDLE_CURSORS[handle];
    document.body.style.userSelect = "none";

    const onMouseMove = (ev: MouseEvent) => {
      if (!resizeState.current) return;
      const { handle, startMouseX, startMouseY, startX, startY, startW, startH } = resizeState.current;
      const dx = (ev.clientX - startMouseX) / slideScale;
      const dy = (ev.clientY - startMouseY) / slideScale;

      let newX = startX;
      let newY = startY;
      let newW = startW;
      let newH = startH;

      // Horizontal
      if (handle === "e" || handle === "ne" || handle === "se") {
        newW = Math.max(20, startW + dx);
      } else if (handle === "w" || handle === "nw" || handle === "sw") {
        const delta = Math.min(dx, startW - 20);
        newX = startX + delta;
        newW = startW - delta;
      }

      // Vertical
      if (handle === "s" || handle === "se" || handle === "sw") {
        newH = Math.max(20, startH + dy);
      } else if (handle === "n" || handle === "ne" || handle === "nw") {
        const delta = Math.min(dy, startH - 20);
        newY = startY + delta;
        newH = startH - delta;
      }

      updateElementSilent(slideId, element.id, {
        x: newX,
        y: newY,
        width: newW,
        height: newH,
      });
    };

    const onMouseUp = () => {
      if (resizeState.current) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        resizeState.current = null;
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [element.id, element.x, element.y, element.width, element.height, previewMode, pushSnapshot, slideId, slideScale, updateElementSilent]);

  // ── Editing ──
  // Text-like element types are click-to-edit. Shapes / images / dividers
  // remain select-only (no inline content).
  const isTextLike =
    element.type === "heading" ||
    element.type === "subtitle" ||
    element.type === "body" ||
    element.type === "cta";

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isTextLike) return;
    setIsEditing(true);
    setSelectedElementId(element.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    // If a drag was just performed, suppress the synthetic click so we don't
    // accidentally enter edit mode after dragging.
    if (dragState.current?.active) {
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    // First click selects; second click on an already-selected text element
    // enters edit mode. This matches Canva / Figma / Keynote behavior.
    if (isTextLike && isSelected && !isEditing) {
      setIsEditing(true);
      return;
    }
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
      const range = document.createRange();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  if (!element.visible) return null;

  // ── Resize handles ──
  const ResizeHandles = () => {
    if (!isSelected || previewMode) return null;
    const handles: { id: ResizeHandle; style: React.CSSProperties }[] = [
      { id: "nw", style: { top: -4, left: -4, cursor: "nw-resize" } },
      { id: "n",  style: { top: -4, left: "50%", transform: "translateX(-50%)", cursor: "n-resize" } },
      { id: "ne", style: { top: -4, right: -4, cursor: "ne-resize" } },
      { id: "w",  style: { top: "50%", left: -4, transform: "translateY(-50%)", cursor: "w-resize" } },
      { id: "e",  style: { top: "50%", right: -4, transform: "translateY(-50%)", cursor: "e-resize" } },
      { id: "sw", style: { bottom: -4, left: -4, cursor: "sw-resize" } },
      { id: "s",  style: { bottom: -4, left: "50%", transform: "translateX(-50%)", cursor: "s-resize" } },
      { id: "se", style: { bottom: -4, right: -4, cursor: "se-resize" } },
    ];
    return (
      <>
        {handles.map(({ id, style }) => (
          <div
            key={id}
            data-resize-handle="true"
            onMouseDown={(e) => handleResizeMouseDown(e, id)}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              backgroundColor: "#D4A537",
              border: "1.5px solid #fff",
              borderRadius: 1,
              zIndex: 9999,
              ...style,
            }}
          />
        ))}
      </>
    );
  };

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    opacity: element.opacity ?? 1,
  };

  // ── Divider element ──
  if (element.type === "divider") {
    return (
      <div
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => onContextMenu(e, element.id)}
        style={{
          ...baseStyle,
          height: 2,
          backgroundColor: element.color || "rgba(255,255,255,0.2)",
        }}
        className={cn(
          "cursor-grab",
          isSelected && "ring-2 ring-blue-500"
        )}
        data-testid={`element-${element.id}`}
      >
        <ResizeHandles />
      </div>
    );
  }

  // ── Image placeholder element — supports both image and video uploads ──
  if (element.type === "image") {
    const hasVideo = element.videoSrc;
    const hasImage = element.src;

    const handleMediaUpload = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasImage || hasVideo) {
        setSelectedElementId(element.id);
        return;
      }
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*,video/mp4,video/quicktime,video/webm";
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        if (file.type.startsWith("video/")) {
          updateElement(slideId, element.id, { videoSrc: url, src: undefined } as any);
        } else {
          updateElement(slideId, element.id, { src: url, videoSrc: undefined } as any);
        }
      };
      input.click();
    };

    return (
      <div
        onClick={handleMediaUpload}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => onContextMenu(e, element.id)}
        style={{
          ...baseStyle,
          height: element.height,
          borderRadius: element.borderRadius || 12,
          overflow: "hidden",
        }}
        className={cn(
          "cursor-grab transition-shadow",
          isSelected && "ring-2 ring-blue-500"
        )}
        data-testid={`element-${element.id}`}
      >
        {hasVideo ? (
          <video
            src={element.videoSrc}
            muted={!previewMode}
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ borderRadius: element.borderRadius || 12 }}
          />
        ) : hasImage ? (
          <img
            src={element.src}
            alt=""
            className="w-full h-full object-cover"
            style={{ borderRadius: element.borderRadius || 12 }}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed"
            style={{
              borderColor: "#E85D4A",
              backgroundColor: "transparent",
              borderRadius: element.borderRadius || 12,
            }}
          >
            <div className="flex items-center gap-2">
              <ImagePlus className="w-5 h-5" style={{ color: "#E85D4A" }} />
              <Film className="w-5 h-5" style={{ color: "#6366F1" }} />
            </div>
            <span className="text-base font-medium" style={{ color: "#E85D4A" }}>
              {element.placeholder || "Click to add image or video"}
            </span>
            <span className="text-xs" style={{ color: "#E85D4A", opacity: 0.6 }}>
              Supports PNG, JPG, MP4, MOV, WebM
            </span>
          </div>
        )}
        <ResizeHandles />
      </div>
    );
  }

  // ── Video element ──
  if (element.type === "video") {
    return (
      <div
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => onContextMenu(e, element.id)}
        style={{
          ...baseStyle,
          height: element.height,
          borderRadius: element.borderRadius || 12,
          overflow: "hidden",
        }}
        className={cn(
          "cursor-grab transition-shadow",
          isSelected && "ring-2 ring-blue-500"
        )}
        data-testid={`element-${element.id}`}
      >
        {element.videoSrc ? (
          <video
            src={element.videoSrc}
            poster={element.videoThumbnail}
            muted={previewMode ? false : element.videoMuted !== false}
            loop={element.videoLoop !== false}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ borderRadius: element.borderRadius || 12 }}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed"
            style={{
              borderColor: "#6366F1",
              backgroundColor: "transparent",
              borderRadius: element.borderRadius || 12,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span className="text-base font-medium" style={{ color: "#6366F1" }}>
              {element.placeholder || "Click to add video"}
            </span>
          </div>
        )}
        <ResizeHandles />
      </div>
    );
  }

  // ── Logo element ──
  if (element.type === "logo") {
    const hasLogo = element.logoSrc;

    const handleLogoUpload = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasLogo) {
        setSelectedElementId(element.id);
        return;
      }
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/png,image/svg+xml,image/jpeg,image/webp";
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          updateElement(slideId, element.id, { logoSrc: ev.target?.result as string });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    };

    return (
      <div
        onClick={handleLogoUpload}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => onContextMenu(e, element.id)}
        style={{
          ...baseStyle,
          height: element.height,
          borderRadius: element.borderRadius || 0,
          overflow: "hidden",
        }}
        className={cn(
          "cursor-grab transition-shadow",
          isSelected && "ring-2 ring-blue-500"
        )}
        data-testid={`element-${element.id}`}
      >
        {hasLogo ? (
          <img
            src={element.logoSrc}
            alt="Logo"
            className="w-full h-full"
            style={{ objectFit: element.logoFit || "contain" }}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed"
            style={{
              borderColor: "#D4A537",
              backgroundColor: "transparent",
              borderRadius: element.borderRadius || 0,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4A537" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <circle cx="8" cy="10" r="2" />
              <path d="M14 3l-4 7h8l-4-7z" />
            </svg>
            <span className="text-xs font-medium" style={{ color: "#D4A537" }}>
              Click to add logo
            </span>
          </div>
        )}
        <ResizeHandles />
      </div>
    );
  }

  // ── Shape element ──
  if (element.type === "shape") {
    return (
      <div
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => onContextMenu(e, element.id)}
        style={{
          ...baseStyle,
          height: element.height,
          backgroundColor: element.backgroundColor,
          borderRadius: element.borderRadius,
        }}
        className={cn(
          "cursor-grab transition-shadow",
          isSelected && "ring-2 ring-blue-500 ring-offset-2"
        )}
        data-testid={`element-${element.id}`}
      >
        <ResizeHandles />
      </div>
    );
  }

  // ── Slide number element ──
  if (element.type === "slideNumber") {
    return (
      <div
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => onContextMenu(e, element.id)}
        style={{
          ...baseStyle,
          height: element.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: element.fontSize,
          fontFamily: element.fontFamily,
          fontWeight: element.fontWeight as any,
          color: element.color,
          backgroundColor: element.backgroundColor,
          borderRadius: element.borderRadius,
        }}
        className={cn(
          "cursor-grab transition-shadow",
          isSelected && "ring-2 ring-blue-500"
        )}
        data-testid={`element-${element.id}`}
      >
        {element.content}
        <ResizeHandles />
      </div>
    );
  }

  // ── Text-based elements (subtitle, heading, body, cta) ──
  const textStyle: React.CSSProperties = {
    ...baseStyle,
    height: element.type === "cta" ? element.height : "auto",
    minHeight: element.height,
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    fontWeight: element.fontWeight as any,
    fontStyle: element.fontStyle || "normal",
    textAlign: element.textAlign,
    color: element.color,
    lineHeight: element.lineHeight || 1.4,
    letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined,
    textTransform: element.textTransform,
    textShadow: element.textShadow || undefined,
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
      className={cn(
        "group/element transition-shadow relative",
        isEditing ? "cursor-text" : "cursor-grab",
        !isEditing && "select-none",
        isSelected && "ring-2 ring-blue-500",
        isEditing && "ring-2 ring-blue-400"
      )}
      style={textStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => onContextMenu(e, element.id)}
      data-testid={`element-${element.id}`}
    >
      {/* Floating inline text toolbar — color swatches, picker, bold/italic */}
      {isSelected && !previewMode && (
        <FloatingTextToolbar
          element={element}
          slideId={slideId}
          updateElement={updateElement}
          editRef={editRef}
          isEditing={isEditing}
        />
      )}
      {/* Drag handle (PostNitro style :: dots) — always visible when slide selected */}
      {isSlideSelected && (
        <div
          className="absolute -left-6 top-0 opacity-40 hover:opacity-70 transition-opacity cursor-grab"
          style={{ color: element.color || "#fff" }}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {isEditing ? (
        <div
          ref={editRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleBlur();
          }}
          className="outline-none w-full"
          style={{
            fontSize: "inherit",
            fontFamily: "inherit",
            fontWeight: "inherit",
            fontStyle: "inherit",
            textAlign: "inherit",
            color: "inherit",
            lineHeight: "inherit",
            textShadow: "inherit",
          }}
        >
          {element.content}
        </div>
      ) : element.type === "heading" && element.accentColor ? (
        <AccentText
          content={element.content || ""}
          accentColor={element.accentColor}
          baseColor={element.color}
        />
      ) : (
        <span>{element.content}</span>
      )}

      <ResizeHandles />
    </div>
  );
}

// ─── Context Menu ─────────────────────────────────────────────────────────────
function ContextMenu({
  menu,
  slideId,
  store,
  onClose,
  slideElements,
}: {
  menu: ContextMenuState;
  slideId: string;
  store: SlideRendererProps["store"];
  onClose: () => void;
  slideElements: SlideElement[];
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const actions = [
    {
      label: "Bring to Front",
      action: () => { store.moveElementLayer(slideId, menu.elementId, "top"); onClose(); },
    },
    {
      label: "Bring Forward",
      action: () => { store.moveElementLayer(slideId, menu.elementId, "up"); onClose(); },
    },
    {
      label: "Send Backward",
      action: () => { store.moveElementLayer(slideId, menu.elementId, "down"); onClose(); },
    },
    {
      label: "Send to Back",
      action: () => { store.moveElementLayer(slideId, menu.elementId, "bottom"); onClose(); },
    },
    { separator: true },
    {
      label: "Duplicate",
      action: () => {
        const el = slideElements.find((e) => e.id === menu.elementId);
        if (el) {
          const newEl: SlideElement = {
            ...el,
            id: crypto.randomUUID(),
            x: el.x + 20,
            y: el.y + 20,
          };
          store.addElement(slideId, newEl);
        }
        onClose();
      },
    },
    {
      label: "Delete",
      action: () => { store.removeElement(slideId, menu.elementId); onClose(); },
      danger: true,
    },
  ] as Array<{ label?: string; action?: () => void; danger?: boolean; separator?: boolean }>;

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: menu.y,
        left: menu.x,
        zIndex: 99999,
        minWidth: 180,
        backgroundColor: "#2D2E30",
        border: "1px solid #4A4B4D",
        borderRadius: 6,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
        {actions.map((item, i) =>
          item.separator ? (
            <div key={i} style={{ height: 1, backgroundColor: "#4A4B4D", margin: "2px 0" }} />
          ) : (
            <button
              key={i}
              onClick={item.action}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "7px 14px",
                fontSize: 13,
                fontFamily: "inherit",
                color: item.danger ? "#FF6B6B" : "#E2DDD5",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3A3B3D";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              {item.label}
            </button>
          )
        )}
    </div>,
    document.body
  );
}

// ─── SlideRenderer ────────────────────────────────────────────────────────────
export function SlideRenderer({ slide, project, store, slideIndex, isSelected, previewMode }: SlideRendererProps) {
  const { globalStyles } = project;
  const bgPattern =
    slide.backgroundPattern && slide.backgroundPattern !== "none"
      ? getPatternSVG(slide.backgroundPattern, slide.patternOpacity || 10)
      : "none";

  const containerRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Calculate the actual rendered scale of the slide (for accurate drag/resize)
  const [slideScale, setSlideScale] = useState(1);
  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // project.width is the "design" width; rect.width is the rendered width
      setSlideScale(rect.width / project.width);
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [project.width]);

  const handleContextMenu = useCallback((e: React.MouseEvent, elementId: string) => {
    if (previewMode) return;
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, elementId });
  }, [previewMode]);

  return (
    <div
      ref={containerRef}
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
          style={{ backgroundImage: bgPattern, backgroundRepeat: "repeat" }}
        />
      )}

      {/* Background image */}
      {slide.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.backgroundImage})` }}
        />
      )}

      {/* Background image overlay (semi-transparent image over the background color) */}
      {slide.backgroundOverlayImage && (
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url(${slide.backgroundOverlayImage})`,
            opacity: (slide.backgroundOverlayOpacity ?? 40) / 100,
          }}
        />
      )}

      {/* Branding bar — top area (PostNitro style) */}
      {globalStyles.brandingEnabled && (
        <div className="absolute top-8 left-10 right-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0"
            style={{ backgroundColor: globalStyles.brandColor, color: slide.backgroundColor }}
          >
            {globalStyles.brandName?.charAt(0) || "F"}
          </div>
          <div className="flex flex-col">
            <span
              className="text-base font-semibold leading-tight"
              style={{ color: globalStyles.colorPalette[3] || "#fff" }}
            >
              {globalStyles.brandName}
            </span>
            {globalStyles.brandHandle && (
              <span
                className="text-sm opacity-60"
                style={{ color: globalStyles.colorPalette[2] || "#ccc" }}
              >
                {globalStyles.brandHandle}
              </span>
            )}
          </div>
          {/* Divider line below brand */}
          <div className="absolute -bottom-4 left-0 right-0 h-px" style={{ backgroundColor: `${globalStyles.colorPalette[2] || "#fff"}22` }} />
        </div>
      )}

      {/* Comparison layout — swap the elements array for a dedicated component */}
      {slide.layout === "comparison" ? (
        <ComparisonSlide
          slide={slide}
          designWidth={project.width}
          designHeight={project.height}
          focusTarget={(slide as any).__comparisonFocus ?? null}
        />
      ) : (
        /* Slide elements — rendered in array order (first = back, last = front) */
        slide.elements
          .filter((el) => el.visible !== false)
          .map((element) => (
            <ElementRenderer
              key={element.id}
              element={element}
              slideId={slide.id}
              store={store}
              isSlideSelected={isSelected}
              previewMode={previewMode}
              slideScale={slideScale}
              onContextMenu={handleContextMenu}
            />
          ))
      )}

      {/* Slide number badge (for content slides using global style) */}
      {globalStyles.slideNumberEnabled && slide.slideType === "content" && (
        <div
          className="absolute top-8 right-10 flex items-center justify-center rounded-full font-bold"
          style={{
            width: 48,
            height: 48,
            fontSize: 20,
            backgroundColor: globalStyles.colorPalette[1] || "#D4A537",
            color: globalStyles.colorPalette[3] || "#fff",
          }}
        >
          {globalStyles.slideNumberStyle === "padded"
            ? String(slideIndex).padStart(2, "0")
            : globalStyles.slideNumberStyle === "hash"
              ? `#${slideIndex}`
              : String(slideIndex)}
        </div>
      )}

      {/* Swipe indicator / CTA button at bottom */}
      {globalStyles.swipeIndicatorEnabled && slide.slideType === "intro" && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-base"
            style={{
              backgroundColor: globalStyles.colorPalette[2] || "#fff",
              color: globalStyles.colorPalette[0] || "#000",
            }}
          >
            {globalStyles.swipeText || "Discover"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Bottom branding bar for non-intro slides */}
      {globalStyles.brandingEnabled && slide.slideType !== "intro" && (
        <div className="absolute bottom-6 left-10 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ backgroundColor: globalStyles.brandColor, color: slide.backgroundColor }}
          >
            {globalStyles.brandName?.charAt(0) || "F"}
          </div>
          <div className="flex flex-col">
            <span
              className="text-sm font-semibold leading-tight"
              style={{ color: globalStyles.colorPalette[3] || "#fff" }}
            >
              {globalStyles.brandName}
            </span>
            {globalStyles.brandHandle && (
              <span
                className="text-xs opacity-60"
                style={{ color: globalStyles.colorPalette[2] || "#ccc" }}
              >
                {globalStyles.brandHandle}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Context menu portal */}
      {contextMenu && (
        <ContextMenu
          menu={contextMenu}
          slideId={slide.id}
          store={store}
          onClose={() => setContextMenu(null)}
          slideElements={slide.elements}
        />
      )}
    </div>
  );
}
