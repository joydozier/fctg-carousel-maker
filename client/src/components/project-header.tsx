import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Download, FileDown, FolderOpen, ChevronLeft, Film, Image as ImageIcon, Layers, Archive, BookTemplate, HelpCircle, Eye, Undo2, Redo2 } from "lucide-react";
import { HelpModal } from "@/components/help-modal";
import { PreviewModal } from "@/components/preview-modal";
import { PLATFORM_SIZES, getVideoLayoutWarning } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CanvasResizeModal } from "@/components/canvas-resize-modal";
import { SiInstagram } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

interface ProjectHeaderProps {
  store: ReturnType<typeof import("@/lib/carousel-store").useCarouselStore>;
}

export function ProjectHeader({ store }: ProjectHeaderProps) {
  const { project, updateProject, setIsDirty, setSlideCount } = store;
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [saving, setSaving] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [resizeModalOpen, setResizeModalOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number; label: string } | null>(null);

  // Keyboard shortcut: press ? to toggle help
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
        e.preventDefault();
        setHelpOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Keyboard shortcuts: Ctrl+Z, Ctrl+Shift+Z / Ctrl+Y, Ctrl+S, Ctrl+D, Delete/Backspace, Arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditing = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;

      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+Z → undo
      if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        store.undo();
        return;
      }

      // Ctrl+Shift+Z or Ctrl+Y → redo
      if ((ctrl && e.shiftKey && e.key === "z") || (ctrl && e.key === "y")) {
        e.preventDefault();
        store.redo();
        return;
      }

      // Ctrl+S → save
      if (ctrl && e.key === "s") {
        e.preventDefault();
        handleSave();
        return;
      }

      // Ctrl+D → duplicate current slide
      if (ctrl && e.key === "d") {
        e.preventDefault();
        store.duplicateSlide(store.selectedSlideIndex);
        return;
      }

      // Skip editing-context shortcuts below when in an input
      if (isEditing) return;

      // Delete or Backspace → remove selected element
      if (e.key === "Delete" || e.key === "Backspace") {
        if (store.selectedElementId && store.currentSlide) {
          e.preventDefault();
          store.removeElement(store.currentSlide.id, store.selectedElementId);
        }
        return;
      }

      // Arrow keys → nudge selected element
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        if (store.selectedElementId && store.currentSlide) {
          e.preventDefault();
          const nudge = e.shiftKey ? 10 : 1;
          const slide = store.currentSlide;
          const el = slide.elements.find((el) => el.id === store.selectedElementId);
          if (!el) return;
          let dx = 0, dy = 0;
          if (e.key === "ArrowLeft") dx = -nudge;
          if (e.key === "ArrowRight") dx = nudge;
          if (e.key === "ArrowUp") dy = -nudge;
          if (e.key === "ArrowDown") dy = nudge;
          store.updateElement(slide.id, store.selectedElementId, {
            x: (el.x ?? 0) + dx,
            y: (el.y ?? 0) + dy,
          });
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.selectedElementId, store.currentSlide, store.selectedSlideIndex]);

  // Unsaved changes warning
  useEffect(() => {
    if (!store.isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [store.isDirty]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!store.isDirty || !project.id) return;
      try {
        const body = {
          name: project.name,
          platform: project.platform,
          width: project.width,
          height: project.height,
          slides: JSON.stringify(project.slides),
          globalStyles: JSON.stringify(project.globalStyles),
          updatedAt: new Date().toISOString(),
        };
        await apiRequest("PATCH", `/api/projects/${project.id}`, body);
        setIsDirty(false);
      } catch {
        toast({ title: "Auto-save failed", description: "Could not save your project automatically", variant: "destructive" });
      }
    }, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.isDirty, project.id, project.name, project.platform, project.width, project.height, project.slides, project.globalStyles]);

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

  const handleSaveAsTemplate = async () => {
    if (!project.id) {
      // Save the project first
      await handleSave();
    }
    if (!project.id) {
      toast({ title: "Error", description: "Save the project first before creating a template", variant: "destructive" });
      return;
    }
    setSavingTemplate(true);
    try {
      await apiRequest("POST", `/api/projects/${project.id}/save-as-template`, {
        name: `${project.name} Template`,
        category: "custom",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/templates/custom"] });
      toast({ title: "Template Created", description: `"${project.name}" saved as a reusable template` });
    } catch {
      toast({ title: "Error", description: "Failed to save as template", variant: "destructive" });
    }
    setSavingTemplate(false);
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

  /** Helper: record a single slide's [data-slide-export] element to a WebM blob */
  const recordSlideToVideo = (el: HTMLElement, durationMs = 5000): Promise<Blob> => {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = project.width;
        canvas.height = project.height;
        const ctx = canvas.getContext("2d")!;
        const stream = canvas.captureStream(30);
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));

        // Capture the slide as a static image, then hold it for durationMs
        const { toPng } = await import("html-to-image");
        const dataUrl = await toPng(el, {
          width: project.width,
          height: project.height,
          pixelRatio: 1,
          style: { transform: "none", borderRadius: "0" },
        });

        const img = new Image();
        img.onload = () => {
          recorder.start();
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Hold the frame
          const interval = setInterval(() => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }, 33);
          setTimeout(() => {
            clearInterval(interval);
            recorder.stop();
          }, durationMs);
        };
        img.src = dataUrl;
      } catch (err) {
        reject(err);
      }
    });
  };

  /** Export individual slides: PNG for static, WebM for video, bundled in ZIP */
  const handleExportZip = async () => {
    const slideElements = document.querySelectorAll("[data-slide-export]");
    if (slideElements.length === 0) {
      toast({ title: "No slides", description: "Nothing to export", variant: "destructive" });
      return;
    }

    const total = slideElements.length;
    setExportProgress({ current: 0, total, label: "Preparing..." });

    try {
      const JSZip = (await import("jszip")).default;
      const { toPng } = await import("html-to-image");
      const zip = new JSZip();
      const safeName = project.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");

      for (let i = 0; i < slideElements.length; i++) {
        setExportProgress({ current: i + 1, total, label: `Exporting slide ${i + 1} of ${total}...` });
        const slide = project.slides[i];
        const el = slideElements[i] as HTMLElement;
        const isVideoSlide = slide?.layout === "video" && slide.elements.some(e => e.type === "video" && e.videoSrc);

        if (isVideoSlide) {
          // Record video slide as WebM
          const videoBlob = await recordSlideToVideo(el, 5000);
          zip.file(`${safeName}_${i + 1}.webm`, videoBlob);
        } else {
          // Export static slide as PNG
          const dataUrl = await toPng(el, {
            width: project.width,
            height: project.height,
            pixelRatio: 2,
            style: { transform: "none", borderRadius: "0" },
          });
          // Convert data URL to binary
          const base64 = dataUrl.split(",")[1];
          zip.file(`${safeName}_${i + 1}.png`, base64, { base64: true });
        }
      }

      setExportProgress({ current: total, total, label: "Creating ZIP..." });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeName}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setExportProgress(null);
      const videoCount = project.slides.filter(s => s.layout === "video" && s.elements.some(e => e.type === "video" && e.videoSrc)).length;
      const pngCount = slideElements.length - videoCount;
      toast({
        title: "Done",
        description: `Exported ${pngCount} PNG${pngCount !== 1 ? "s" : ""} and ${videoCount} video${videoCount !== 1 ? "s" : ""} in ZIP`,
      });
    } catch (err) {
      console.error("ZIP export error:", err);
      setExportProgress(null);
      toast({ title: "Error", description: "Failed to export slides", variant: "destructive" });
    }
  };

  const handleExportPNG = async () => {
    const slideElements = document.querySelectorAll("[data-slide-export]");
    if (slideElements.length === 0) {
      toast({ title: "No slides", description: "Nothing to export", variant: "destructive" });
      return;
    }

    const total = slideElements.length;
    setExportProgress({ current: 0, total, label: "Preparing..." });

    try {
      const { toPng } = await import("html-to-image");
      for (let i = 0; i < slideElements.length; i++) {
        setExportProgress({ current: i + 1, total, label: `Exporting slide ${i + 1} of ${total}...` });
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
      setExportProgress(null);
      toast({ title: "Done", description: `${slideElements.length} slides exported as PNG` });
    } catch (err) {
      console.error("PNG export error:", err);
      setExportProgress(null);
      toast({ title: "Error", description: "Failed to export PNGs", variant: "destructive" });
    }
  };

  const handleExportMP4 = async () => {
    const slideElements = document.querySelectorAll("[data-slide-export]");
    const total = slideElements.length;
    setExportProgress({ current: 0, total, label: "Capturing slides..." });

    try {
      const { toPng } = await import("html-to-image");
      const frames: string[] = [];

      for (let i = 0; i < slideElements.length; i++) {
        setExportProgress({ current: i + 1, total, label: `Capturing slide ${i + 1} of ${total}...` });
        const dataUrl = await toPng(slideElements[i] as HTMLElement, {
          width: project.width,
          height: project.height,
          pixelRatio: 1,
          style: { transform: "none", borderRadius: "0" },
        });
        frames.push(dataUrl);
      }

      setExportProgress({ current: total, total, label: "Encoding video..." });

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
        const FRAME_DURATION = 3000;
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

            let held = 0;
            const holdInterval = setInterval(() => {
              held += 33;
              if (held >= FRAME_DURATION) {
                clearInterval(holdInterval);
                frameIndex++;

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

      setExportProgress(null);
      toast({ title: "Done", description: "Video exported as WebM" });
    } catch (err) {
      console.error("MP4 export error:", err);
      setExportProgress(null);
      toast({ title: "Error", description: "Failed to export video", variant: "destructive" });
    }
  };

  const currentSize = `${project.width} × ${project.height}`;

  // Find current platform name
  const currentPlatform = Object.values(PLATFORM_SIZES).find(
    (s) => s.width === project.width && s.height === project.height
  );
  const platformLabel = currentPlatform
    ? `${currentPlatform.label} (${currentPlatform.ratio})`
    : `Custom`;

  // Export progress bar width
  const progressPct = exportProgress
    ? Math.round((exportProgress.current / exportProgress.total) * 100)
    : 0;

  return (
    <div className="relative" data-testid="project-header">
      <div className="h-14 border-b border-[#2a2b2d] flex items-center justify-between px-4 bg-[#2D2E30] stone-texture">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-[#B8944F] hover:text-[#D4A537] hover:bg-[#3A3B3D]"
            onClick={() => navigate("/")}
            data-testid="back-button"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Button>
          <div className="w-px h-6 bg-[#3A3B3D]" />
          <Input
            value={project.name}
            onChange={(e) => updateProject({ name: e.target.value })}
            className="w-56 h-8 text-sm font-semibold bg-transparent border-transparent hover:border-[#D4A537]/30 focus:border-[#D4A537] text-[#E2DDD5]"
            data-testid="project-name-input"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Slide count selector */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#3A3B3D] border border-[#4A4B4D]" data-testid="slide-count-area" title="Set the number of slides — changing this regenerates all slides">
            <Layers className="w-3.5 h-3.5 text-[#B8944F]" />
            <Select
              value={String(project.slideCount)}
              onValueChange={(val) => setSlideCount(Number(val))}
            >
              <SelectTrigger className="h-7 w-20 text-xs border-0 bg-transparent p-0 pl-1" data-testid="slide-count-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, i) => i + 2).map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} slides
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Platform size — clickable to open Resize Canvas modal (PostNitro style) */}
          <button
            onClick={() => setResizeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#3A3B3D] border border-[#4A4B4D] text-xs font-medium text-[#B8944F] hover:bg-[#464849] hover:border-[#D4A537]/40 transition-colors"
            data-testid="size-display"
            title="Click to resize canvas for different platforms"
          >
            <span>{currentSize}</span>
          </button>

          <button
            onClick={() => setResizeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#4A4B4D] text-xs font-medium text-[#E2DDD5] hover:bg-[#464849] hover:border-[#D4A537]/40 transition-colors"
            data-testid="platform-select-btn"
          >
            {/* Platform icons */}
            {currentPlatform?.icons.slice(0, 2).map((icon) => {
              if (icon === "linkedin") return <FaLinkedin key={icon} className="w-3 h-3" style={{ color: "#0A66C2" }} />;
              if (icon === "instagram") return <SiInstagram key={icon} className="w-3 h-3" style={{ color: "#E4405F" }} />;
              return null;
            })}
            <span>{platformLabel}</span>
          </button>

          <div className="w-px h-6 bg-[#3A3B3D]" />

          {/* Undo / Redo */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => store.undo()}
            disabled={!store.canUndo}
            className="w-8 h-8 p-0 text-[#8A8580] hover:text-[#D4A537] hover:bg-[#3A3B3D] disabled:opacity-30"
            data-testid="undo-button"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => store.redo()}
            disabled={!store.canRedo}
            className="w-8 h-8 p-0 text-[#8A8580] hover:text-[#D4A537] hover:bg-[#3A3B3D] disabled:opacity-30"
            data-testid="redo-button"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-[#3A3B3D]" />

          {/* Save to server */}
          <Button size="sm" variant="outline" onClick={handleSave} disabled={saving} className="gap-1.5 border-[#D4A537]/30 text-[#D4A537] hover:bg-[#D4A537]/10 hover:text-[#D4A537]" data-testid="save-button" title="Save project to cloud (Ctrl+S)">
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save"}
          </Button>

          {/* File operations */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5 border-[#4A4B4D] text-[#E2DDD5] hover:bg-[#464849] hover:border-[#D4A537]/40" data-testid="file-menu" title="Save to computer, open files, or save as template">
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
              <DropdownMenuItem onClick={handleSaveAsTemplate} disabled={savingTemplate}>
                <BookTemplate className="w-4 h-4 mr-2" />
                {savingTemplate ? "Saving..." : "Save as Template"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Preview */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
            className="gap-1.5 border-[#4A4B4D] text-[#E2DDD5] hover:bg-[#464849] hover:border-[#D4A537]/40"
            data-testid="preview-button"
            title="Preview full carousel slideshow"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </Button>

          {/* Help */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setHelpOpen(true)}
            className="gap-1.5 text-[#8A8580] hover:text-[#D4A537] hover:bg-[#3A3B3D]"
            data-testid="help-button"
            title="Help (press ?)"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-1.5 bg-[#D4A537] text-[#08080A] hover:bg-[#C49A3C] font-semibold" data-testid="export-button" title="Export slides as PNG, ZIP, or video">
                <FileDown className="w-3.5 h-3.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportZip}>
                <Archive className="w-4 h-4 mr-2" />
                Export as ZIP (PNG + Video)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPNG}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Export All as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportMP4}>
                <Film className="w-4 h-4 mr-2" />
                Export as Video (WebM)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Export progress bar — thin gold bar under the header */}
      {exportProgress && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3A3B3D] z-50" data-testid="export-progress-bar">
          <div
            className="h-full bg-[#D4A537] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
          <div className="absolute right-3 -top-5 text-[10px] text-[#D4A537] font-medium bg-[#2D2E30] px-2 py-0.5 rounded">
            {exportProgress.label}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && (
        <PreviewModal
          project={project}
          store={store}
          initialSlide={0}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      {/* Help Modal */}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}

      {/* Canvas Resize Modal */}
      {resizeModalOpen && (
        <CanvasResizeModal
          currentWidth={project.width}
          currentHeight={project.height}
          onSelect={(w, h) => {
            updateProject({ width: w, height: h });
            // Check video layout compatibility for all video slides
            const videoSlides = project.slides.filter(s => s.layout === "video" && s.videoSplitLayout);
            for (const vs of videoSlides) {
              const warning = getVideoLayoutWarning(w, h, vs.videoSplitLayout!);
              if (warning) {
                toast({
                  title: "Video layout warning",
                  description: `Slide ${vs.order + 1}: ${warning}`,
                  variant: "destructive",
                });
                break; // show one warning to avoid toast spam
              }
            }
            setResizeModalOpen(false);
          }}
          onClose={() => setResizeModalOpen(false)}
        />
      )}
    </div>
  );
}
