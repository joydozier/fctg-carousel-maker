import { useState, useCallback, useRef, useEffect } from "react";
import type { CarouselProject, Slide, SlideElement, GlobalStyles, ComparisonTheme } from "./types";
import { createDefaultProject, generateSlides, createContentSlide, applyComparisonLayout } from "./types";

const MAX_HISTORY = 50;

export function useCarouselStore() {
  const [project, setProject] = useState<CarouselProject>(createDefaultProject());
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // ── Undo/Redo history ──
  const historyRef = useRef<CarouselProject[]>([]);
  const futureRef = useRef<CarouselProject[]>([]);
  const skipHistoryRef = useRef(false); // flag to skip recording during undo/redo

  const pushHistory = useCallback((prev: CarouselProject) => {
    if (skipHistoryRef.current) return;
    historyRef.current = [...historyRef.current.slice(-MAX_HISTORY), prev];
    futureRef.current = []; // clear redo stack on new action
  }, []);

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    setProject((current) => {
      futureRef.current = [...futureRef.current, current];
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current[futureRef.current.length - 1];
    futureRef.current = futureRef.current.slice(0, -1);
    setProject((current) => {
      historyRef.current = [...historyRef.current, current];
      return next;
    });
  }, []);

  const canUndo = historyRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  const markDirty = useCallback(() => setIsDirty(true), []);

  const currentSlide = project.slides[selectedSlideIndex] || project.slides[0];

  const updateProject = useCallback((updates: Partial<CarouselProject>) => {
    setProject(prev => {
      pushHistory(prev);
      return { ...prev, ...updates };
    });
    markDirty();
  }, [markDirty, pushHistory]);

  const updateSlide = useCallback((slideId: string, updates: Partial<Slide>) => {
    setProject(prev => {
      pushHistory(prev);
      return {
        ...prev,
        slides: prev.slides.map(s => s.id === slideId ? { ...s, ...updates } : s),
      };
    });
    markDirty();
  }, [markDirty, pushHistory]);

  const updateElement = useCallback((slideId: string, elementId: string, updates: Partial<SlideElement>) => {
    setProject(prev => {
      pushHistory(prev);
      return {
        ...prev,
        slides: prev.slides.map(s =>
          s.id === slideId
            ? { ...s, elements: s.elements.map(e => e.id === elementId ? { ...e, ...updates } : e) }
            : s
        ),
      };
    });
    markDirty();
  }, [markDirty, pushHistory]);

  // Lightweight update that does NOT push history (used for drag/resize intermediate moves)
  const updateElementSilent = useCallback((slideId: string, elementId: string, updates: Partial<SlideElement>) => {
    setProject(prev => ({
      ...prev,
      slides: prev.slides.map(s =>
        s.id === slideId
          ? { ...s, elements: s.elements.map(e => e.id === elementId ? { ...e, ...updates } : e) }
          : s
      ),
    }));
    markDirty();
  }, [markDirty]);

  // Push a snapshot for before a drag/resize begins
  const pushSnapshot = useCallback(() => {
    pushHistory(project);
  }, [project, pushHistory]);

  const addElement = useCallback((slideId: string, element: SlideElement) => {
    setProject(prev => {
      pushHistory(prev);
      return {
        ...prev,
        slides: prev.slides.map(s =>
          s.id === slideId
            ? { ...s, elements: [...s.elements, element] }
            : s
        ),
      };
    });
    markDirty();
  }, [markDirty, pushHistory]);

  const removeElement = useCallback((slideId: string, elementId: string) => {
    setProject(prev => {
      pushHistory(prev);
      return {
        ...prev,
        slides: prev.slides.map(s =>
          s.id === slideId
            ? { ...s, elements: s.elements.filter(e => e.id !== elementId) }
            : s
        ),
      };
    });
    setSelectedElementId(null);
    markDirty();
  }, [markDirty, pushHistory]);

  // ── Element layer management ──
  const moveElementLayer = useCallback((slideId: string, elementId: string, direction: "up" | "down" | "top" | "bottom") => {
    setProject(prev => {
      pushHistory(prev);
      return {
        ...prev,
        slides: prev.slides.map(s => {
          if (s.id !== slideId) return s;
          const els = [...s.elements];
          const idx = els.findIndex(e => e.id === elementId);
          if (idx === -1) return s;
          if (direction === "top") {
            const [el] = els.splice(idx, 1);
            els.push(el);
          } else if (direction === "bottom") {
            const [el] = els.splice(idx, 1);
            els.unshift(el);
          } else if (direction === "up" && idx < els.length - 1) {
            [els[idx], els[idx + 1]] = [els[idx + 1], els[idx]];
          } else if (direction === "down" && idx > 0) {
            [els[idx], els[idx - 1]] = [els[idx - 1], els[idx]];
          }
          return { ...s, elements: els };
        }),
      };
    });
    markDirty();
  }, [markDirty, pushHistory]);

  const addSlide = useCallback((afterIndex?: number) => {
    setProject(prev => {
      pushHistory(prev);
      const slides = prev.slides;
      const palette = prev.globalStyles.colorPalette;
      const insertAfter = afterIndex !== undefined ? afterIndex : slides.length - 1;
      let sourceSlide: Slide | null = null;
      if (slides[insertAfter] && slides[insertAfter].slideType === "content") {
        sourceSlide = slides[insertAfter];
      }
      if (!sourceSlide) {
        for (let i = slides.length - 1; i >= 0; i--) {
          if (slides[i].slideType === "content") {
            sourceSlide = slides[i];
            break;
          }
        }
      }
      if (!sourceSlide && slides.length > 0) {
        sourceSlide = slides[0];
      }
      let newSlide: Slide;
      if (sourceSlide) {
        newSlide = JSON.parse(JSON.stringify(sourceSlide));
        newSlide.id = crypto.randomUUID();
        newSlide.slideType = "content";
        const newSlideNumber = insertAfter + 2;
        newSlide.elements = newSlide.elements.map((el: SlideElement) => {
          const cloned = { ...el, id: crypto.randomUUID() };
          if (cloned.type === "heading") cloned.content = "Section Title";
          else if (cloned.type === "body") cloned.content = "Put your content here.";
          else if (cloned.type === "subtitle") {
            if (cloned.fontSize && cloned.fontSize >= 40) cloned.content = String(newSlideNumber).padStart(2, "0");
            else cloned.content = "Subtitle";
          } else if (cloned.type === "cta") cloned.content = "Call to Action";
          else if (cloned.type === "slideNumber") cloned.content = String(newSlideNumber);
          else if (cloned.type === "image") cloned.src = undefined;
          else if (cloned.type === "video") { cloned.videoSrc = undefined; cloned.videoThumbnail = undefined; }
          else if (cloned.type === "logo") cloned.logoSrc = undefined;
          return cloned;
        });
      } else {
        newSlide = createContentSlide(slides.length, palette, prev.globalStyles);
      }
      const newSlides = [...slides];
      newSlides.splice(insertAfter + 1, 0, newSlide);
      const reindexed = newSlides.map((s, i) => ({ ...s, order: i }));
      return { ...prev, slideCount: reindexed.length, slides: reindexed };
    });
    const newIdx = (afterIndex !== undefined ? afterIndex : project.slides.length - 1) + 1;
    setSelectedSlideIndex(newIdx);
    markDirty();
  }, [project.slides.length, project.globalStyles, markDirty, pushHistory]);

  const duplicateSlide = useCallback((index: number) => {
    const source = project.slides[index];
    if (!source) return;
    setProject(prev => {
      pushHistory(prev);
      const newSlide: Slide = {
        ...JSON.parse(JSON.stringify(source)),
        id: crypto.randomUUID(),
        order: prev.slides.length,
      };
      newSlide.elements = newSlide.elements.map((e: SlideElement) => ({ ...e, id: crypto.randomUUID() }));
      const slides = [...prev.slides];
      slides.splice(index + 1, 0, newSlide);
      return { ...prev, slideCount: slides.length, slides: slides.map((s, i) => ({ ...s, order: i })) };
    });
    setSelectedSlideIndex(index + 1);
    markDirty();
  }, [project.slides, markDirty, pushHistory]);

  const deleteSlide = useCallback((index: number) => {
    if (project.slides.length <= 1) return;
    setProject(prev => {
      pushHistory(prev);
      const slides = prev.slides.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }));
      return { ...prev, slideCount: slides.length, slides };
    });
    setSelectedSlideIndex(Math.max(0, index - 1));
    markDirty();
  }, [project.slides.length, markDirty, pushHistory]);

  const moveSlide = useCallback((fromIndex: number, direction: "left" | "right") => {
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= project.slides.length) return;
    setProject(prev => {
      pushHistory(prev);
      const slides = [...prev.slides];
      [slides[fromIndex], slides[toIndex]] = [slides[toIndex], slides[fromIndex]];
      return { ...prev, slides: slides.map((s, i) => ({ ...s, order: i })) };
    });
    setSelectedSlideIndex(toIndex);
    markDirty();
  }, [project.slides.length, markDirty, pushHistory]);

  const updateGlobalStyles = useCallback((updates: Partial<GlobalStyles>) => {
    setProject(prev => {
      pushHistory(prev);
      return {
        ...prev,
        globalStyles: { ...prev.globalStyles, ...updates },
      };
    });
    markDirty();
  }, [markDirty, pushHistory]);

  const applyPaletteToAllSlides = useCallback((palette: string[]) => {
    setProject(prev => {
      pushHistory(prev);
      return {
        ...prev,
        globalStyles: { ...prev.globalStyles, colorPalette: palette },
        slides: prev.slides.map(s => ({
          ...s,
          backgroundColor: palette[0],
          elements: s.elements.map(e => {
            if (e.type === "heading" || e.type === "subtitle") return { ...e, color: palette[3] || palette[2], accentColor: palette[1] };
            if (e.type === "body") return { ...e, color: palette[2] };
            if (e.type === "cta") return { ...e, backgroundColor: palette[2], color: palette[0] };
            if (e.type === "slideNumber") return { ...e, color: palette[3], backgroundColor: palette[1] };
            return e;
          }),
        })),
      };
    });
    markDirty();
  }, [markDirty, pushHistory]);

  // Apply per-slide setting to all slides
  const applyToAllSlides = useCallback((updates: Partial<Slide>) => {
    setProject(prev => {
      pushHistory(prev);
      return {
        ...prev,
        slides: prev.slides.map(s => ({ ...s, ...updates })),
      };
    });
    markDirty();
  }, [markDirty, pushHistory]);

  const setSlideCount = useCallback((count: number) => {
    if (count < 2 || count > 20) return;
    setProject(prev => {
      pushHistory(prev);
      const palette = prev.globalStyles.colorPalette;
      const newSlides = generateSlides(count, palette, prev.globalStyles);
      return { ...prev, slideCount: count, slides: newSlides };
    });
    setSelectedSlideIndex(0);
    markDirty();
  }, [markDirty, pushHistory]);

  const loadProject = useCallback((proj: CarouselProject) => {
    setProject(proj);
    setSelectedSlideIndex(0);
    setSelectedElementId(null);
    setIsDirty(false);
    historyRef.current = [];
    futureRef.current = [];
  }, []);

  /* Add a NEW slide pre-configured as a Comparison layout. Used by the toolbar
     quick-action, the '+' menu featured option, and the empty-state hero card.
     Returns the new index so callers can also open the configure modal. */
  const addComparisonSlide = useCallback(
    (theme: ComparisonTheme = "pro-con", afterIndex?: number): number => {
      let newIdx = 0;
      setProject(prev => {
        pushHistory(prev);
        const slides = prev.slides;
        const insertAfter =
          afterIndex !== undefined ? afterIndex : slides.length - 1;

        // Start from a fresh content slide so we don't inherit unrelated
        // elements (image overlays, decorations) from a sibling slide.
        const base = createContentSlide(
          slides.length,
          prev.globalStyles.colorPalette,
          prev.globalStyles
        );
        const newSlide = applyComparisonLayout(base, theme);
        newSlide.id = crypto.randomUUID();
        newSlide.slideType = "content";

        const newSlides = [...slides];
        newSlides.splice(insertAfter + 1, 0, newSlide);
        const reindexed = newSlides.map((s, i) => ({ ...s, order: i }));
        newIdx = insertAfter + 1;
        return { ...prev, slideCount: reindexed.length, slides: reindexed };
      });
      setSelectedSlideIndex(newIdx);
      markDirty();
      return newIdx;
    },
    [markDirty, pushHistory]
  );

  /* Convert the CURRENTLY-selected slide into a Comparison layout. Used by the
     empty-state hero card so the user keeps the slide they're already editing
     instead of accumulating a new one. */
  const convertSlideToComparison = useCallback(
    (index: number, theme: ComparisonTheme = "pro-con") => {
      setProject(prev => {
        pushHistory(prev);
        const slides = prev.slides;
        if (!slides[index]) return prev;
        const updated = applyComparisonLayout(slides[index], theme);
        const newSlides = slides.map((s, i) => (i === index ? updated : s));
        return { ...prev, slides: newSlides };
      });
      setSelectedSlideIndex(index);
      markDirty();
    },
    [markDirty, pushHistory]
  );

  // Duplicate entire project (returns the project data for the caller to save)
  const duplicateProject = useCallback((): CarouselProject => {
    return {
      ...JSON.parse(JSON.stringify(project)),
      id: undefined,
      name: `${project.name} (Copy)`,
    };
  }, [project]);

  return {
    project,
    setProject,
    selectedSlideIndex,
    setSelectedSlideIndex,
    selectedElementId,
    setSelectedElementId,
    currentSlide,
    isDirty,
    setIsDirty,
    updateProject,
    updateSlide,
    updateElement,
    updateElementSilent,
    pushSnapshot,
    addElement,
    removeElement,
    moveElementLayer,
    addSlide,
    addComparisonSlide,
    convertSlideToComparison,
    duplicateSlide,
    deleteSlide,
    moveSlide,
    updateGlobalStyles,
    applyPaletteToAllSlides,
    applyToAllSlides,
    setSlideCount,
    loadProject,
    duplicateProject,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
