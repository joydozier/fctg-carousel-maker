import { useState } from "react";
import { HelpCircle } from "lucide-react";

interface HelpTooltipProps {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

/**
 * Small inline help icon that shows a tooltip on hover.
 * Place next to any UI element that might need explanation.
 */
export function HelpTooltip({ text, position = "top", className = "" }: HelpTooltipProps) {
  const [visible, setVisible] = useState(false);

  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses: Record<string, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-[#3A3B3D] border-x-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-[#3A3B3D] border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-[#3A3B3D] border-y-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-[#3A3B3D] border-y-transparent border-l-transparent",
  };

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <HelpCircle className="w-3.5 h-3.5 text-[#8A8580] hover:text-[#D4A537] cursor-help transition-colors" />
      {visible && (
        <span
          className={`absolute z-50 ${positionClasses[position]} px-3 py-2 text-[11px] leading-relaxed text-[#E2DDD5] bg-[#3A3B3D] border border-[#4A4B4D] rounded-lg shadow-xl whitespace-normal max-w-[220px] pointer-events-none`}
          style={{ minWidth: 140 }}
        >
          {text}
          <span
            className={`absolute w-0 h-0 border-[5px] ${arrowClasses[position]}`}
          />
        </span>
      )}
    </span>
  );
}
