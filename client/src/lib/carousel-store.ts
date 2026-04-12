import { useState, useCallback } from "react";
import type { CarouselProject, Slide, SlideElement, GlobalStyles } from "./types";
import { createDefaultSlide, createDefaultProject } from "./types";

export function useCarouselStore() {
  const [project, setProject] = useState<CarouselProject>(createDefaultProject());
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const markDirty = useCallback(() => setIsDirty(true), []);

  const currentSlide = project.slides[selectedSlideIndex] || project.slides[0];

  const updateProject = useCallback((updates: Partial<CarouselProject>) => {
    setProject(prev => ({ ...prev, ...updates }));
    markDirty();
  }, [markDirty]);

  const updateSlide = useCallback((slideId: string, updates: Partial<Slide>) => {
    setProject(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === slideId ? { ...s, ...updates } : s),
    }));
    markDirty();
  }, [markDirty]);

  const updateElement = useCallback((slideId: string, elementId: string, updates: Partial<SlideElement>) => {
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

  const addElement = useCallback((slideId: string, element: SlideElement) => {
    setProject(prev => ({
      ...prev,
      slides: prev.slides.map(s =>
        s.id === slideId
          ? { ...s, elements: [...s.elements, element] }
          : s
      ),
    }));
    markDirty();
  }, [markDirty]);

  const removeElement = useCallback((slideId: string, elementId: string) => {
    setProject(prev => ({
      ...prev,
      slides: prev.slides.map(s =>
        s.id === slideId
          ? { ...s, elements: s.elements.filter(e => e.id !== elementId) }
          : s
      ),
    }));
    setSelectedElementId(null);
    markDirty();
  }, [markDirty]);

  const addSlide = useCallback(() => {
    const newSlide = createDefaultSlide(project.slides.length, project.globalStyles.colorPalette);
    setProject(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
    setSelectedSlideIndex(project.slides.length);
    markDirty();
  }, [project.slides.length, project.globalStyles.colorPalette, markDirty]);

  const duplicateSlide = useCallback((index: number) => {
    const source = project.slides[index];
    if (!source) return;
    const newSlide: Slide = {
      ...JSON.parse(JSON.stringify(source)),
      id: crypto.randomUUID(),
      order: project.slides.length,
    };
    newSlide.elements = newSlide.elements.map((e: SlideElement) => ({ ...e, id: crypto.randomUUID() }));
    setProject(prev => {
      const slides = [...prev.slides];
      slides.splice(index + 1, 0, newSlide);
      return { ...prev, slides: slides.map((s, i) => ({ ...s, order: i })) };
    });
    setSelectedSlideIndex(index + 1);
    markDirty();
  }, [project.slides, markDirty]);

  const deleteSlide = useCallback((index: number) => {
    if (project.slides.length <= 1) return;
    setProject(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })),
    }));
    setSelectedSlideIndex(Math.max(0, index - 1));
    markDirty();
  }, [project.slides.length, markDirty]);

  const moveSlide = useCallback((fromIndex: number, direction: "left" | "right") => {
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= project.slides.length) return;
    setProject(prev => {
      const slides = [...prev.slides];
      [slides[fromIndex], slides[toIndex]] = [slides[toIndex], slides[fromIndex]];
      return { ...prev, slides: slides.map((s, i) => ({ ...s, order: i })) };
    });
    setSelectedSlideIndex(toIndex);
    markDirty();
  }, [project.slides.length, markDirty]);

  const updateGlobalStyles = useCallback((updates: Partial<GlobalStyles>) => {
    setProject(prev => ({
      ...prev,
      globalStyles: { ...prev.globalStyles, ...updates },
    }));
    markDirty();
  }, [markDirty]);

  const applyPaletteToAllSlides = useCallback((palette: string[]) => {
    setProject(prev => ({
      ...prev,
      globalStyles: { ...prev.globalStyles, colorPalette: palette },
      slides: prev.slides.map(s => ({
        ...s,
        backgroundColor: palette[0],
        elements: s.elements.map(e => {
          if (e.type === "heading" || e.type === "subheading") return { ...e, color: palette[3] || palette[2] };
          if (e.type === "body") return { ...e, color: palette[2] };
          if (e.type === "cta") return { ...e, backgroundColor: palette[1], color: palette[0] };
          return e;
        }),
      })),
    }));
    markDirty();
  }, [markDirty]);

  const loadProject = useCallback((proj: CarouselProject) => {
    setProject(proj);
    setSelectedSlideIndex(0);
    setSelectedElementId(null);
    setIsDirty(false);
  }, []);

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
    addElement,
    removeElement,
    addSlide,
    duplicateSlide,
    deleteSlide,
    moveSlide,
    updateGlobalStyles,
    applyPaletteToAllSlides,
    loadProject,
  };
}
