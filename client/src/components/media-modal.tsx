import { useState, useRef } from "react";
import { X, Upload, Search, Image, Star, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Built-in gradient backgrounds (CSS gradients as data URLs) ─── */
const GRADIENT_BACKGROUNDS = [
  // Row 1 — Greens / Teals
  "linear-gradient(135deg, #0f9b8e 0%, #0b3866 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "linear-gradient(135deg, #0cebeb 0%, #20e3b2 50%, #29ffc6 100%)",
  "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
  // Row 2 — Purples / Magentas
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
  "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  // Row 3 — Oranges / Reds
  "linear-gradient(135deg, #f12711 0%, #f5af19 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
  "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
  // Row 4 — Blues
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #0250c5 0%, #d43f8d 100%)",
  "linear-gradient(135deg, #396afc 0%, #2948ff 100%)",
  "linear-gradient(135deg, #0575e6 0%, #021b79 100%)",
  // Row 5 — Warm / Sunset
  "linear-gradient(135deg, #f83600 0%, #f9d423 100%)",
  "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
];

const RAYCAST_BACKGROUNDS = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)",
  "linear-gradient(135deg, #2d1b69 0%, #11001c 100%)",
  "linear-gradient(135deg, #1e1e2e 0%, #313244 100%)",
  "linear-gradient(135deg, #181825 0%, #302d41 50%, #575268 100%)",
  "linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #2a2a5e 100%)",
  "linear-gradient(135deg, #09090d 0%, #1a1a2e 100%)",
  "linear-gradient(135deg, #0a0a1a 0%, #2d1b4e 100%)",
  "linear-gradient(135deg, #1b1b2f 0%, #162447 50%, #1f4068 100%)",
  "linear-gradient(135deg, #16222a 0%, #3a6073 100%)",
];

const MACOS_BACKGROUNDS = [
  "linear-gradient(135deg, #1d4e89 0%, #4ecdc4 50%, #f9db6d 100%)",
  "linear-gradient(135deg, #2c3e50 0%, #fd746c 100%)",
  "linear-gradient(135deg, #e65c00 0%, #f9d423 100%)",
  "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
  "linear-gradient(135deg, #cc2b5e 0%, #753a88 100%)",
  "linear-gradient(135deg, #42275a 0%, #734b6d 100%)",
  "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)",
  "linear-gradient(135deg, #de6262 0%, #ffb88c 100%)",
  "linear-gradient(135deg, #06beb6 0%, #48b1bf 100%)",
];

const APPLE_BACKGROUNDS = [
  "linear-gradient(135deg, #ff6b6b 0%, #c44569 100%)",
  "linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)",
  "linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)",
  "linear-gradient(135deg, #ffd89b 0%, #19547b 100%)",
  "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
  "linear-gradient(135deg, #c6ffdd 0%, #fbd786 50%, #f7797d 100%)",
  "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
  "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)",
  "linear-gradient(135deg, #5433ff 0%, #20bdff 50%, #a5fecb 100%)",
];

const ILLUSTRATION_BACKGROUNDS = [
  "linear-gradient(180deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%)",
  "linear-gradient(180deg, #fdfcfb 0%, #e2d1c3 100%)",
  "linear-gradient(180deg, #a8caba 0%, #5d4157 100%)",
  "linear-gradient(180deg, #fbc2eb 0%, #a6c1ee 100%)",
  "linear-gradient(180deg, #d4fc79 0%, #96e6a1 100%)",
  "linear-gradient(180deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(180deg, #cfd9df 0%, #e2ebf0 100%)",
  "linear-gradient(180deg, #a1c4fd 0%, #c2e9fb 100%)",
  "linear-gradient(180deg, #fddb92 0%, #d1fdff 100%)",
];

const MESH_GRADIENT_BACKGROUNDS = [
  // 1 — Purple-pink-peach mesh
  "radial-gradient(at 40% 20%, #f093fb 0%, transparent 50%), radial-gradient(at 80% 0%, #fad0c4 0%, transparent 50%), radial-gradient(at 0% 50%, #ffecd2 0%, transparent 50%), linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  // 2 — Ocean-cyan-lime mesh
  "radial-gradient(at 20% 30%, #43e97b 0%, transparent 50%), radial-gradient(at 80% 70%, #38f9d7 0%, transparent 50%), radial-gradient(at 60% 10%, #4facfe 0%, transparent 40%), linear-gradient(160deg, #0575e6 0%, #00f2fe 100%)",
  // 3 — Warm sunset mesh
  "radial-gradient(at 70% 20%, #f9d423 0%, transparent 50%), radial-gradient(at 10% 80%, #f093fb 0%, transparent 45%), radial-gradient(at 90% 80%, #ff6a00 0%, transparent 40%), linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
  // 4 — Deep space mesh
  "radial-gradient(at 30% 60%, #8a2be2 0%, transparent 50%), radial-gradient(at 75% 20%, #00bfff 0%, transparent 45%), radial-gradient(at 50% 90%, #ff1493 0%, transparent 40%), linear-gradient(135deg, #0f0c29 0%, #302b63 100%)",
  // 5 — Mint-gold-coral mesh
  "radial-gradient(at 15% 25%, #84fab0 0%, transparent 50%), radial-gradient(at 85% 35%, #ffd89b 0%, transparent 45%), radial-gradient(at 50% 80%, #fc5c7d 0%, transparent 40%), linear-gradient(160deg, #a1c4fd 0%, #c2e9fb 100%)",
  // 6 — Electric blue-violet mesh
  "radial-gradient(at 25% 40%, #7f00ff 0%, transparent 50%), radial-gradient(at 80% 60%, #00c6ff 0%, transparent 45%), radial-gradient(at 55% 10%, #e100ff 0%, transparent 35%), linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)",
  // 7 — Rose-peach-lavender mesh
  "radial-gradient(at 60% 15%, #fbc2eb 0%, transparent 50%), radial-gradient(at 10% 70%, #a18cd1 0%, transparent 45%), radial-gradient(at 80% 80%, #ffecd2 0%, transparent 40%), linear-gradient(145deg, #ff9a9e 0%, #fecfef 100%)",
  // 8 — Neon teal-green-yellow mesh
  "radial-gradient(at 35% 55%, #0cebeb 0%, transparent 50%), radial-gradient(at 70% 20%, #d4fc79 0%, transparent 45%), radial-gradient(at 10% 20%, #20e3b2 0%, transparent 40%), linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  // 9 — Aurora borealis mesh
  "radial-gradient(at 50% 30%, #43e97b 0%, transparent 50%), radial-gradient(at 20% 70%, #667eea 0%, transparent 45%), radial-gradient(at 85% 65%, #f093fb 0%, transparent 40%), linear-gradient(170deg, #0f9b8e 0%, #6a11cb 100%)",
  // 10 — Golden hour mesh
  "radial-gradient(at 40% 30%, #f5af19 0%, transparent 50%), radial-gradient(at 80% 70%, #f12711 0%, transparent 45%), radial-gradient(at 5% 60%, #ffd89b 0%, transparent 40%), linear-gradient(135deg, #f83600 0%, #f9d423 100%)",
];

const TEXTURE_BACKGROUNDS = [
  // 1 — Paper texture (subtle noise)
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\") repeat, #f5f2ec",
  // 2 — Linen/fabric texture
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='1' height='4' x='0' fill='%23c8bfaf' opacity='0.4'/%3E%3Crect width='4' height='1' y='0' fill='%23b0a090' opacity='0.3'/%3E%3C/svg%3E\") repeat, #e8dfd0",
  // 3 — Concrete/stone
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E\") repeat, #c8c4bc",
  // 4 — Subtle dot grid
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='1.2' fill='%23a0a0a0' opacity='0.35'/%3E%3C/svg%3E\") repeat, #f8f8f6",
  // 5 — Fine lines
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Cline x1='0' y1='6' x2='6' y2='0' stroke='%23888' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E\") repeat, #f0ece6",
  // 6 — Cross-hatch
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cline x1='0' y1='4' x2='8' y2='4' stroke='%23999' stroke-width='0.6' opacity='0.25'/%3E%3Cline x1='4' y1='0' x2='4' y2='8' stroke='%23999' stroke-width='0.6' opacity='0.25'/%3E%3C/svg%3E\") repeat, #efe8df",
  // 7 — Subtle grain
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23g)' opacity='0.06'/%3E%3C/svg%3E\") repeat, #fafaf8",
  // 8 — Woven pattern
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Crect x='0' y='0' width='3' height='3' fill='%23d4c9b8' opacity='0.5'/%3E%3Crect x='3' y='3' width='3' height='3' fill='%23d4c9b8' opacity='0.5'/%3E%3C/svg%3E\") repeat, #e8dfd2",
  // 9 — Cork texture
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.8 0.3 0 0 0.3 0.5 0.4 0 0 0.2 0 0.2 0.1 0 0 0 0 0 0.15 0'/%3E%3C/filter%3E%3Crect width='40' height='40' filter='url(%23n)'/%3E%3C/svg%3E\") repeat, #c8a870",
  // 10 — Watercolor wash effect
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='1.5'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23w)' opacity='0.18'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
];

const ABSTRACT_BACKGROUNDS = [
  // 1 — Diagonal color blocks
  "linear-gradient(135deg, #f093fb 0% 25%, #f5576c 25% 50%, #4facfe 50% 75%, #00f2fe 75% 100%)",
  // 2 — Geometric stripes at 45deg
  "repeating-linear-gradient(45deg, #667eea 0px, #667eea 10px, #764ba2 10px, #764ba2 20px)",
  // 3 — Concentric-style radial rings
  "repeating-radial-gradient(circle at 50% 50%, #43e97b 0px, #43e97b 8px, #38f9d7 8px, #38f9d7 16px, #4facfe 16px, #4facfe 24px)",
  // 4 — Bold horizontal stripes
  "repeating-linear-gradient(0deg, #f12711 0px, #f12711 12px, #f5af19 12px, #f5af19 24px)",
  // 5 — Blob shapes (overlapping radial gradients)
  "radial-gradient(ellipse at 20% 50%, #7f00ff 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, #e100ff 0%, transparent 55%), radial-gradient(ellipse at 50% 20%, #00c6ff 0%, transparent 55%), #0a0a2e",
  // 6 — Diagonal color block split
  "linear-gradient(160deg, #f83600 0% 50%, #f9d423 50% 100%)",
  // 7 — Repeating chevrons
  "repeating-linear-gradient(120deg, #a8e063 0px, #a8e063 10px, #56ab2f 10px, #56ab2f 20px, transparent 20px, transparent 30px), repeating-linear-gradient(60deg, #a8e063 0px, #a8e063 10px, #56ab2f 10px, #56ab2f 20px, transparent 20px, transparent 30px), #1a1a1a",
  // 8 — Wave-style gradient stripes
  "repeating-linear-gradient(-45deg, #fc5c7d 0px, #fc5c7d 8px, #6a82fb 8px, #6a82fb 16px)",
  // 9 — Bold four-quadrant
  "linear-gradient(to bottom right, #c471f5 0% 50%, #fa71cd 50% 100%), linear-gradient(to top right, #f12711 0% 50%, #f5af19 50% 100%)",
  // 10 — Starburst radial
  "repeating-conic-gradient(from 0deg, #667eea 0deg 20deg, #764ba2 20deg 40deg)",
];

const DARK_MOODY_BACKGROUNDS = [
  // 1 — Dark noir
  "linear-gradient(135deg, #0a0a0a 0%, #1c1c1c 50%, #2a2a2a 100%)",
  // 2 — Deep midnight blue
  "linear-gradient(135deg, #050510 0%, #0a0a2e 50%, #10103a 100%)",
  // 3 — Dark forest green to black
  "linear-gradient(135deg, #0a1a0a 0%, #0d2b0d 50%, #162316 100%)",
  // 4 — Dark burgundy to black
  "linear-gradient(135deg, #0d0208 0%, #1a0510 50%, #2a0a18 100%)",
  // 5 — Charcoal with subtle purple
  "linear-gradient(135deg, #0f0f14 0%, #1a1a26 50%, #23202e 100%)",
  // 6 — Obsidian with gold hint
  "radial-gradient(ellipse at 70% 30%, #2a2010 0%, transparent 60%), linear-gradient(135deg, #08080a 0%, #181510 100%)",
  // 7 — Deep teal to black
  "linear-gradient(135deg, #050f0f 0%, #0a1e1e 50%, #122a2a 100%)",
  // 8 — Dark slate
  "linear-gradient(135deg, #0c0e12 0%, #141820 50%, #1e2430 100%)",
  // 9 — Black with subtle warm undertone
  "linear-gradient(135deg, #0c0a08 0%, #1a1610 50%, #24200a 100%)",
  // 10 — Deep indigo to black
  "linear-gradient(135deg, #050510 0%, #0f0a28 50%, #1a1040 100%)",
];

const FCTG_BRAND_BACKGROUNDS = [
  // ── PRIMARY PALETTE ──
  // 1 — Dark Rum to Obsidian
  "linear-gradient(135deg, #433B2B 0%, #08080A 100%)",
  // 2 — Gold to Warm Gold
  "linear-gradient(135deg, #D4A537 0%, #B8944F 100%)",
  // 3 — Cream with subtle gold accent
  "radial-gradient(ellipse at 80% 20%, #D4A537 0%, transparent 40%), linear-gradient(135deg, #FDFBF7 0%, #F5EFE0 100%)",
  // 4 — Obsidian with gold radial glow
  "radial-gradient(ellipse at 50% 50%, #433B2B 0%, transparent 55%), linear-gradient(135deg, #08080A 0%, #08080A 100%)",
  // 5 — Orange CTA to Gold
  "linear-gradient(135deg, #E76F21 0%, #D4A537 100%)",
  // 6 — Emerald to Dark Rum
  "linear-gradient(135deg, #043927 0%, #433B2B 100%)",
  // 7 — Slate Gray to Obsidian
  "linear-gradient(135deg, #606060 0%, #08080A 100%)",
  // 8 — Weathered Gold gradient
  "linear-gradient(135deg, #B8944F 0%, #D4A537 20%, #FDF5E2 45%, #FFFFFF 50%, #FDF5E2 55%, #D4A537 80%, #B8944F 100%)",
  // 9 — Animated-style Gold Glint
  "linear-gradient(90deg, #C49A3C 0%, #D4A537 25%, #FFFFFF 50%, #D4A537 75%, #C49A3C 100%)",
  // 10 — Cream to white
  "linear-gradient(135deg, #FDFBF7 0%, #FFFFFF 100%)",
  // ── GOLD FAMILY ──
  // 11 — Full gold family sweep
  "linear-gradient(135deg, #D4AF37 0%, #C49A3C 16%, #B8944F 33%, #F0D78C 50%, #FDF5E2 66%, #FDF8EC 83%, #DBB68C 100%)",
  // 12 — Dark gold to light cream
  "linear-gradient(180deg, #B8944F 0%, #F0D78C 50%, #FDF8EC 100%)",
  // ── NEUTRALS ──
  // 13 — Warm cream gradient
  "linear-gradient(135deg, #FFFBF0 0%, #F3F3F3 50%, #F5F5F5 100%)",
  // 14 — Charcoal to soft white
  "linear-gradient(135deg, #2D2D2D 0%, #F5F5F5 100%)",
  // ── ACCENT COMBOS ──
  // 15 — Burnt Orange to Coral Red
  "linear-gradient(135deg, #CC5500 0%, #FF6B6B 100%)",
  // 16 — Deep Emerald to Sage Green
  "linear-gradient(135deg, #065238 0%, #3F494A 100%)",
  // 17 — Dark Leather to Dark Gold
  "linear-gradient(135deg, #614536 0%, #B8860B 100%)",
  // 18 — Obsidian with Emerald & Gold accents
  "radial-gradient(ellipse at 25% 75%, #043927 0%, transparent 45%), radial-gradient(ellipse at 75% 25%, #D4A537 0%, transparent 40%), linear-gradient(135deg, #08080A 0%, #08080A 100%)",
  // 19 — Dark Rum with stone texture
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\") repeat, #433B2B",
  // 20 — Cream with Dark Rum accent stripe
  "linear-gradient(135deg, #FDFBF7 0% 70%, #433B2B 70% 100%)",
];

const MARBLE_BACKGROUNDS = [
  // 1 — White Carrara marble
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='4' seed='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.92 0 0 0 0 0.90 0 0 0 0 0.88 0 0 0 18 -7'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23m)'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #f8f6f0 0%, #e8e4dc 100%)",
  // 2 — Dark Emperador marble
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.018' numOctaves='4' seed='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.42 0 0 0 0 0.28 0 0 0 0 0.18 0 0 0 20 -8'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23m)'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #3a2218 0%, #5c3a24 100%)",
  // 3 — Green marble
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='5' seed='8' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.22 0 0 0 0 0.45 0 0 0 0 0.28 0 0 0 16 -6'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23m)'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #1a3d22 0%, #2e5c38 100%)",
  // 4 — Pink marble
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.013' numOctaves='4' seed='12' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.95 0 0 0 0 0.75 0 0 0 0 0.78 0 0 0 15 -5'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23m)'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #f2c4c4 0%, #e8a0a0 100%)",
  // 5 — Black marble with gold veins
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.022' numOctaves='3' seed='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.85 0 0 0 0 0.70 0 0 0 0 0.10 0 0 0 22 -10'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23m)' opacity='0.6'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
  // 6 — Blue-gray marble
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.014' numOctaves='4' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.55 0 0 0 0 0.62 0 0 0 0 0.72 0 0 0 18 -7'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23m)'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #6a7d8e 0%, #8fa0b0 100%)",
  // 7 — Cream/onyx marble
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.016' numOctaves='5' seed='15' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.92 0 0 0 0 0.85 0 0 0 0 0.68 0 0 0 17 -6'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23m)'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #f5e6c8 0%, #e8d4a8 100%)",
  // 8 — Rose gold marble
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.011' numOctaves='4' seed='20' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.88 0 0 0 0 0.62 0 0 0 0 0.58 0 0 0 16 -5'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23m)'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #c9806a 0%, #dda090 100%)",
  // 9 — Charcoal marble
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.019' numOctaves='4' seed='9' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.38 0 0 0 0 0.38 0 0 0 0 0.40 0 0 0 19 -8'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23m)'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #3a3a3e 0%, #52525a 100%)",
  // 10 — Emerald marble
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.017' numOctaves='5' seed='11' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.08 0 0 0 0 0.48 0 0 0 0 0.32 0 0 0 20 -9'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23m)'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #064e30 0%, #0a6e42 100%)",
];

const WOOD_BACKGROUNDS = [
  // 1 — Light Oak
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005 0.08' numOctaves='3' seed='1' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.75 0 0 0 0 0.55 0 0 0 0 0.28 0 0 0 8 -2'/%3E%3C/filter%3E%3Crect width='400' height='200' filter='url(%23w)' opacity='0.55'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #c8a25a 0%, #b8924a 50%, #c8a25a 100%)",
  // 2 — Dark Walnut
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.004 0.09' numOctaves='3' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.32 0 0 0 0 0.20 0 0 0 0 0.10 0 0 0 9 -3'/%3E%3C/filter%3E%3Crect width='400' height='200' filter='url(%23w)' opacity='0.6'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #3d2410 0%, #4e3018 50%, #3d2410 100%)",
  // 3 — Cherry
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.006 0.07' numOctaves='3' seed='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.60 0 0 0 0 0.22 0 0 0 0 0.12 0 0 0 8 -2'/%3E%3C/filter%3E%3Crect width='400' height='200' filter='url(%23w)' opacity='0.55'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #8b2e18 0%, #a03820 50%, #8b2e18 100%)",
  // 4 — Birch
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.003 0.06' numOctaves='2' seed='9' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.90 0 0 0 0 0.82 0 0 0 0 0.68 0 0 0 7 -2'/%3E%3C/filter%3E%3Crect width='400' height='200' filter='url(%23w)' opacity='0.45'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #e8d8b0 0%, #d8c898 50%, #e8d8b0 100%)",
  // 5 — Mahogany
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005 0.085' numOctaves='3' seed='13' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.50 0 0 0 0 0.18 0 0 0 0 0.08 0 0 0 9 -3'/%3E%3C/filter%3E%3Crect width='400' height='200' filter='url(%23w)' opacity='0.6'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #6b2015 0%, #7d2a1c 50%, #6b2015 100%)",
  // 6 — Bamboo
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='200'%3E%3Crect width='20' height='200' fill='%23c8b060'/%3E%3Crect width='20' height='2' y='48' fill='%23a08840' opacity='0.7'/%3E%3Crect width='20' height='2' y='98' fill='%23a08840' opacity='0.7'/%3E%3Crect width='20' height='2' y='148' fill='%23a08840' opacity='0.7'/%3E%3Crect width='1' height='200' x='10' fill='%23a08840' opacity='0.3'/%3E%3C/svg%3E\") repeat, #c8b060",
  // 7 — Pine
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.007 0.1' numOctaves='3' seed='17' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.82 0 0 0 0 0.62 0 0 0 0 0.30 0 0 0 7 -2'/%3E%3C/filter%3E%3Crect width='400' height='200' filter='url(%23w)' opacity='0.5'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #d4a850 0%, #c09840 50%, #d4a850 100%)",
  // 8 — Teak
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.006 0.075' numOctaves='3' seed='22' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.55 0 0 0 0 0.38 0 0 0 0 0.15 0 0 0 8 -2'/%3E%3C/filter%3E%3Crect width='400' height='200' filter='url(%23w)' opacity='0.55'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #8a5c28 0%, #9e6c32 50%, #8a5c28 100%)",
  // 9 — Rosewood
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.008 0.09' numOctaves='4' seed='25' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.48 0 0 0 0 0.15 0 0 0 0 0.18 0 0 0 10 -4'/%3E%3C/filter%3E%3Crect width='400' height='200' filter='url(%23w)' opacity='0.6'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #6b1a2c 0%, #7d2038 50%, #6b1a2c 100%)",
  // 10 — Driftwood
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.004 0.065' numOctaves='3' seed='30' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.70 0 0 0 0 0.65 0 0 0 0 0.58 0 0 0 7 -2'/%3E%3C/filter%3E%3Crect width='400' height='200' filter='url(%23w)' opacity='0.45'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #a89880 0%, #b8a890 50%, #a89880 100%)",
];

const FABRIC_BACKGROUNDS = [
  // 1 — Denim
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cline x1='0' y1='0' x2='8' y2='8' stroke='%233a5a8a' stroke-width='1.2' opacity='0.4'/%3E%3Cline x1='0' y1='4' x2='4' y2='0' stroke='%234a6a9a' stroke-width='0.6' opacity='0.25'/%3E%3C/svg%3E\") repeat, #4a6fa5",
  // 2 — Burlap
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Crect width='6' height='1.5' y='0' fill='%23b8a070' opacity='0.5'/%3E%3Crect width='1.5' height='6' x='0' fill='%23c8b080' opacity='0.4'/%3E%3Crect width='6' height='1.5' y='3' fill='%23a89060' opacity='0.45'/%3E%3Crect width='1.5' height='6' x='3' fill='%23b8a070' opacity='0.35'/%3E%3C/svg%3E\") repeat, #c8a870",
  // 3 — Silk
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04 0.01' numOctaves='2' seed='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23s)' opacity='0.12'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #f8e8f0 0%, #e8d0e8 50%, #f0e0f8 100%)",
  // 4 — Canvas
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='1' y='0' fill='%23c8b898' opacity='0.55'/%3E%3Crect width='1' height='4' x='0' fill='%23b8a888' opacity='0.45'/%3E%3Crect width='4' height='1' y='2' fill='%23c0b090' opacity='0.5'/%3E%3Crect width='1' height='4' x='2' fill='%23c0b090' opacity='0.4'/%3E%3C/svg%3E\") repeat, #d8c8a8",
  // 5 — Tweed
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Crect width='3' height='3' x='0' y='0' fill='%234a4a3a' opacity='0.6'/%3E%3Crect width='3' height='3' x='3' y='3' fill='%234a4a3a' opacity='0.6'/%3E%3Crect width='3' height='3' x='3' y='0' fill='%23786848' opacity='0.5'/%3E%3Crect width='3' height='3' x='0' y='3' fill='%23786848' opacity='0.5'/%3E%3C/svg%3E\") repeat, #5a5040",
  // 6 — Velvet
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='v'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23v)' opacity='0.08'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #4a0e5c 0%, #6a1a80 100%)",
  // 7 — Lace pattern
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='7' fill='none' stroke='%23d0c0b0' stroke-width='0.8' opacity='0.5'/%3E%3Ccircle cx='10' cy='10' r='4' fill='none' stroke='%23d0c0b0' stroke-width='0.5' opacity='0.4'/%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%23d0c0b0' opacity='0.35'/%3E%3Cline x1='0' y1='10' x2='20' y2='10' stroke='%23d0c0b0' stroke-width='0.4' opacity='0.3'/%3E%3Cline x1='10' y1='0' x2='10' y2='20' stroke='%23d0c0b0' stroke-width='0.4' opacity='0.3'/%3E%3C/svg%3E\") repeat, #f5f0ea",
  // 8 — Corduroy
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4'%3E%3Crect width='4' height='4' x='0' fill='%236b5040' opacity='0.8'/%3E%3Crect width='4' height='4' x='4' fill='%235a4030' opacity='0.8'/%3E%3Crect width='8' height='0.5' y='0' fill='%234a3020' opacity='0.3'/%3E%3Crect width='8' height='0.5' y='3.5' fill='%234a3020' opacity='0.3'/%3E%3C/svg%3E\") repeat, #6b5040",
  // 9 — Knit
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='12'%3E%3Cellipse cx='4' cy='6' rx='3' ry='5' fill='none' stroke='%23c0a080' stroke-width='1.2' opacity='0.6'/%3E%3Cellipse cx='12' cy='6' rx='3' ry='5' fill='none' stroke='%23b09070' stroke-width='1.2' opacity='0.6'/%3E%3C/svg%3E\") repeat, #d4b890",
  // 10 — Leather
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='l'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='4' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.45 0 0 0 0 0.28 0 0 0 0 0.12 0 0 0 6 -2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23l)' opacity='0.3'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #7a4a28 0%, #8a5a32 100%)",
];

const GEOMETRIC_BACKGROUNDS = [
  // 1 — Hexagons
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpolygon points='28,2 54,16 54,44 28,58 2,44 2,16' fill='none' stroke='%234a90e2' stroke-width='1.5' opacity='0.4'/%3E%3Cpolygon points='28,52 54,66 54,94 28,108 2,94 2,66' fill='none' stroke='%234a90e2' stroke-width='1.5' opacity='0.4'/%3E%3Cpolygon points='0,27 2,16 2,44 0,55' fill='none' stroke='%234a90e2' stroke-width='1.5' opacity='0.4'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #1a2a4a 0%, #2a3a6a 100%)",
  // 2 — Diamonds
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect x='10' y='10' width='20' height='20' fill='none' stroke='%23e8c46a' stroke-width='1.2' opacity='0.5' transform='rotate(45 20 20)'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 100%)",
  // 3 — Triangles
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Cpolygon points='25,5 45,45 5,45' fill='none' stroke='%23e87a5a' stroke-width='1.3' opacity='0.45'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #2a1a1a 0%, #4a2a2a 100%)",
  // 4 — Chevrons
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='20'%3E%3Cpolyline points='0,10 10,0 20,10 30,0 40,10' fill='none' stroke='%2348c86a' stroke-width='1.5' opacity='0.45'/%3E%3Cpolyline points='0,20 10,10 20,20 30,10 40,20' fill='none' stroke='%2348c86a' stroke-width='1.5' opacity='0.45'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #0a2a1a 0%, #1a4a2a 100%)",
  // 5 — Herringbone
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cline x1='0' y1='10' x2='10' y2='0' stroke='%23c8a870' stroke-width='1.5' opacity='0.5'/%3E%3Cline x1='10' y1='20' x2='20' y2='10' stroke='%23c8a870' stroke-width='1.5' opacity='0.5'/%3E%3Cline x1='0' y1='10' x2='10' y2='20' stroke='%23a88850' stroke-width='1.5' opacity='0.4'/%3E%3Cline x1='10' y1='0' x2='20' y2='10' stroke='%23a88850' stroke-width='1.5' opacity='0.4'/%3E%3C/svg%3E\") repeat, #5a4028",
  // 6 — Polka dots large
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='12' fill='%23f0e0f0' opacity='0.3'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #8a3a8a 0%, #b05ab0 100%)",
  // 7 — Moroccan tiles
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20,0 L40,20 L20,40 L0,20 Z' fill='none' stroke='%23e8c46a' stroke-width='1.2' opacity='0.5'/%3E%3Cpath d='M20,8 L32,20 L20,32 L8,20 Z' fill='none' stroke='%23e8c46a' stroke-width='0.8' opacity='0.35'/%3E%3Ccircle cx='20' cy='20' r='3' fill='%23e8c46a' opacity='0.3'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #1a1006 0%, #2a2010 100%)",
  // 8 — Circles
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Ccircle cx='25' cy='25' r='20' fill='none' stroke='%2300c6ff' stroke-width='1.2' opacity='0.4'/%3E%3Ccircle cx='25' cy='25' r='10' fill='none' stroke='%2300c6ff' stroke-width='0.8' opacity='0.3'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #0a1a2a 0%, #0a2a4a 100%)",
  // 9 — Squares grid
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Crect x='2' y='2' width='26' height='26' fill='none' stroke='%23e05060' stroke-width='1' opacity='0.4'/%3E%3Crect x='8' y='8' width='14' height='14' fill='none' stroke='%23e05060' stroke-width='0.7' opacity='0.3'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #2a0a10 0%, #4a1020 100%)",
  // 10 — Zigzag
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='20'%3E%3Cpolyline points='0,0 10,20 20,0 30,20 40,0' fill='none' stroke='%23a0d8a0' stroke-width='1.5' opacity='0.5'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #0a2a0a 0%, #1a4a1a 100%)",
];

const NATURE_BACKGROUNDS = [
  // 1 — Sand
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' seed='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.85 0 0 0 0 0.75 0 0 0 0 0.50 0 0 0 6 -1'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23s)' opacity='0.4'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #d4b870 0%, #c8a858 100%)",
  // 2 — Water ripple
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.08' numOctaves='3' seed='5' stitchTiles='stitch'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='8' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%230a4a7a' opacity='0.7'/%3E%3Crect width='200' height='200' fill='%230a6aaa' filter='url(%23w)' opacity='0.5'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #0a3a6a 0%, #1a5a9a 100%)",
  // 3 — Grass/moss
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.3 0.05' numOctaves='3' seed='8' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.18 0 0 0 0 0.42 0 0 0 0 0.12 0 0 0 8 -2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.55'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #1a4a10 0%, #2a6018 100%)",
  // 4 — Rust
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='r'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.45' numOctaves='5' seed='11' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.72 0 0 0 0 0.28 0 0 0 0 0.05 0 0 0 8 -2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23r)' opacity='0.5'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #7a2a08 0%, #9a3810 100%)",
  // 5 — Stone wall
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Crect width='80' height='40' fill='%23888880'/%3E%3Crect width='38' height='18' x='1' y='1' fill='%23909088' rx='1'/%3E%3Crect width='38' height='18' x='41' y='1' fill='%23888880' rx='1'/%3E%3Crect width='38' height='18' x='21' y='21' fill='%23989090' rx='1'/%3E%3Crect width='18' height='18' x='61' y='21' fill='%23888880' rx='1'/%3E%3Crect width='18' height='18' x='1' y='21' fill='%23909088' rx='1'/%3E%3C/svg%3E\") repeat, #888880",
  // 6 — Ice crystal
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='i'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.025' numOctaves='5' seed='14' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.75 0 0 0 0 0.88 0 0 0 0 0.98 0 0 0 14 -5'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23i)' opacity='0.5'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #c8e8f8 0%, #e0f0ff 100%)",
  // 7 — Volcanic
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='v'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.55' numOctaves='4' seed='17' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.18 0 0 0 0 0.06 0 0 0 0 0.04 0 0 0 9 -3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23v)' opacity='0.55'/%3E%3C/svg%3E\") repeat, radial-gradient(ellipse at 50% 80%, #8a1a00 0%, #1a0500 100%)",
  // 8 — Clay
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.35' numOctaves='3' seed='20' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.72 0 0 0 0 0.48 0 0 0 0 0.30 0 0 0 6 -2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23c)' opacity='0.35'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #b87850 0%, #c88860 100%)",
  // 9 — Bark
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='b'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.1 0.4' numOctaves='4' seed='23' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.38 0 0 0 0 0.24 0 0 0 0 0.10 0 0 0 7 -2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23b)' opacity='0.5'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #4a2e10 0%, #5a3818 100%)",
  // 10 — Coral
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='co'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4' seed='26' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.90 0 0 0 0 0.55 0 0 0 0 0.48 0 0 0 10 -3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23co)' opacity='0.4'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #e87060 0%, #f09080 100%)",
];

const DARK_TEXTURES = [
  // 1 — Carbon fiber
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' x='0' y='0' fill='%23222222'/%3E%3Crect width='4' height='4' x='4' y='4' fill='%23222222'/%3E%3Crect width='4' height='4' x='4' y='0' fill='%231a1a1a'/%3E%3Crect width='4' height='4' x='0' y='4' fill='%231a1a1a'/%3E%3Crect width='4' height='0.5' x='0' y='3.75' fill='%23333333' opacity='0.6'/%3E%3Crect width='4' height='0.5' x='4' y='7.75' fill='%23333333' opacity='0.6'/%3E%3C/svg%3E\") repeat, #111111",
  // 2 — Brushed metal dark
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='b'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005 0.8' numOctaves='2' seed='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23b)' opacity='0.18'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #222222 100%)",
  // 3 — Dark concrete
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.85' numOctaves='4' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23c)' opacity='0.2'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #1a1a1a 0%, #141414 100%)",
  // 4 — Dark leather
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='l'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.35' numOctaves='4' seed='9' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.12 0 0 0 0 0.07 0 0 0 0 0.03 0 0 0 5 -2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23l)' opacity='0.4'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #1a0e08 0%, #120a06 100%)",
  // 5 — Dark paper
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' seed='13' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23p)' opacity='0.12'/%3E%3C/svg%3E\") repeat, #18160e",
  // 6 — Circuit board
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%230a1a0a'/%3E%3Cline x1='10' y1='0' x2='10' y2='60' stroke='%2300aa44' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='30' y1='0' x2='30' y2='60' stroke='%2300aa44' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='50' y1='0' x2='50' y2='60' stroke='%2300aa44' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='0' y1='20' x2='60' y2='20' stroke='%2300aa44' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='0' y1='40' x2='60' y2='40' stroke='%2300aa44' stroke-width='0.5' opacity='0.5'/%3E%3Ccircle cx='10' cy='20' r='2' fill='%2300cc55' opacity='0.6'/%3E%3Ccircle cx='30' cy='40' r='2' fill='%2300cc55' opacity='0.6'/%3E%3Ccircle cx='50' cy='20' r='2' fill='%2300cc55' opacity='0.6'/%3E%3Crect x='8' y='38' width='6' height='4' fill='none' stroke='%2300aa44' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E\") repeat, #0a1a0a",
  // 7 — Galaxy dust
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' seed='17' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.4 0 0 0 0 0.2 0 0 0 0 0.8 0 0 0 5 -3'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.2'/%3E%3C/svg%3E\") repeat, radial-gradient(ellipse at 30% 40%, #2a0a5a 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, #0a1a4a 0%, transparent 60%), #050510",
  // 8 — Dark wood
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.004 0.1' numOctaves='3' seed='21' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.16 0 0 0 0 0.10 0 0 0 0 0.05 0 0 0 7 -3'/%3E%3C/filter%3E%3Crect width='400' height='200' filter='url(%23w)' opacity='0.55'/%3E%3C/svg%3E\") repeat, linear-gradient(180deg, #1a0e08 0%, #120a06 50%, #1a0e08 100%)",
  // 9 — Dark mesh
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cline x1='0' y1='0' x2='20' y2='0' stroke='%23333333' stroke-width='0.8' opacity='0.7'/%3E%3Cline x1='0' y1='10' x2='20' y2='10' stroke='%23333333' stroke-width='0.8' opacity='0.7'/%3E%3Cline x1='0' y1='20' x2='20' y2='20' stroke='%23333333' stroke-width='0.8' opacity='0.7'/%3E%3Cline x1='0' y1='0' x2='0' y2='20' stroke='%23333333' stroke-width='0.8' opacity='0.7'/%3E%3Cline x1='10' y1='0' x2='10' y2='20' stroke='%23333333' stroke-width='0.8' opacity='0.7'/%3E%3Cline x1='20' y1='0' x2='20' y2='20' stroke='%23333333' stroke-width='0.8' opacity='0.7'/%3E%3C/svg%3E\") repeat, #0d0d0d",
  // 10 — Dark granite
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='gr'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.7' numOctaves='5' seed='29' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.15 0 0 0 0 0.15 0 0 0 0 0.16 0 0 0 8 -3'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23gr)' opacity='0.45'/%3E%3C/svg%3E\") repeat, linear-gradient(135deg, #111114 0%, #0d0d10 100%)",
];

const PREMIUM_CATEGORIES: { key: string; label: string; items: string[] }[] = [
  { key: "gradients", label: "Gradients", items: GRADIENT_BACKGROUNDS },
  { key: "mesh", label: "Mesh Gradients", items: MESH_GRADIENT_BACKGROUNDS },
  { key: "textures", label: "Textures", items: TEXTURE_BACKGROUNDS },
  { key: "marble", label: "Marble", items: MARBLE_BACKGROUNDS },
  { key: "wood", label: "Wood Grain", items: WOOD_BACKGROUNDS },
  { key: "fabric", label: "Fabric", items: FABRIC_BACKGROUNDS },
  { key: "geometric", label: "Geometric Patterns", items: GEOMETRIC_BACKGROUNDS },
  { key: "nature", label: "Nature Textures", items: NATURE_BACKGROUNDS },
  { key: "dark-textures", label: "Dark Textures", items: DARK_TEXTURES },
  { key: "abstract", label: "Abstract", items: ABSTRACT_BACKGROUNDS },
  { key: "dark-moody", label: "Dark Moody", items: DARK_MOODY_BACKGROUNDS },
  { key: "fctg-brand", label: "FCTG Brand", items: FCTG_BRAND_BACKGROUNDS },
  { key: "raycast", label: "Raycast", items: RAYCAST_BACKGROUNDS },
  { key: "macos", label: "MacOS", items: MACOS_BACKGROUNDS },
  { key: "apple", label: "Apple", items: APPLE_BACKGROUNDS },
  { key: "illustrations", label: "Illustrations", items: ILLUSTRATION_BACKGROUNDS },
];

/* ─── Top-level tabs ─── */
type TopTab = "premium" | "recent" | "search";

const TOP_TABS: { key: TopTab; label: string; icon: typeof Star }[] = [
  { key: "premium", label: "Premium Images", icon: Star },
  { key: "recent", label: "Recent Uploads", icon: Clock },
  { key: "search", label: "Search Images", icon: Search },
];

interface MediaModalProps {
  onSelect: (value: string) => void; // CSS gradient string or data URL
  onClose: () => void;
  recentUploads: string[];
  onUpload: (dataUrl: string) => void;
}

export function MediaModal({ onSelect, onClose, recentUploads, onUpload }: MediaModalProps) {
  const [activeTab, setActiveTab] = useState<TopTab>("premium");
  const [activeCategory, setActiveCategory] = useState("gradients");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onUpload(dataUrl);
      onSelect(dataUrl);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  const currentCategory = PREMIUM_CATEGORIES.find((c) => c.key === activeCategory);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
      data-testid="media-modal-overlay"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div
        className="relative bg-[#343536] rounded-2xl shadow-2xl w-[780px] max-w-[92vw] max-h-[85vh] overflow-hidden flex flex-col border border-[#4A4B4D]"
        onClick={(e) => e.stopPropagation()}
        data-testid="media-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2b2d]">
          <h2 className="text-lg font-semibold text-[#E2DDD5]">Background</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleUploadClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D4A537]/30 text-sm font-medium text-[#D4A537] hover:bg-[#D4A537]/10 transition-colors"
              data-testid="upload-media-btn"
            >
              <Upload className="w-4 h-4" />
              Upload Media
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#464849] transition-colors"
              data-testid="media-modal-close"
            >
              <X className="w-5 h-5 text-[#8A8580]" />
            </button>
          </div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Top Tabs */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-[#2a2b2d]">
          {TOP_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.key
                    ? "text-[#D4A537] bg-[#3A3B3D] border border-[#D4A537]/20"
                    : "text-[#8A8580] hover:text-[#D4A537] hover:bg-[#3A3B3D]/60"
                )}
                data-testid={`media-tab-${tab.key}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Premium Images */}
          {activeTab === "premium" && (
            <div className="space-y-4">
              {/* Sub-category tabs */}
              <div className="flex gap-1 flex-wrap">
                {PREMIUM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      activeCategory === cat.key
                        ? "bg-[#D4A537] text-[#08080A] font-semibold"
                        : "text-[#8A8580] hover:bg-[#3A3B3D] hover:text-[#E2DDD5]"
                    )}
                    data-testid={`media-category-${cat.key}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Image grid */}
              {currentCategory && (
                <div className="grid grid-cols-5 gap-3" data-testid="media-grid">
                  {currentCategory.items.map((gradient, index) => (
                    <button
                      key={`${currentCategory.key}-${index}`}
                      onClick={() => onSelect(gradient)}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all hover:scale-[1.03] active:scale-[0.98]"
                      style={{ background: gradient }}
                      data-testid={`media-item-${index}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Uploads */}
          {activeTab === "recent" && (
            <div>
              {recentUploads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#8A8580]">
                  <Clock className="w-12 h-12 mb-3 opacity-40" />
                  <p className="text-sm font-medium">No recent uploads</p>
                  <p className="text-xs mt-1">Upload an image to see it here</p>
                  <button
                    onClick={handleUploadClick}
                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A537] text-[#08080A] text-sm font-semibold hover:bg-[#C49A3C] transition-colors"
                    data-testid="recent-upload-btn"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-3" data-testid="recent-grid">
                  {recentUploads.map((dataUrl, index) => (
                    <button
                      key={index}
                      onClick={() => onSelect(dataUrl)}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all hover:scale-[1.03] active:scale-[0.98]"
                      data-testid={`recent-item-${index}`}
                    >
                      <img src={dataUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search Images */}
          {activeTab === "search" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8580]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for images..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#4A4B4D] bg-[#2D2E30] text-sm text-[#E2DDD5] placeholder-[#8A8580] focus:outline-none focus:ring-2 focus:ring-[#D4A537]/30 focus:border-[#D4A537]"
                  data-testid="media-search-input"
                />
              </div>
              {/* Search results placeholder */}
              <div className="flex flex-col items-center justify-center py-12 text-[#8A8580]">
                <Search className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-sm font-medium">Search for background images</p>
                <p className="text-xs mt-1">Type a keyword above to find images</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
