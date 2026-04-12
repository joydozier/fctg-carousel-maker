import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Slide, SlideElement } from "@/lib/types";

interface ImportPanelProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

export function ImportPanel({ store }: ImportPanelProps) {
  const [textContent, setTextContent] = useState("");
  const { toast } = useToast();
  const { project, updateProject } = store;

  const importFromText = () => {
    if (!textContent.trim()) return;

    // Split by double newlines or --- to create slides
    const sections = textContent.split(/\n\n+|---/).filter(s => s.trim());
    const palette = project.globalStyles.colorPalette;

    const newSlides: Slide[] = sections.map((section, i) => {
      const lines = section.trim().split("\n");
      const heading = lines[0] || `Slide ${i + 1}`;
      const body = lines.slice(1).join("\n").trim();

      const elements: SlideElement[] = [
        {
          id: crypto.randomUUID(),
          type: "heading",
          x: 80, y: 250,
          width: 920, height: 120,
          rotation: 0,
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
          x: 80, y: 400,
          width: 920, height: 300,
          rotation: 0,
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
        backgroundColor: palette[0] || "#1a1a2e",
        elements,
        layout: "default" as const,
        backgroundPattern: "none" as const,
        patternOpacity: 10,
      };
    });

    if (newSlides.length > 0) {
      updateProject({ slides: newSlides });
      toast({ title: "Imported", description: `${newSlides.length} slides created from text` });
      setTextContent("");
    }
  };

  return (
    <div className="space-y-5" data-testid="import-panel">
      <h3 className="text-sm font-semibold">Import Content</h3>

      <Tabs defaultValue="text">
        <TabsList className="w-full">
          <TabsTrigger value="text" className="flex-1 text-xs">Text</TabsTrigger>
          <TabsTrigger value="csv" className="flex-1 text-xs">CSV</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-3 mt-4">
          <Label className="text-xs text-muted-foreground">
            Paste content below. Separate slides with blank lines or ---
          </Label>
          <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder={"Slide 1 Title\nSlide 1 body text\n\nSlide 2 Title\nSlide 2 body text\n\n---\n\nSlide 3 Title\nMore content here"}
            className="min-h-[200px] text-xs"
            data-testid="import-text-area"
          />
          <Button
            onClick={importFromText}
            className="w-full"
            size="sm"
            disabled={!textContent.trim()}
            data-testid="import-text-button"
          >
            Import as Slides
          </Button>
        </TabsContent>

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
                const rows = text.split("\n").slice(1).filter(r => r.trim());
                const palette = project.globalStyles.colorPalette;

                const slides: Slide[] = rows.map((row, i) => {
                  const cols = row.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
                  return {
                    id: crypto.randomUUID(),
                    order: i,
                    backgroundColor: palette[0],
                    elements: [
                      {
                        id: crypto.randomUUID(),
                        type: "heading" as const,
                        x: 80, y: 250, width: 920, height: 120, rotation: 0,
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
                        content: cols[1] || "",
                        fontSize: project.globalStyles.bodyFontSize,
                        fontFamily: project.globalStyles.bodyFont,
                        fontWeight: "400",
                        textAlign: "center" as const,
                        color: palette[2] || "#cccccc",
                        lineHeight: 1.6,
                      },
                    ],
                    layout: "default" as const,
                    backgroundPattern: "none" as const,
                    patternOpacity: 10,
                  };
                });

                if (slides.length > 0) {
                  updateProject({ slides });
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
      </Tabs>
    </div>
  );
}
