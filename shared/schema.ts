import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  platform: text("platform").notNull().default("instagram"), // instagram, linkedin, tiktok, facebook, x
  width: integer("width").notNull().default(1080),
  height: integer("height").notNull().default(1080),
  slides: text("slides").notNull().default("[]"), // JSON array of slide objects
  globalStyles: text("global_styles").notNull().default("{}"), // JSON: fonts, colors, branding
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const colorPalettes = sqliteTable("color_palettes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  colors: text("colors").notNull(), // JSON array of hex colors
  isBuiltIn: integer("is_built_in").notNull().default(0),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertColorPaletteSchema = createInsertSchema(colorPalettes).omit({ id: true });

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ColorPalette = typeof colorPalettes.$inferSelect;
export type InsertColorPalette = z.infer<typeof insertColorPaletteSchema>;

// Slide type definitions for the frontend
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
