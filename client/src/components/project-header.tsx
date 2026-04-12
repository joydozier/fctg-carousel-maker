import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Download, FileDown, FolderOpen, ChevronLeft, Film, Image as ImageIcon } from "lucide-react";
import { PLATFORM_SIZES } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ProjectHeaderProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

export function ProjectHeader({ store }: ProjectHeaderProps) {
  const { project, updateProject, setIsDirty } = store;
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        name: project.name,
        platform: project.platform,
        width: project.width,
        height: project.height,
        slides: JSON.stringify(project.slides),
        globalStyles: JSON.stringify(project.globalStyles),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (project.id) {
        await apiRequest("PATCH", `/api/projects/${project.id}`, body);
      } else {
        const res = await apiRequest("POST", "/api/projects", body);
        const saved = await res.json();
        updateProject({ id: saved.id });
      }
      setIsDirty(false);
      toast({ title: "Saved", description: "Project saved successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to save project", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDownloadLocal = () => {
    const data = JSON.stringify({
      ...project,
      exportedAt: new Date().toISOString(),
    }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "_")}.carousel.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "Project file saved to your computer" });
  };

  const handleLoadLocal = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.carousel.json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        store.loadProject(data);
        toast({ title: "Loaded", description: "Project loaded from file" });
      } catch {
        toast({ title: "Error", description: "Invalid project file", variant: "destructive" });
      }
    };
    input.click();
  };

  const handleExportPNG = async () => {
    const slideElements = document.querySelectorAll("[data-slide-export]");
    if (slideElements.length === 0) {
      toast({ title: "No slides", description: "Nothing to export", variant: "destructive" });
      return;
    }
    toast({ title: "Exporting...", description: "Preparing PNG files" });

    try {
      const { toPng } = await import("html-to-image");
      for (let i = 0; i < slideElements.length; i++) {
        const el = slideElements[i] as HTMLElement;
        const dataUrl = await toPng(el, {
          width: project.width,
          height: project.height,
          pixelRatio: 2,
          style: { transform: "none", borderRadius: "0" },
        });
        const link = document.createElement("a");
        link.download = `${project.name}_slide_${i + 1}.png`;
        link.href = dataUrl;
        link.click();
        await new Promise(r => setTimeout(r, 500));
      }
      toast({ title: "Done", description: `${slideElements.length} slides exported as PNG` });
    } catch (err) {
      console.error("PNG export error:", err);
      toast({ title: "Error", description: "Failed to export PNGs", variant: "destructive" });
    }
  };

  const handleExportMP4 = async () => {
    toast({ title: "Exporting MP4...", description: "Creating video from slides (this may take a moment)" });
    try {
      const { toPng } = await import("html-to-image");
      const slideElements = document.querySelectorAll("[data-slide-export]");
      const frames: string[] = [];

      for (const el of slideElements) {
        const dataUrl = await toPng(el as HTMLElement, {
          width: project.width,
          height: project.height,
          pixelRatio: 1,
          style: { transform: "none", borderRadius: "0" },
        });
        frames.push(dataUrl);
      }

      // Create video using canvas + MediaRecorder
      const canvas = document.createElement("canvas");
      canvas.width = project.width;
      canvas.height = project.height;
      const ctx = canvas.getContext("2d")!;
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      await new Promise<void>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${project.name.replace(/\s+/g, "_")}.webm`;
          a.click();
          URL.revokeObjectURL(url);
          resolve();
        };

        recorder.start();
        let frameIndex = 0;
        const FRAME_DURATION = 3000; // 3 seconds per slide
        const TRANSITION_FRAMES = 15;

        const renderFrame = () => {
          if (frameIndex >= frames.length) {
            setTimeout(() => recorder.stop(), 100);
            return;
          }

          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Hold for duration then move to next
            let held = 0;
            const holdInterval = setInterval(() => {
              held += 33;
              if (held >= FRAME_DURATION) {
                clearInterval(holdInterval);
                frameIndex++;

                // Simple crossfade transition
                if (frameIndex < frames.length) {
                  let transFrame = 0;
                  const nextImg = new Image();
                  nextImg.onload = () => {
                    const transInterval = setInterval(() => {
                      transFrame++;
                      const alpha = transFrame / TRANSITION_FRAMES;
                      ctx.clearRect(0, 0, canvas.width, canvas.height);
                      ctx.globalAlpha = 1 - alpha;
                      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                      ctx.globalAlpha = alpha;
                      ctx.drawImage(nextImg, 0, 0, canvas.width, canvas.height);
                      ctx.globalAlpha = 1;

                      if (transFrame >= TRANSITION_FRAMES) {
                        clearInterval(transInterval);
                        renderFrame();
                      }
                    }, 33);
                  };
                  nextImg.src = frames[frameIndex];
                } else {
                  renderFrame();
                }
              }
            }, 33);
          };
          img.src = frames[frameIndex];
        };
        renderFrame();
      });

      toast({ title: "Done", description: "Video exported as WebM" });
    } catch (err) {
      console.error("MP4 export error:", err);
      toast({ title: "Error", description: "Failed to export video", variant: "destructive" });
    }
  };

  const currentSize = `${project.width} × ${project.height}`;

  return (
    <div className="h-14 border-b flex items-center justify-between px-4 bg-card" data-testid="project-header">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" data-testid="back-button">
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </Button>
        <div className="w-px h-6 bg-border" />
        <Input
          value={project.name}
          onChange={(e) => updateProject({ name: e.target.value })}
          className="w-56 h-8 text-sm font-medium bg-transparent border-transparent hover:border-border focus:border-primary"
          data-testid="project-name-input"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Platform size display */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-xs font-medium text-muted-foreground">
          <span>{currentSize}</span>
        </div>

        <Select
          value={`${project.width}x${project.height}`}
          onValueChange={(val) => {
            const [w, h] = val.split("x").map(Number);
            updateProject({ width: w, height: h });
          }}
        >
          <SelectTrigger className="w-44 h-8 text-xs" data-testid="size-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PLATFORM_SIZES).map(([key, val]) => (
              <SelectItem key={key} value={`${val.width}x${val.height}`}>
                {val.label} ({val.width}×{val.height})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-px h-6 bg-border" />

        {/* Save to server */}
        <Button size="sm" variant="outline" onClick={handleSave} disabled={saving} className="gap-1.5" data-testid="save-button">
          <Save className="w-3.5 h-3.5" />
          {saving ? "Saving..." : "Save"}
        </Button>

        {/* File operations */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1.5" data-testid="file-menu">
              <FolderOpen className="w-3.5 h-3.5" />
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDownloadLocal}>
              <Download className="w-4 h-4 mr-2" />
              Save to Computer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLoadLocal}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Open from Computer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground" data-testid="export-button">
              <FileDown className="w-3.5 h-3.5" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportPNG}>
              <ImageIcon className="w-4 h-4 mr-2" />
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportMP4}>
              <Film className="w-4 h-4 mr-2" />
              Export as Video (WebM)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
