import { supabase } from "./supabase";

/* ─── Types matching the Supabase carousel_projects / carousel_palettes tables ─── */
export interface Project {
  id: number;
  name: string;
  platform: string;
  width: number;
  height: number;
  slides: string;          // JSON string (serialized for API compat)
  globalStyles: string;    // JSON string
  isTemplate: number;      // 0 or 1 (API compat with frontend)
  isBuiltIn: number;
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

export interface ColorPalette {
  id: number;
  name: string;
  colors: string;       // JSON string
  isBuiltIn: number;
}

export interface InsertColorPalette {
  name: string;
  colors: string;
  isBuiltIn?: number;
}

/* ─── Helpers: convert between Supabase row (snake_case, booleans, JSONB) and app types ─── */
function rowToProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    platform: row.platform,
    width: row.width,
    height: row.height,
    slides: typeof row.slides === "string" ? row.slides : JSON.stringify(row.slides),
    globalStyles: typeof row.global_styles === "string" ? row.global_styles : JSON.stringify(row.global_styles),
    isTemplate: row.is_template ? 1 : 0,
    isBuiltIn: row.is_built_in ? 1 : 0,
    templateCategory: row.template_category,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function projectToRow(p: Partial<InsertProject>): Record<string, any> {
  const row: Record<string, any> = {};
  if (p.name !== undefined) row.name = p.name;
  if (p.platform !== undefined) row.platform = p.platform;
  if (p.width !== undefined) row.width = p.width;
  if (p.height !== undefined) row.height = p.height;
  if (p.slides !== undefined) {
    try { row.slides = JSON.parse(p.slides); } catch { row.slides = p.slides; }
  }
  if (p.globalStyles !== undefined) {
    try { row.global_styles = JSON.parse(p.globalStyles); } catch { row.global_styles = p.globalStyles; }
  }
  if (p.isTemplate !== undefined) row.is_template = p.isTemplate === 1;
  if (p.isBuiltIn !== undefined) row.is_built_in = p.isBuiltIn === 1;
  if (p.templateCategory !== undefined) row.template_category = p.templateCategory;
  if (p.createdAt !== undefined) row.created_at = p.createdAt;
  if (p.updatedAt !== undefined) row.updated_at = p.updatedAt;
  return row;
}

function rowToPalette(row: any): ColorPalette {
  return {
    id: row.id,
    name: row.name,
    colors: typeof row.colors === "string" ? row.colors : JSON.stringify(row.colors),
    isBuiltIn: row.is_built_in ? 1 : 0,
  };
}

/* ─── Async Storage Interface ─── */
export interface IStorage {
  getProjects(): Promise<Project[]>;
  getUserProjects(): Promise<Project[]>;
  getBuiltInTemplates(): Promise<Project[]>;
  getUserTemplates(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;
  getBuiltInTemplateCount(): Promise<number>;

  getColorPalettes(): Promise<ColorPalette[]>;
  createColorPalette(palette: InsertColorPalette): Promise<ColorPalette>;
  deleteColorPalette(id: number): Promise<void>;
}

/* ─── Supabase Storage Implementation ─── */
export class SupabaseStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("carousel_projects")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(rowToProject);
  }

  async getUserProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("carousel_projects")
      .select("*")
      .eq("is_template", false)
      .eq("is_built_in", false)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(rowToProject);
  }

  async getBuiltInTemplates(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("carousel_projects")
      .select("*")
      .eq("is_built_in", true);
    if (error) throw error;
    return (data || []).map(rowToProject);
  }

  async getUserTemplates(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("carousel_projects")
      .select("*")
      .eq("is_template", true)
      .eq("is_built_in", false)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(rowToProject);
  }

  async getBuiltInTemplateCount(): Promise<number> {
    const { count, error } = await supabase
      .from("carousel_projects")
      .select("*", { count: "exact", head: true })
      .eq("is_built_in", true);
    if (error) throw error;
    return count || 0;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const { data, error } = await supabase
      .from("carousel_projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToProject(data) : undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const row = projectToRow(project);
    const { data, error } = await supabase
      .from("carousel_projects")
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return rowToProject(data);
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const row = projectToRow(project);
    row.updated_at = new Date().toISOString();
    const { data, error } = await supabase
      .from("carousel_projects")
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      if (error.code === "PGRST116") return undefined; // not found
      throw error;
    }
    return rowToProject(data);
  }

  async deleteProject(id: number): Promise<void> {
    const { error } = await supabase
      .from("carousel_projects")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }

  async getColorPalettes(): Promise<ColorPalette[]> {
    const { data, error } = await supabase
      .from("carousel_palettes")
      .select("*");
    if (error) throw error;
    return (data || []).map(rowToPalette);
  }

  async createColorPalette(palette: InsertColorPalette): Promise<ColorPalette> {
    const row: Record<string, any> = {
      name: palette.name,
      is_built_in: (palette.isBuiltIn ?? 0) === 1,
    };
    try { row.colors = JSON.parse(palette.colors); } catch { row.colors = palette.colors; }
    const { data, error } = await supabase
      .from("carousel_palettes")
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return rowToPalette(data);
  }

  async deleteColorPalette(id: number): Promise<void> {
    const { error } = await supabase
      .from("carousel_palettes")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }
}

export const storage = new SupabaseStorage();
