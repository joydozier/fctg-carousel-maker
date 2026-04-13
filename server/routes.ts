import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(server: Server, app: Express) {
  // Projects CRUD
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getUserProjects();
      res.json(projects);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(Number(req.params.id));
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const project = await storage.createProject(req.body);
      res.status(201).json(project);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(Number(req.params.id), req.body);
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(Number(req.params.id));
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Templates
  app.get("/api/templates/built-in", async (_req, res) => {
    try {
      const templates = await storage.getBuiltInTemplates();
      res.json(templates);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/templates/custom", async (_req, res) => {
    try {
      const templates = await storage.getUserTemplates();
      res.json(templates);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Clone a template into a new project
  app.post("/api/templates/:id/clone", async (req, res) => {
    try {
      const source = await storage.getProject(Number(req.params.id));
      if (!source) return res.status(404).json({ error: "Template not found" });
      const now = new Date().toISOString();
      const newProject = await storage.createProject({
        name: req.body.name || `${source.name} Copy`,
        platform: source.platform,
        width: source.width,
        height: source.height,
        slides: source.slides,
        globalStyles: source.globalStyles,
        isTemplate: 0,
        isBuiltIn: 0,
        templateCategory: null,
        createdAt: now,
        updatedAt: now,
      });
      res.status(201).json(newProject);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Save existing project as a custom template
  app.post("/api/projects/:id/save-as-template", async (req, res) => {
    try {
      const source = await storage.getProject(Number(req.params.id));
      if (!source) return res.status(404).json({ error: "Project not found" });
      const now = new Date().toISOString();
      const template = await storage.createProject({
        name: req.body.name || `${source.name} Template`,
        platform: source.platform,
        width: source.width,
        height: source.height,
        slides: source.slides,
        globalStyles: source.globalStyles,
        isTemplate: 1,
        isBuiltIn: 0,
        templateCategory: req.body.category || "custom",
        createdAt: now,
        updatedAt: now,
      });
      res.status(201).json(template);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Check built-in template count (client uses this to decide whether to seed)
  app.get("/api/templates/built-in-count", async (_req, res) => {
    try {
      const count = await storage.getBuiltInTemplateCount();
      res.json({ count });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Color Palettes
  app.get("/api/palettes", async (_req, res) => {
    try {
      const palettes = await storage.getColorPalettes();
      res.json(palettes);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/palettes", async (req, res) => {
    try {
      const palette = await storage.createColorPalette(req.body);
      res.status(201).json(palette);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/palettes/:id", async (req, res) => {
    try {
      await storage.deleteColorPalette(Number(req.params.id));
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
