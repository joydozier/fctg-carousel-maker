import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Slide, SlideElement } from "@/lib/types";

interface ImportPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

const EXAMPLE_TEXT = `[starting_slide]
sub_heading: My Awesome Subtitle
heading: Welcome to the Carousel!
description: This is how you start with a bang.
cta_button: Swipe to learn more
background_image: https://example.com/background1.jpg

[body_slide_1]
heading: Section 1: The Core Idea
description: Explain your first key point here.
image: https://example.com/image1.jpg

...

[ending_slide]
sub_heading: Ready to Act?
heading: Get Started Today!
cta_button: Visit Our Website
image: https://example.com/logo.png
background_image: https://example.com/background2.jpg`;

export function ImportPanel({ store }: ImportPanelProps) {
  const [textContent, setTextContent] = useState("");
  const [xPostUrl, setXPostUrl] = useState("");
  const { toast } = useToast();
  const { project, updateProject } = store;

  /** Parse structured [slide_type] format like PostNitro */
  const parseStructuredText = (text: string): Slide[] => {
    const palette = project.globalStyles.colorPalette;
    const blocks = text.split(/\[([^\]]+)\]/).filter((s) => s.trim());
    const slides: Slide[] = [];

    for (let i = 0; i < blocks.length; i += 2) {
      const slideType = blocks[i]?.trim().toLowerCase() || "";
      const content = blocks[i + 1] || "";

      const fields: Record<string, string> = {};
      content.split("\n").forEach((line) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx > 0) {
          const key = line.substring(0, colonIdx).trim();
          const val = line.substring(colonIdx + 1).trim();
          if (key && val) fields[key] = val;
        }
      });

      const isIntro = slideType.includes("starting") || slideType.includes("intro");
      const isOutro = slideType.includes("ending") || slideType.includes("outro");
      const type = isIntro ? "intro" : isOutro ? "outro" : "content";

      const elements: SlideElement[] = [];

      if (fields.sub_heading) {
        elements.push({
          id: crypto.randomUUID(),
          type: "subtitle",
          visible: true,
          x: 80, y: 280, width: 920, height: 40, rotation: 0,
          content: fields.sub_heading,
          fontSize: 20,
          fontFamily: project.globalStyles.bodyFont,
          fontWeight: "400",
          textAlign: "left",
          color: palette[2] || "#ccc",
          lineHeight: 1.4,
        });
      }

      if (fields.heading) {
        elements.push({
          id: crypto.randomUUID(),
          type: "heading",
          visible: true,
          x: 80, y: fields.sub_heading ? 330 : 280, width: 920, height: 120, rotation: 0,
          content: fields.heading,
          fontSize: project.globalStyles.headingFontSize,
          fontFamily: project.globalStyles.headingFont,
          fontWeight: "700",
          textAlign: type === "content" ? "center" : "left",
          color: palette[3] || "#fff",
          accentColor: palette[1],
          lineHeight: 1.2,
        });
      }

      if (fields.description) {
        elements.push({
          id: crypto.randomUUID(),
          type: "body",
          visible: true,
          x: 80, y: elements.length > 1 ? 470 : 420, width: 920, height: 80, rotation: 0,
          content: fields.description,
          fontSize: project.globalStyles.bodyFontSize,
          fontFamily: project.globalStyles.bodyFont,
          fontWeight: "400",
          textAlign: type === "content" ? "center" : "left",
          color: palette[2] || "#ccc",
          lineHeight: 1.5,
        });
      }

      if (fields.cta_button) {
        elements.push({
          id: crypto.randomUUID(),
          type: "cta",
          visible: true,
          x: 80, y: 560, width: 220, height: 52, rotation: 0,
          content: fields.cta_button,
          fontSize: 18,
          fontFamily: project.globalStyles.bodyFont,
          fontWeight: "600",
          textAlign: "center",
          color: palette[0],
          backgroundColor: palette[2],
          borderRadius: 8,
          padding: 14,
        });
      }

      if (fields.image) {
        elements.push({
          id: crypto.randomUUID(),
          type: "image",
          visible: true,
          x: 140, y: 560, width: 800, height: 280, rotation: 0,
          src: fields.image,
          borderRadius: 12,
          opacity: 1,
        });
      }

      slides.push({
        id: crypto.randomUUID(),
        order: slides.length,
        slideType: type,
        layout: "default",
        backgroundColor: palette[0] || "#1a1a2e",
        backgroundImage: fields.background_image || undefined,
        elements,
        backgroundPattern: "none",
        patternOpacity: 10,
        showSubtitle: !!fields.sub_heading,
        showTitle: !!fields.heading,
        showDescription: !!fields.description,
        showImage: !!fields.image,
        showCta: !!fields.cta_button,
      });
    }

    return slides;
  };

  /** Simple text import (split by blank lines) */
  const importFromText = () => {
    if (!textContent.trim()) return;

    // Try structured format first
    if (textContent.includes("[") && textContent.includes("]")) {
      const slides = parseStructuredText(textContent);
      if (slides.length > 0) {
        updateProject({ slides, slideCount: slides.length });
        toast({ title: "Imported", description: `${slides.length} slides created from structured text` });
        setTextContent("");
        return;
      }
    }

    // Fallback: simple split by blank lines
    const sections = textContent.split(/\n\n+|---/).filter((s) => s.trim());
    const palette = project.globalStyles.colorPalette;

    const newSlides: Slide[] = sections.map((section, i) => {
      const lines = section.trim().split("\n");
      const heading = lines[0] || `Slide ${i + 1}`;
      const body = lines.slice(1).join("\n").trim();

      const elements: SlideElement[] = [
        {
          id: crypto.randomUUID(),
          type: "heading",
          visible: true,
          x: 80, y: 250, width: 920, height: 120, rotation: 0,
          content: heading,
          fontSize: project.globalStyles.headingFontSize,
          fontFamily: project.globalStyles.headingFont,
          fontWeight: "700",
          textAlign: "center",
          color: palette[3] || "#ffffff",
          lineHeight: 1.2,
        },
      ];

      if (body) {
        elements.push({
          id: crypto.randomUUID(),
          type: "body",
          visible: true,
          x: 80, y: 400, width: 920, height: 300, rotation: 0,
          content: body,
          fontSize: project.globalStyles.bodyFontSize,
          fontFamily: project.globalStyles.bodyFont,
          fontWeight: "400",
          textAlign: "center",
          color: palette[2] || "#cccccc",
          lineHeight: 1.6,
        });
      }

      return {
        id: crypto.randomUUID(),
        order: i,
        slideType: (i === 0 ? "intro" : i === sections.length - 1 ? "outro" : "content") as any,
        layout: "default" as const,
        backgroundColor: palette[0] || "#1a1a2e",
        elements,
        backgroundPattern: "none" as const,
        patternOpacity: 10,
        showSubtitle: i === 0,
        showTitle: true,
        showDescription: true,
        showImage: false,
        showCta: i === sections.length - 1,
      };
    });

    if (newSlides.length > 0) {
      updateProject({ slides: newSlides, slideCount: newSlides.length });
      toast({ title: "Imported", description: `${newSlides.length} slides created from text` });
      setTextContent("");
    }
  };

  return (
    <div className="space-y-4" data-testid="import-panel">
      <Tabs defaultValue="text">
        <TabsList className="w-full">
          <TabsTrigger value="text" className="flex-1 text-xs" data-testid="import-tab-text">
            Text
          </TabsTrigger>
          <TabsTrigger value="csv" className="flex-1 text-xs" data-testid="import-tab-csv">
            CSV
          </TabsTrigger>
          <TabsTrigger value="xpost" className="flex-1 text-xs" data-testid="import-tab-xpost">
            <span className="flex items-center gap-1">
              X Post
              <span className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-[#D4A537]/10 text-[#D4A537] text-[8px] font-bold leading-none">
                <span className="w-1 h-1 rounded-full bg-[#D4A537]" />
                NEW
              </span>
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Text Tab */}
        <TabsContent value="text" className="space-y-3 mt-4">
          <Label className="text-xs text-muted-foreground">Paste your design content here.</Label>
          <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder={EXAMPLE_TEXT}
            className="min-h-[260px] text-xs font-mono leading-relaxed"
            data-testid="import-text-area"
          />
          <Button
            onClick={importFromText}
            className="w-full gap-2 bg-[#D4A537] hover:bg-[#C49A3C] text-white"
            size="sm"
            disabled={!textContent.trim()}
            data-testid="import-text-button"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Import Content From Text
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            For more details{" "}
            <span className="text-primary underline cursor-pointer">checkout our help docs</span>.
          </p>
        </TabsContent>

        {/* CSV Tab */}
        <TabsContent value="csv" className="space-y-3 mt-4">
          <Label className="text-xs text-muted-foreground">
            Upload a CSV with columns: heading, body
          </Label>
          <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".csv";
              input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;
                const text = await file.text();
                const rows = text.split("\n").slice(1).filter((r) => r.trim());
                const palette = project.globalStyles.colorPalette;

                const slides: Slide[] = rows.map((row, i) => {
                  const cols = row.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
                  return {
                    id: crypto.randomUUID(),
                    order: i,
                    slideType: (i === 0 ? "intro" : i === rows.length - 1 ? "outro" : "content") as any,
                    layout: "default" as const,
                    backgroundColor: palette[0],
                    elements: [
                      {
                        id: crypto.randomUUID(),
                        type: "heading" as const,
                        x: 80, y: 250, width: 920, height: 120, rotation: 0,
                        visible: true,
                        content: cols[0] || `Slide ${i + 1}`,
                        fontSize: project.globalStyles.headingFontSize,
                        fontFamily: project.globalStyles.headingFont,
                        fontWeight: "700",
                        textAlign: "center" as const,
                        color: palette[3] || "#ffffff",
                        lineHeight: 1.2,
                      },
                      {
                        id: crypto.randomUUID(),
                        type: "body" as const,
                        x: 80, y: 400, width: 920, height: 300, rotation: 0,
                        visible: true,
                        content: cols[1] || "",
                        fontSize: project.globalStyles.bodyFontSize,
                        fontFamily: project.globalStyles.bodyFont,
                        fontWeight: "400",
                        textAlign: "center" as const,
                        color: palette[2] || "#cccccc",
                        lineHeight: 1.6,
                      },
                    ],
                    backgroundPattern: "none" as const,
                    patternOpacity: 10,
                    showSubtitle: i === 0,
                    showTitle: true,
                    showDescription: true,
                    showImage: false,
                    showCta: i === rows.length - 1,
                  };
                });

                if (slides.length > 0) {
                  updateProject({ slides, slideCount: slides.length });
                  toast({ title: "Imported", description: `${slides.length} slides from CSV` });
                }
              };
              input.click();
            }}
            data-testid="import-csv-button"
          >
            Upload CSV
          </Button>
        </TabsContent>

        {/* X Post Tab */}
        <TabsContent value="xpost" className="space-y-3 mt-4">
          <Label className="text-xs text-muted-foreground">
            Paste a link to an X (Twitter) post to import its content as carousel slides.
          </Label>
          <Input
            value={xPostUrl}
            onChange={(e) => setXPostUrl(e.target.value)}
            placeholder="https://x.com/user/status/..."
            className="h-9 text-xs"
            data-testid="xpost-url-input"
          />
          <Button
            className="w-full gap-2 bg-[#D4A537] hover:bg-[#C49A3C] text-white"
            size="sm"
            disabled={!xPostUrl.trim()}
            onClick={() => {
              toast({ title: "Coming soon", description: "X Post import will be available soon" });
            }}
            data-testid="import-xpost-button"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Import from X Post
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
