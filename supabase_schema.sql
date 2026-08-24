-- ==============================================================================
-- Supabase Schema for Kanban Board Web Application
-- ==============================================================================

-- 1. สร้าง ENUM types สำหรับตัวเลือกต่างๆ ที่ใช้ใน Typescript
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.ai_agent_status AS ENUM ('idle', 'thinking', 'working', 'done', 'failed');
CREATE TYPE public.ai_agent_type AS ENUM ('summarizer', 'researcher', 'coder', 'reviewer', 'tester');
CREATE TYPE public.chat_role AS ENUM ('user', 'assistant');


-- 2. ตาราง Columns
-- อิงตาม `interface Column`
CREATE TABLE public.columns (
  id TEXT PRIMARY KEY, -- ใช้ TEXT แทน UUID เพื่อรองรับ id แบบ 'todo', 'in-progress' ตามที่ระบบใช้อยู่
  title TEXT NOT NULL,
  color TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0, -- ใช้สำหรับเรียงลำดับคอลัมน์จากซ้ายไปขวา
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 3. ตาราง Cards
-- อิงตาม `interface Card`
CREATE TABLE public.cards (
  id TEXT PRIMARY KEY, -- รองรับ id แบบ 'card-1', 'card-2' ฯลฯ
  column_id TEXT NOT NULL REFERENCES public.columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  priority public.priority_level DEFAULT 'medium',
  tags TEXT[] DEFAULT '{}',
  assignees TEXT[] DEFAULT '{}',
  position INTEGER NOT NULL DEFAULT 0, -- ใช้สำหรับเรียงลำดับการ์ดในแต่ละคอลัมน์
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 4. ตาราง AI Agents
-- อิงตาม `interface AIAgent`
CREATE TABLE public.ai_agents (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type public.ai_agent_type NOT NULL,
  status public.ai_agent_status DEFAULT 'idle',
  status_message TEXT,
  result TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);


-- 5. ตาราง Chat Messages
-- อิงตาม `interface ChatMessage`
CREATE TABLE public.chat_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  card_id TEXT NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  role public.chat_role NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- ตั้งค่า Row Level Security (RLS)
-- อนุญาตให้อ่านและเขียนได้อย่างอิสระเพื่อความสะดวกในการพัฒนา (สำหรับ Production ควรเพิ่มการตรวจสอบ User)
-- ==============================================================================

ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write access for columns" ON public.columns FOR ALL USING (true);
CREATE POLICY "Allow public read/write access for cards" ON public.cards FOR ALL USING (true);
CREATE POLICY "Allow public read/write access for ai_agents" ON public.ai_agents FOR ALL USING (true);
CREATE POLICY "Allow public read/write access for chat_messages" ON public.chat_messages FOR ALL USING (true);


-- ==============================================================================
-- Function & Trigger สำหรับอัปเดต updated_at อัตโนมัติเมื่อแก้ไข Card
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cards_updated_at
    BEFORE UPDATE ON public.cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
