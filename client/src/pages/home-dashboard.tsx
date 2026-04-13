import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Plus, Sparkles, LayoutGrid, Clock, ChevronRight,
  Trash2, Copy, Star, BookTemplate, FolderOpen, Search, HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpModal } from "@/components/help-modal";
// Project type — matches the API response shape from Supabase storage
interface Project {
  id: number;
  name: string;
  platform: string;
  width: number;
  height: number;
  slides: string;
  globalStyles: string;
  isTemplate: number;
  isBuiltIn: number;
  templateCategory: string | null;
  createdAt: string;
  updatedAt: string;
}
import { BUILT_IN_TEMPLATES } from "@/lib/built-in-templates";

/* ─────────── Template Card ─────────── */
function TemplateCard({
  name,
  description,
  gradient,
  category,
  headingText,
  onClick,
}: {
  name: string;
  description?: string;
  gradient: string;
  category?: string;
  headingText?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-xl overflow-hidden border border-[#3a3a3a] hover:border-[#D4A537]/60 hover:shadow-lg hover:shadow-[#D4A537]/10 transition-all text-left"
      data-testid={`template-card-${name.replace(/\s+/g, "-").toLowerCase()}`}
    >
      {/* Preview area */}
      <div
        className="aspect-[4/5] w-full flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ background: gradient }}
      >
        {/* Mini slide mockup */}
        <div className="w-[80%] flex flex-col items-center gap-2 relative z-10">
          {headingText ? (
            <p className="text-white text-[11px] font-bold text-center leading-tight drop-shadow-sm line-clamp-3 px-1">
              {headingText}
            </p>
          ) : (
            <>
              <div className="w-[50%] h-1.5 rounded-full bg-white/30" />
              <div className="w-[80%] h-3 rounded-full bg-white/50" />
              <div className="w-[60%] h-1.5 rounded-full bg-white/25" />
            </>
          )}
        </div>
        {/* Category badge — brass plate style */}
        {category && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded brass-plate text-[9px] capitalize">
            {category}
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm border border-[#D4A537]/40">
            Use Template
          </span>
        </div>
      </div>
      {/* Name */}
      <div className="px-3 py-2.5 bg-[#3A3B3D]">
        <p className="text-sm font-semibold text-[#E2DDD5] truncate">{name}</p>
        {description && (
          <p className="text-[10px] text-[#8A8580] mt-0.5 truncate">{description}</p>
        )}
      </div>
    </button>
  );
}

/* ─────────── Project Card ─────────── */
function ProjectCard({
  project,
  onClick,
  onDelete,
  onDuplicate,
}: {
  project: Project;
  onClick: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const confirmRef = useRef<HTMLDivElement>(null);

  // Close confirm popup on outside click
  useEffect(() => {
    if (!confirmDelete) return;
    const handler = (e: MouseEvent) => {
      if (confirmRef.current && !confirmRef.current.contains(e.target as Node)) {
        setConfirmDelete(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [confirmDelete]);

  // Parse first slide background for card preview
  let bgPreview = "linear-gradient(135deg, #433B2B, #08080A)";
  try {
    const slides = JSON.parse(project.slides);
    if (slides[0]) {
      bgPreview = slides[0].backgroundGradient || slides[0].backgroundColor || bgPreview;
    }
  } catch { /* ignore */ }

  const updatedDate = new Date(project.updatedAt);
  const timeAgo = getTimeAgo(updatedDate);

  return (
    <div
      className="group relative rounded-xl overflow-hidden border border-[#3a3a3a] hover:border-[#D4A537]/60 hover:shadow-lg hover:shadow-[#D4A537]/10 transition-all cursor-pointer"
      onClick={onClick}
      data-testid={`project-card-${project.id}`}
    >
      {/* Preview */}
      <div
        className="aspect-[4/5] w-full flex flex-col items-center justify-center p-4 relative"
        style={{ background: bgPreview }}
      >
        {/* Mini slide lines */}
        <div className="w-[80%] flex flex-col items-center gap-2">
          <div className="w-[50%] h-1.5 rounded-full bg-white/30" />
          <div className="w-[80%] h-3 rounded-full bg-white/50" />
          <div className="w-[60%] h-1.5 rounded-full bg-white/25" />
        </div>
        {/* Slide count badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded brass-plate text-[9px]">
          {(() => { try { return JSON.parse(project.slides).length; } catch { return 0; } })()} slides
        </div>

        {/* Action buttons on hover */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Duplicate button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="w-7 h-7 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-[#D4A537]/80 backdrop-blur-sm transition-colors"
            data-testid={`duplicate-project-${project.id}`}
            title="Duplicate project"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete button with confirmation */}
          <div className="relative" ref={confirmDelete ? confirmRef : undefined}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(true);
              }}
              className="w-7 h-7 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-red-500/80 backdrop-blur-sm transition-colors"
              data-testid={`delete-project-${project.id}`}
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            {confirmDelete && (
              <div
                className="absolute top-9 right-0 z-50 bg-[#2D2E30] border border-[#4A4B4D] rounded-xl shadow-xl p-3 w-44 flex flex-col gap-2"
                onClick={(e) => e.stopPropagation()}
                data-testid={`delete-project-confirm-popup-${project.id}`}
              >
                <p className="text-xs font-medium text-[#E2DDD5] text-center">Delete this project?</p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                    className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-[#3A3B3D] text-[#8A8580] hover:text-[#E2DDD5] hover:bg-[#464849] transition-colors"
                    data-testid={`delete-project-cancel-${project.id}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); setConfirmDelete(false); }}
                    className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                    data-testid={`delete-project-confirm-${project.id}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Info */}
      <div className="px-3 py-2.5 bg-[#3A3B3D]">
        <p className="text-sm font-semibold text-[#E2DDD5] truncate">{project.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-[#8A8580]">{project.width}×{project.height}</span>
          <span className="text-[#555]">·</span>
          <span className="text-[10px] text-[#8A8580]">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

/* ─────────── Main Dashboard ─────────── */
export default function HomeDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [templateTab, setTemplateTab] = useState<"built-in" | "custom">("built-in");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [helpOpen, setHelpOpen] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

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

  // Fetch user projects
  const { data: userProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Fetch built-in templates from DB
  const { data: builtInDbTemplates = [] } = useQuery<Project[]>({
    queryKey: ["/api/templates/built-in"],
  });

  // Fetch custom templates
  const { data: customTemplates = [] } = useQuery<Project[]>({
    queryKey: ["/api/templates/custom"],
  });

  // Seed built-in templates on first load if Supabase DB is empty
  const seedingRef = useRef(false);
  useEffect(() => {
    if (seedingRef.current) return;
    if (builtInDbTemplates.length > 0) return;
    seedingRef.current = true;
    (async () => {
      try {
        // Double-check via count endpoint to avoid race conditions
        const countRes = await apiRequest("GET", "/api/templates/built-in-count");
        const { count } = await countRes.json();
        if (count > 0) {
          queryClient.invalidateQueries({ queryKey: ["/api/templates/built-in"] });
          return;
        }
        // Seed all built-in templates into Supabase
        for (const tmpl of BUILT_IN_TEMPLATES) {
          const now = new Date().toISOString();
          await apiRequest("POST", "/api/projects", {
            name: tmpl.name,
            platform: tmpl.project.platform,
            width: tmpl.project.width,
            height: tmpl.project.height,
            slides: JSON.stringify(tmpl.project.slides),
            globalStyles: JSON.stringify(tmpl.project.globalStyles),
            isTemplate: 1,
            isBuiltIn: 1,
            templateCategory: tmpl.templateCategory,
            createdAt: now,
            updatedAt: now,
          });
        }
        queryClient.invalidateQueries({ queryKey: ["/api/templates/built-in"] });
      } catch (err) {
        console.error("Failed to seed templates:", err);
        seedingRef.current = false;
      }
    })();
  }, [builtInDbTemplates.length]);

  // Clone template into new project
  const cloneMutation = useMutation({
    mutationFn: async (templateId: number) => {
      const res = await apiRequest("POST", `/api/templates/${templateId}/clone`, {});
      return res.json();
    },
    onSuccess: (newProject: Project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      navigate(`/editor/${newProject.id}`);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create project from template", variant: "destructive" });
    },
  });

  // Use a built-in template (from client-side data — create project directly)
  const useBuiltInTemplate = async (tmpl: typeof BUILT_IN_TEMPLATES[0]) => {
    const dbMatch = builtInDbTemplates.find(t => t.name === tmpl.name);
    if (dbMatch) {
      cloneMutation.mutate(dbMatch.id);
    } else {
      try {
        const now = new Date().toISOString();
        const res = await apiRequest("POST", "/api/projects", {
          name: tmpl.name,
          platform: tmpl.project.platform,
          width: tmpl.project.width,
          height: tmpl.project.height,
          slides: JSON.stringify(tmpl.project.slides),
          globalStyles: JSON.stringify(tmpl.project.globalStyles),
          isTemplate: 0,
          isBuiltIn: 0,
          createdAt: now,
          updatedAt: now,
        });
        const newProject = await res.json();
        queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
        navigate(`/editor/${newProject.id}`);
      } catch {
        toast({ title: "Error", description: "Failed to create project", variant: "destructive" });
      }
    }
  };

  // Delete project
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Deleted", description: "Project removed" });
    },
  });

  // Duplicate project
  const duplicateMutation = useMutation({
    mutationFn: async (project: Project) => {
      const now = new Date().toISOString();
      const res = await apiRequest("POST", "/api/projects", {
        name: `${project.name} (Copy)`,
        platform: project.platform,
        width: project.width,
        height: project.height,
        slides: project.slides,
        globalStyles: project.globalStyles,
        isTemplate: 0,
        isBuiltIn: 0,
        createdAt: now,
        updatedAt: now,
      });
      return res.json();
    },
    onSuccess: (newProject: Project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      navigate(`/editor/${newProject.id}`);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to duplicate project", variant: "destructive" });
    },
  });

  // Create blank project
  const handleNewProject = async () => {
    navigate("/editor/new");
  };

  // Filter templates by search
  const filteredBuiltIn = BUILT_IN_TEMPLATES.filter(t => {
    const matchesSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || t.templateCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredCustom = customTemplates.filter(t => {
    return !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const displayedProjects = showAllProjects ? userProjects : userProjects.slice(0, 5);
  const categories = ["all", "educational", "story", "interactive", "platform"];

  return (
    <div className="min-h-screen bg-[#464849] stone-texture" data-testid="home-dashboard">
      {/* Header — dark slate bar with gold accent */}
      <header className="border-b border-[#333] bg-[#2D2E30] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg brass-plate flex items-center justify-center text-sm font-black tracking-tight">
              C
            </div>
            <span className="text-base font-bold text-gold-metallic">Carousel Maker</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setHelpOpen(true)}
              className="gap-1.5 text-[#8A8580] hover:text-[#D4A537] hover:bg-[#3A3B3D]"
              data-testid="dashboard-help-button"
              title="Help (press ?)"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleNewProject}
              size="sm"
              className="gap-1.5 bg-[#D4A537] hover:bg-[#C49A3C] text-[#08080A] font-bold border border-[#B8944F] shadow-md"
              data-testid="new-project-btn"
            >
              <Plus className="w-4 h-4" />
              New Carousel
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Welcome — chrome/metallic heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-chrome tracking-tight">
            Welcome back. How would you like to start?
          </h1>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              onClick={handleNewProject}
              variant="outline"
              className="gap-2 rounded-full px-5 border-[#D4A537]/40 text-[#D4A537] hover:bg-[#D4A537]/10 hover:text-[#D4A537] hover:border-[#D4A537]/60"
              data-testid="start-blank-btn"
            >
              <Plus className="w-4 h-4" />
              Blank Carousel
            </Button>
            <Button
              onClick={() => {
                setTemplateTab("built-in");
                document.getElementById("templates-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              variant="outline"
              className="gap-2 rounded-full px-5 border-[#D4A537]/40 text-[#D4A537] hover:bg-[#D4A537]/10 hover:text-[#D4A537] hover:border-[#D4A537]/60"
              data-testid="browse-templates-btn"
            >
              <BookTemplate className="w-4 h-4" />
              Browse Templates
            </Button>
          </div>
        </div>

        {/* Recent Projects */}
        {userProjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#E2DDD5] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4A537]" />
                Recent Projects
              </h2>
              {userProjects.length > 5 && (
                <button
                  onClick={() => setShowAllProjects((prev) => !prev)}
                  className="text-xs font-medium text-[#D4A537]/70 hover:text-[#D4A537] flex items-center gap-1 transition-colors"
                  data-testid="view-all-projects"
                >
                  {showAllProjects ? "Show Less" : `View All (${userProjects.length})`}
                  <ChevronRight className={cn("w-3 h-3 transition-transform", showAllProjects && "rotate-90")} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/editor/${project.id}`)}
                  onDelete={() => deleteMutation.mutate(project.id)}
                  onDuplicate={() => duplicateMutation.mutate(project)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Templates Section */}
        <section id="templates-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#E2DDD5] flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#D4A537]" />
              Templates
            </h2>
          </div>

          {/* Tab bar: Built-In / Custom */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex gap-1 bg-[#333435] rounded-lg p-1 border border-[#444]">
              <button
                onClick={() => setTemplateTab("built-in")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                  templateTab === "built-in"
                    ? "bg-[#D4A537] text-[#08080A] shadow-sm font-bold"
                    : "text-[#8A8580] hover:text-[#E2DDD5]"
                )}
                data-testid="tab-built-in"
              >
                <Star className="w-3.5 h-3.5" />
                Built-In
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-semibold",
                  templateTab === "built-in" ? "bg-[#08080A]/20" : "bg-[#555] text-[#aaa]"
                )}>
                  {BUILT_IN_TEMPLATES.length}
                </span>
              </button>
              <button
                onClick={() => setTemplateTab("custom")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                  templateTab === "custom"
                    ? "bg-[#D4A537] text-[#08080A] shadow-sm font-bold"
                    : "text-[#8A8580] hover:text-[#E2DDD5]"
                )}
                data-testid="tab-custom"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                My Templates
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-semibold",
                  templateTab === "custom" ? "bg-[#08080A]/20" : "bg-[#555] text-[#aaa]"
                )}>
                  {customTemplates.length}
                </span>
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8580]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="pl-9 h-9 text-sm bg-[#333435] border-[#444] text-[#E2DDD5] placeholder:text-[#666] focus:border-[#D4A537]/60 focus:ring-[#D4A537]/20"
                data-testid="template-search"
              />
            </div>
          </div>

          {/* Category filter (built-in only) */}
          {templateTab === "built-in" && (
            <div className="flex gap-1.5 mb-5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize",
                    categoryFilter === cat
                      ? "brass-plate"
                      : "bg-[#3A3B3D] text-[#8A8580] hover:text-[#E2DDD5] hover:bg-[#444] border border-[#555]"
                  )}
                  data-testid={`filter-${cat}`}
                >
                  {cat === "all" ? "All Templates" : cat}
                </button>
              ))}
            </div>
          )}

          {/* Template Grid */}
          {templateTab === "built-in" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" data-testid="built-in-grid">
              {filteredBuiltIn.map((tmpl) => {
                // Extract heading text from first slide
                let headingText: string | undefined;
                try {
                  const firstSlide = tmpl.project.slides?.[0];
                  if (firstSlide?.elements) {
                    const headingEl = firstSlide.elements.find(
                      (el: any) => el.type === "heading" || el.type === "title" || el.type === "subtitle"
                    );
                    if (headingEl?.content) headingText = headingEl.content;
                  }
                } catch { /* ignore */ }

                return (
                  <TemplateCard
                    key={tmpl.name}
                    name={tmpl.name}
                    description={tmpl.description}
                    gradient={tmpl.backgroundGradient}
                    category={tmpl.templateCategory}
                    headingText={headingText}
                    onClick={() => useBuiltInTemplate(tmpl)}
                  />
                );
              })}
              {filteredBuiltIn.length === 0 && (
                <div className="col-span-full py-16 text-center text-[#8A8580]">
                  <p className="text-sm">No templates match your search</p>
                </div>
              )}
            </div>
          )}

          {templateTab === "custom" && (
            <div>
              {filteredCustom.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#8A8580]">
                  <BookTemplate className="w-12 h-12 mb-3 opacity-40" />
                  <p className="text-sm font-medium">No custom templates yet</p>
                  <p className="text-xs mt-1">Save a project as a template to reuse it here</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" data-testid="custom-grid">
                  {filteredCustom.map((tmpl) => {
                    let bg = "linear-gradient(135deg, #433B2B, #08080A)";
                    let headingText: string | undefined;
                    try {
                      const slides = JSON.parse(tmpl.slides);
                      if (slides[0]) {
                        bg = slides[0].backgroundGradient || slides[0].backgroundColor || bg;
                        const headingEl = slides[0].elements?.find(
                          (el: any) => el.type === "heading" || el.type === "title" || el.type === "subtitle"
                        );
                        if (headingEl?.content) headingText = headingEl.content;
                      }
                    } catch { /* ignore */ }
                    return (
                      <TemplateCard
                        key={tmpl.id}
                        name={tmpl.name}
                        gradient={bg}
                        category={tmpl.templateCategory || undefined}
                        headingText={headingText}
                        onClick={() => cloneMutation.mutate(tmpl.id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Help Modal */}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
}
