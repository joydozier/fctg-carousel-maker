import { z } from "zod";

/* ─── Project type (matches carousel_projects table in Supabase) ─── */
export interface Project {
  id: number;
  name: string;
  platform: string;
  width: number;
  height: number;
  slides: string;          // JSON string
  globalStyles: string;    // JSON string
  isTemplate: number;      // 0 or 1
  isBuiltIn: number;       // 0 or 1
  templateCategory: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InsertProject {
  name: string;
  platform: string;
  width: number;
  height: number;
  slides: string;
  globalStyles: string;
  isTemplate?: number;
  isBuiltIn?: number;
  templateCategory?: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ─── Color Palette type (matches carousel_palettes table in Supabase) ─── */
export interface ColorPalette {
  id: number;
  name: string;
  colors: string;          // JSON string
  isBuiltIn: number;       // 0 or 1
}

export interface InsertColorPalette {
  name: string;
  colors: string;
  isBuiltIn?: number;
}

/* ─── Zod schemas for API validation ─── */
export const insertProjectSchema = z.object({
  name: z.string(),
  platform: z.string().default("instagram"),
  width: z.number().default(1080),
  height: z.number().default(1080),
  slides: z.string().default("[]"),
  globalStyles: z.string().default("{}"),
  isTemplate: z.number().default(0),
  isBuiltIn: z.number().default(0),
  templateCategory: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertColorPaletteSchema = z.object({
  name: z.string(),
  colors: z.string(),
  isBuiltIn: z.number().default(0),
});

/* ─── Slide type definitions for the frontend ─── */
export interface SlideElement {
  id: string;
  type: "text" | "image" | "shape" | "icon";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  opacity?: number;
  src?: string;
  iconName?: string;
}

export interface Slide {
  id: string;
  order: number;
  backgroundColor: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  backgroundPattern?: string;
  patternOpacity?: number;
  elements: SlideElement[];
  layout: "default" | "quote" | "infographic" | "testimonial";
}

export interface GlobalStyles {
  headingFont: string;
  bodyFont: string;
  headingFontSize: number;
  bodyFontSize: number;
  colorPalette: string[]; // array of 4 hex colors
  brandingEnabled: boolean;
  brandName?: string;
  brandColor?: string;
  slideNumberEnabled: boolean;
  slideNumberStyle: string;
  swipeIndicatorEnabled: boolean;
}
