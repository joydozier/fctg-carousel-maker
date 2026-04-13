import { supabase } from "./supabase";

/**
 * Seed FCTG brand palettes into Supabase if they don't already exist.
 * Called once on server startup.
 */
export async function seedPalettes(): Promise<void> {
  // Check if built-in palettes already exist
  const { count, error: countErr } = await supabase
    .from("carousel_palettes")
    .select("*", { count: "exact", head: true })
    .eq("is_built_in", true);

  if (countErr) {
    console.error("Failed to check palette count:", countErr.message);
    return;
  }

  if ((count || 0) > 0) {
    console.log(`[seed] ${count} built-in palettes already exist — skipping`);
    return;
  }

  const palettes = [
    // ── FCTG Primary Colors (from brand doc Table 1) ──
    { name: "FCTG Primary", colors: ["#433B2B", "#D4A537", "#FDFBF7", "#08080A"], is_built_in: true },
    { name: "FCTG Dark", colors: ["#08080A", "#D4A537", "#FDFBF7", "#433B2B"], is_built_in: true },
    { name: "FCTG Cream", colors: ["#FDFBF7", "#433B2B", "#606060", "#08080A"], is_built_in: true },
    { name: "FCTG Gold + Obsidian", colors: ["#08080A", "#D4A537", "#B8944F", "#FDFBF7"], is_built_in: true },
    { name: "FCTG CTA Orange", colors: ["#08080A", "#E76F21", "#D4A537", "#FDFBF7"], is_built_in: true },
    { name: "FCTG Emerald", colors: ["#043927", "#D4A537", "#FDFBF7", "#08080A"], is_built_in: true },
    { name: "FCTG Slate", colors: ["#606060", "#D4A537", "#FDFBF7", "#433B2B"], is_built_in: true },
    // ── FCTG Secondary: Gold Family (Table 2) ──
    { name: "Gold Family", colors: ["#D4AF37", "#C49A3C", "#B8944F", "#F0D78C", "#FDF5E2", "#FDF8EC", "#DBB68C"], is_built_in: true },
    // ── FCTG Secondary: Neutral Family (Table 3) ──
    { name: "Neutral Family", colors: ["#FFFFFF", "#F5F5F5", "#FFFBF0", "#F3F3F3", "#2D2D2D"], is_built_in: true },
    // ── FCTG Secondary: Accent Colors (Table 4) ──
    { name: "Accent Colors", colors: ["#CC5500", "#065238", "#614536", "#FF6B6B", "#B8860B", "#3F494A"], is_built_in: true },
  ];

  const { error: insertErr } = await supabase
    .from("carousel_palettes")
    .insert(palettes);

  if (insertErr) {
    console.error("Failed to seed palettes:", insertErr.message);
  } else {
    console.log(`[seed] Inserted ${palettes.length} built-in FCTG palettes`);
  }
}
