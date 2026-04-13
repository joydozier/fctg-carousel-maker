import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://aqlfpydnzeoptdpzjxdb.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbGZweWRuemVvcHRkcHpqeGRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODY3NzYxNywiZXhwIjoyMDg0MjUzNjE3fQ.BBGMwY8Yr7Xr1cJnI3EYff4wgawVsSblqcFr2tONh40";

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
