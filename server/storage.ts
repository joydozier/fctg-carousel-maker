import { projects, colorPalettes, type Project, type InsertProject, type ColorPalette, type InsertColorPalette } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Projects
  getProjects(): Project[];
  getProject(id: number): Project | undefined;
  createProject(project: InsertProject): Project;
  updateProject(id: number, project: Partial<InsertProject>): Project | undefined;
  deleteProject(id: number): void;

  // Color Palettes
  getColorPalettes(): ColorPalette[];
  createColorPalette(palette: InsertColorPalette): ColorPalette;
  deleteColorPalette(id: number): void;
}

export class DatabaseStorage implements IStorage {
  getProjects(): Project[] {
    return db.select().from(projects).all();
  }

  getProject(id: number): Project | undefined {
    return db.select().from(projects).where(eq(projects.id, id)).get();
  }

  createProject(project: InsertProject): Project {
    return db.insert(projects).values(project).returning().get();
  }

  updateProject(id: number, project: Partial<InsertProject>): Project | undefined {
    const existing = this.getProject(id);
    if (!existing) return undefined;
    return db.update(projects).set({ ...project, updatedAt: new Date().toISOString() }).where(eq(projects.id, id)).returning().get();
  }

  deleteProject(id: number): void {
    db.delete(projects).where(eq(projects.id, id)).run();
  }

  getColorPalettes(): ColorPalette[] {
    return db.select().from(colorPalettes).all();
  }

  createColorPalette(palette: InsertColorPalette): ColorPalette {
    return db.insert(colorPalettes).values(palette).returning().get();
  }

  deleteColorPalette(id: number): void {
    db.delete(colorPalettes).where(eq(colorPalettes.id, id)).run();
  }
}

export const storage = new DatabaseStorage();
