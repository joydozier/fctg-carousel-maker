import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";

const sqlite = new Database("carousel.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    platform TEXT NOT NULL DEFAULT 'instagram',
    width INTEGER NOT NULL DEFAULT 1080,
    height INTEGER NOT NULL DEFAULT 1080,
    slides TEXT NOT NULL DEFAULT '[]',
    global_styles TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS color_palettes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    colors TEXT NOT NULL,
    is_built_in INTEGER NOT NULL DEFAULT 0
  );
`);

// Seed built-in FCTG palettes if empty
const existingPalettes = sqlite.prepare("SELECT COUNT(*) as count FROM color_palettes WHERE is_built_in = 1").get() as any;
if (existingPalettes.count === 0) {
  const seedPalettes = [
    { name: "FCTG Primary", colors: JSON.stringify(["#433B2B", "#D4A537", "#FDFBF7", "#08080A"]), isBuiltIn: 1 },
    { name: "FCTG Gold", colors: JSON.stringify(["#B8944F", "#D4A537", "#433B2B", "#FDFBF7"]), isBuiltIn: 1 },
    { name: "FCTG Dark", colors: JSON.stringify(["#08080A", "#433B2B", "#D4A537", "#FDFBF7"]), isBuiltIn: 1 },
    { name: "FCTG Cream", colors: JSON.stringify(["#FDFBF7", "#433B2B", "#D4A537", "#08080A"]), isBuiltIn: 1 },
    { name: "Vibrant Contrasts", colors: JSON.stringify(["#1a1a2e", "#e94560", "#0f3460", "#16213e"]), isBuiltIn: 1 },
    { name: "Earthy Tones", colors: JSON.stringify(["#5c4033", "#d4a373", "#fefae0", "#ccd5ae"]), isBuiltIn: 1 },
    { name: "Cool Blues", colors: JSON.stringify(["#023e8a", "#0077b6", "#90e0ef", "#caf0f8"]), isBuiltIn: 1 },
    { name: "Warm Sunsets", colors: JSON.stringify(["#f94144", "#f3722c", "#f9c74f", "#90be6d"]), isBuiltIn: 1 },
    { name: "Soft Pastels", colors: JSON.stringify(["#ffcdb2", "#ffb4a2", "#e5989b", "#b5838d"]), isBuiltIn: 1 },
    { name: "Monochrome Gray", colors: JSON.stringify(["#212529", "#495057", "#adb5bd", "#f8f9fa"]), isBuiltIn: 1 },
    { name: "Nature Inspired", colors: JSON.stringify(["#2d6a4f", "#52b788", "#b7e4c7", "#d8f3dc"]), isBuiltIn: 1 },
    { name: "Royal Purple", colors: JSON.stringify(["#240046", "#7b2cbf", "#c77dff", "#e0aaff"]), isBuiltIn: 1 },
  ];
  const stmt = sqlite.prepare("INSERT INTO color_palettes (name, colors, is_built_in) VALUES (?, ?, ?)");
  for (const p of seedPalettes) {
    stmt.run(p.name, p.colors, p.isBuiltIn);
  }
}
