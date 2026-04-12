import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertColorPaletteSchema } from "@shared/schema";

export async function registerRoutes(server: Server, app: Express) {
  // Projects CRUD
  app.get("/api/projects", (_req, res) => {
    const projects = storage.getProjects();
    res.json(projects);
  });

  app.get("/api/projects/:id", (req, res) => {
    const project = storage.getProject(Number(req.params.id));
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  });

  app.post("/api/projects", (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    const project = storage.createProject(parsed.data);
    res.status(201).json(project);
  });

  app.patch("/api/projects/:id", (req, res) => {
    const project = storage.updateProject(Number(req.params.id), req.body);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  });

  app.delete("/api/projects/:id", (req, res) => {
    storage.deleteProject(Number(req.params.id));
    res.status(204).send();
  });

  // Color Palettes
  app.get("/api/palettes", (_req, res) => {
    const palettes = storage.getColorPalettes();
    res.json(palettes);
  });

  app.post("/api/palettes", (req, res) => {
    const parsed = insertColorPaletteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    const palette = storage.createColorPalette(parsed.data);
    res.status(201).json(palette);
  });

  app.delete("/api/palettes/:id", (req, res) => {
    storage.deleteColorPalette(Number(req.params.id));
    res.status(204).send();
  });
}
