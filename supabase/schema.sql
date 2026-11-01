-- ============================================================
-- PORTFOLIO DATABASE SCHEMA - SAMEER SHAIK
-- Tech Stack: Next.js + Supabase PostgreSQL
-- Admin Email: shaiksameer092526@gmail.com
-- ============================================================

-- 0. Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Settings (Single row configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT NOT NULL DEFAULT 'Sameer Shaik | Full-Stack Developer',
  site_description TEXT NOT NULL DEFAULT 'Full-Stack Developer specializing in React, Node.js, Express, MongoDB, SQL, and modern responsive web applications.',
  logo_type TEXT NOT NULL DEFAULT 'text', -- 'text' or 'image'
  logo_text TEXT NOT NULL DEFAULT 'Sameer.dev',
  logo_image_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  accent_color TEXT NOT NULL DEFAULT 'indigo', -- indigo, emerald, violet, cyan, rose, amber
  font_family TEXT NOT NULL DEFAULT 'sans',
  sections_visibility JSONB NOT NULL DEFAULT '{
    "hero": true,
    "about": true,
    "skills": true,
    "projects": true,
    "experience": true,
    "testimonials": true,
    "contact": true
  }'::JSONB,
  seo_keywords TEXT[] DEFAULT ARRAY['Sameer Shaik', 'Full-Stack Developer', 'React Developer', 'Node.js', 'SRM University AP', 'Portfolio', 'Web Developer India'],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profile Details (Hero & About content, Resume)
CREATE TABLE IF NOT EXISTS portfolio_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL DEFAULT 'Sameer Shaik',
  title TEXT NOT NULL DEFAULT 'Full-Stack Developer',
  tagline TEXT NOT NULL DEFAULT 'Building clean, fast, and scalable full-stack web applications with modern technologies.',
  bio TEXT NOT NULL DEFAULT 'I am a dedicated Full-Stack Developer with a solid foundation in Computer Science from SRM University AP. Skilled in architecting end-to-end web applications with React, Node.js, Express, MongoDB, and relational SQL databases. I am committed to writing clean, maintainable code, solving algorithmic challenges, and crafting delightful digital user experiences.',
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  resume_url TEXT DEFAULT '',
  location TEXT NOT NULL DEFAULT 'Andhra Pradesh, India',
  email TEXT NOT NULL DEFAULT 'shaiksameer092526@gmail.com',
  phone TEXT DEFAULT '+91 9876543210',
  hero_cta_primary_text TEXT NOT NULL DEFAULT 'View Projects',
  hero_cta_primary_link TEXT NOT NULL DEFAULT '#projects',
  hero_cta_secondary_text TEXT NOT NULL DEFAULT 'Contact Me',
  hero_cta_secondary_link TEXT NOT NULL DEFAULT '#contact',
  available_for_work BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Skill Categories
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '',
  proficiency INTEGER DEFAULT 90, -- 0 to 100
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  screenshots TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  category TEXT NOT NULL DEFAULT 'Full-Stack',
  demo_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Experience & Education Timeline
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL DEFAULT 'education', -- 'experience' or 'education'
  title TEXT NOT NULL,                   -- e.g. 'B.Sc Computer Science'
  organization TEXT NOT NULL,            -- e.g. 'SRM University AP'
  location TEXT NOT NULL DEFAULT 'Andhra Pradesh, India',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,                -- or 'Present'
  description TEXT NOT NULL,
  skills_used TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Testimonials / Achievements (Optional toggleable section)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  content TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Social Links
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL, -- 'github', 'linkedin', 'twitter', 'email', etc.
  url TEXT NOT NULL,
  icon TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 9. Contact Messages (Inquiries from visitors)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
-- STRICT RULE:
-- 1. Public can only SELECT published/active content.
-- 2. ONLY authenticated user with email 'shaiksameer092526@gmail.com'
--    can INSERT, UPDATE, or DELETE content.
-- 3. Anyone can INSERT contact_messages, but ONLY the admin can SELECT or DELETE them.
-- ============================================================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view site_settings" ON site_settings;
DROP POLICY IF EXISTS "Admin full access on site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public can view portfolio_profile" ON portfolio_profile;
DROP POLICY IF EXISTS "Admin full access on portfolio_profile" ON portfolio_profile;
DROP POLICY IF EXISTS "Public can view skill_categories" ON skill_categories;
DROP POLICY IF EXISTS "Admin full access on skill_categories" ON skill_categories;
DROP POLICY IF EXISTS "Public can view skills" ON skills;
DROP POLICY IF EXISTS "Admin full access on skills" ON skills;
DROP POLICY IF EXISTS "Public can view published projects" ON projects;
DROP POLICY IF EXISTS "Admin full access on projects" ON projects;
DROP POLICY IF EXISTS "Public can view experiences" ON experiences;
DROP POLICY IF EXISTS "Admin full access on experiences" ON experiences;
DROP POLICY IF EXISTS "Public can view testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin full access on testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public can view social_links" ON social_links;
DROP POLICY IF EXISTS "Admin full access on social_links" ON social_links;
DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin can delete contact messages" ON contact_messages;

-- Site Settings
CREATE POLICY "Public can view site_settings" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admin full access on site_settings" ON site_settings
  FOR ALL USING (auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');

-- Profile
CREATE POLICY "Public can view portfolio_profile" ON portfolio_profile
  FOR SELECT USING (true);
CREATE POLICY "Admin full access on portfolio_profile" ON portfolio_profile
  FOR ALL USING (auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');

-- Skill Categories
CREATE POLICY "Public can view skill_categories" ON skill_categories
  FOR SELECT USING (true);
CREATE POLICY "Admin full access on skill_categories" ON skill_categories
  FOR ALL USING (auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');

-- Skills
CREATE POLICY "Public can view skills" ON skills
  FOR SELECT USING (true);
CREATE POLICY "Admin full access on skills" ON skills
  FOR ALL USING (auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');

-- Projects
CREATE POLICY "Public can view published projects" ON projects
  FOR SELECT USING (published = true OR auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');
CREATE POLICY "Admin full access on projects" ON projects
  FOR ALL USING (auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');

-- Experiences
CREATE POLICY "Public can view experiences" ON experiences
  FOR SELECT USING (true);
CREATE POLICY "Admin full access on experiences" ON experiences
  FOR ALL USING (auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');

-- Testimonials
CREATE POLICY "Public can view testimonials" ON testimonials
  FOR SELECT USING (published = true OR auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');
CREATE POLICY "Admin full access on testimonials" ON testimonials
  FOR ALL USING (auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');

-- Social Links
CREATE POLICY "Public can view social_links" ON social_links
  FOR SELECT USING (is_active = true OR auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');
CREATE POLICY "Admin full access on social_links" ON social_links
  FOR ALL USING (auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');

-- Contact Messages
CREATE POLICY "Public can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view contact messages" ON contact_messages
  FOR SELECT USING (auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');
CREATE POLICY "Admin can update contact messages" ON contact_messages
  FOR UPDATE USING (auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');
CREATE POLICY "Admin can delete contact messages" ON contact_messages
  FOR DELETE USING (auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com');

-- ============================================================
-- STORAGE SETUP (Public bucket for images and PDFs)
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete portfolio-assets" ON storage.objects;

CREATE POLICY "Public can view portfolio-assets" ON storage.objects 
  FOR SELECT USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Admin can upload portfolio-assets" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio-assets' AND 
    auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com'
  );

CREATE POLICY "Admin can update portfolio-assets" ON storage.objects 
  FOR UPDATE USING (
    bucket_id = 'portfolio-assets' AND 
    auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com'
  );

CREATE POLICY "Admin can delete portfolio-assets" ON storage.objects 
  FOR DELETE USING (
    bucket_id = 'portfolio-assets' AND 
    auth.jwt() ->> 'email' = 'shaiksameer092526@gmail.com'
  );
