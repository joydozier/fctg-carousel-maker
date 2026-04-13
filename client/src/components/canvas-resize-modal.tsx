import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLATFORM_SIZES } from "@/lib/types";
import { SiInstagram, SiFacebook, SiTiktok, SiYoutube, SiPinterest } from "react-icons/si";
import { RiTwitterXFill, RiPresentationFill } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";

interface CanvasResizeModalProps {
  currentWidth: number;
  currentHeight: number;
  onSelect: (width: number, height: number) => void;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: FaLinkedin,
  instagram: SiInstagram,
  facebook: SiFacebook,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  pinterest: SiPinterest,
  x: RiTwitterXFill,
  presentation: RiPresentationFill,
};

const ICON_COLORS: Record<string, string> = {
  linkedin: "#0A66C2",
  instagram: "#E4405F",
  facebook: "#1877F2",
  tiktok: "#000000",
  youtube: "#FF0000",
  pinterest: "#E60023",
  x: "#000000",
  presentation: "#F59E0B",
};

export function CanvasResizeModal({ currentWidth, currentHeight, onSelect, onClose }: CanvasResizeModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
      data-testid="canvas-resize-overlay"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[#343536] rounded-2xl shadow-2xl w-[960px] max-w-[94vw] max-h-[90vh] overflow-hidden flex flex-col border border-[#4A4B4D]"
        onClick={(e) => e.stopPropagation()}
        data-testid="canvas-resize-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2b2d]">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-[#E2DDD5]">Resize canvas</h2>
            <span className="px-3 py-1 rounded-full brass-plate text-xs">
              {currentWidth} × {currentHeight}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#464849] transition-colors"
            data-testid="canvas-resize-close"
          >
            <X className="w-5 h-5 text-[#8A8580]" />
          </button>
        </div>

        {/* Grid of canvas options */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-4" data-testid="canvas-size-grid">
            {Object.entries(PLATFORM_SIZES).map(([key, size]) => {
              const isSelected = size.width === currentWidth && size.height === currentHeight;
              // Calculate preview aspect ratio — max 160px wide, max 120px tall
              const maxW = 160;
              const maxH = 120;
              const scale = Math.min(maxW / size.width, maxH / size.height);
              const previewW = size.width * scale;
              const previewH = size.height * scale;

              return (
                <button
                  key={key}
                  onClick={() => onSelect(size.width, size.height)}
                  className={cn(
                    "relative rounded-xl border-2 p-4 transition-all hover:shadow-md text-left",
                    isSelected
                      ? "border-[#D4A537] bg-[#D4A537]/10 shadow-sm"
                      : "border-[#4A4B4D] hover:border-[#B8944F]/50"
                  )}
                  data-testid={`canvas-size-${key}`}
                >
                  {/* Header: icons + label + dimensions */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      {/* Social platform icons */}
                      {size.icons.map((icon) => {
                        const IconComp = ICON_MAP[icon];
                        if (!IconComp) return null;
                        return (
                          <div
                            key={icon}
                            className="w-5 h-5 rounded flex items-center justify-center"
                            style={{ color: ICON_COLORS[icon] }}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                        );
                      })}
                      <span className="text-sm font-medium text-[#E2DDD5] ml-1">
                        {size.label} ({size.ratio})
                      </span>
                    </div>
                    <span className="text-xs text-[#B8944F] font-mono">
                      {size.width} × {size.height}
                    </span>
                  </div>

                  {/* Best for: platform suggestions */}
                  <p className="text-[10px] text-[#8A8580] mb-2 leading-snug">
                    Best for: {size.bestFor}
                  </p>

                  {/* Live preview thumbnail */}
                  <div className="flex items-center justify-center py-2">
                    <div
                      className={cn(
                        "rounded-md border overflow-hidden",
                        isSelected ? "border-[#D4A537]/50" : "border-[#4A4B4D]"
                      )}
                      style={{
                        width: previewW,
                        height: previewH,
                        background: "linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)",
                      }}
                    >
                      {/* Mini slide mockup */}
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                        <div className="w-[60%] h-1.5 rounded-full bg-[#5A5B5D]" />
                        <div
                          className="w-[80%] h-2 rounded-full"
                          style={{
                            background: isSelected
                              ? "linear-gradient(90deg, #D4A537 30%, #433B2B 100%)"
                              : "linear-gradient(90deg, #a1a1aa 30%, #71717a 100%)",
                          }}
                        />
                        <div className="w-[50%] h-1 rounded-full bg-[#5A5B5D]" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
