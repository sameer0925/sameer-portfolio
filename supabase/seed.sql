-- ============================================================
-- PORTFOLIO SEED DATA FOR SAMEER SHAIK
-- ============================================================

-- 1. Site Settings Initial Row
INSERT INTO site_settings (id, site_title, site_description, logo_type, logo_text, logo_image_url, favicon_url, accent_color, font_family, sections_visibility, seo_keywords)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Sameer Shaik | Full-Stack Developer',
  'Portfolio of Sameer Shaik — Full-Stack Developer specializing in React, Node.js, Express, MongoDB, and modern web architectures.',
  'text',
  'Sameer.dev',
  '',
  '',
  'indigo',
  'sans',
  '{"hero": true, "about": true, "skills": true, "projects": true, "experience": true, "testimonials": true, "contact": true}'::jsonb,
  ARRAY['Sameer Shaik', 'Full-Stack Developer', 'React Developer', 'Node.js', 'Express', 'MongoDB', 'SQL', 'SRM University AP', 'Web Developer India']
)
ON CONFLICT (id) DO UPDATE SET
  site_title = EXCLUDED.site_title,
  site_description = EXCLUDED.site_description;

-- 2. Profile Initial Row
INSERT INTO portfolio_profile (id, full_name, title, tagline, bio, avatar_url, resume_url, location, email, phone, hero_cta_primary_text, hero_cta_primary_link, hero_cta_secondary_text, hero_cta_secondary_link, available_for_work)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Sameer Shaik',
  'Full-Stack Developer',
  'Building high-performance web applications, scalable backends, and intuitive digital experiences.',
  'I am a passionate Full-Stack Developer with a degree in Computer Science from SRM University AP. I specialize in designing and engineering performant web applications using modern JavaScript/TypeScript, React, Node.js, Express, MongoDB, and SQL databases. With a strong passion for clean architecture, fast UI responsiveness, and developer experience, I turn ambitious ideas into robust, production-ready software.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  '/sample-resume.pdf',
  'Andhra Pradesh, India',
  'shaiksameer092526@gmail.com',
  '+91 9876543210',
  'View Projects',
  '#projects',
  'Contact Me',
  '#contact',
  true
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  bio = EXCLUDED.bio;

-- 3. Skill Categories
INSERT INTO skill_categories (id, name, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Frontend Development', 1),
  ('22222222-2222-2222-2222-222222222222', 'Backend & APIs', 2),
  ('33333333-3333-3333-3333-333333333333', 'Database & Cloud', 3),
  ('44444444-4444-4444-4444-444444444444', 'Tools & Version Control', 4)
ON CONFLICT (id) DO NOTHING;

-- 4. Skills
INSERT INTO skills (id, category_id, name, icon, proficiency, sort_order) VALUES
  -- Frontend
  ('11111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'React', 'Atom', 95, 1),
  ('11111111-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'JavaScript (ES6+)', 'FileCode', 95, 2),
  ('11111111-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'HTML5', 'Code2', 95, 3),
  ('11111111-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'CSS3 & Tailwind', 'Palette', 90, 4),
  -- Backend
  ('22222222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Node.js', 'Server', 92, 1),
  ('22222222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Express.js', 'Cpu', 90, 2),
  ('22222222-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'RESTful APIs', 'Network', 92, 3),
  -- Database
  ('33333333-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'MongoDB', 'Database', 88, 1),
  ('33333333-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'SQL (PostgreSQL / MySQL)', 'HardDrive', 86, 2),
  -- Tools
  ('44444444-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'Git & GitHub', 'GitBranch', 92, 1),
  ('44444444-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'Postman & API Testing', 'CheckCircle2', 88, 2)
ON CONFLICT (id) DO NOTHING;

-- 5. Projects
INSERT INTO projects (id, title, slug, description, content, cover_image, screenshots, tags, category, demo_url, github_url, featured, published, sort_order) VALUES
(
  '55555555-0000-0000-0000-000000000001',
  'DevSphere - Community Platform for Developers',
  'devsphere-platform',
  'A full-stack social networking and technical discussion platform for software developers with real-time feeds, code snippet sharing, and interactive discussions.',
  '## Overview
DevSphere is an end-to-end community platform engineered to empower software engineers to collaborate, share code snippets with syntax highlighting, and engage in technical discussions.

### Key Highlights
- **Authentication**: JWT token authentication with bcrypt password hashing and session tokens.
- **Backend Architecture**: RESTful API built with Node.js and Express, connected to MongoDB with Mongoose schemas.
- **Frontend Experience**: Single-page application built using React, React Router, and Tailwind CSS.
- **Performance**: Optimized database indexes and cached queries for lightning-fast response times.

### Tech Stack
- Frontend: React, Tailwind CSS, Lucide Icons
- Backend: Node.js, Express.js
- Database: MongoDB (Atlas)
- Deployment: Vercel & Render',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
  'Full-Stack',
  'https://devsphere-demo.example.com',
  'https://github.com/shaiksameer092526/devsphere',
  true,
  true,
  1
),
(
  '55555555-0000-0000-0000-000000000002',
  'TaskStream - Agile Kanban Workflow Management',
  'taskstream-kanban',
  'A productivity workspace featuring drag-and-drop Kanban boards, team role management, SQL query auditing, and automated status alerts.',
  '## Overview
TaskStream was created to streamline agile sprint planning for high-velocity teams. It combines the simplicity of Trello with the analytical depth required by modern engineering organizations.

### Key Highlights
- **Drag and Drop Interface**: Intuitive board columns with real-time state reordering.
- **Relational Data Integrity**: Built with PostgreSQL / SQL schemas enforcing relational constraints, foreign keys, and audit logs.
- **RESTful Endpoints**: Modular controllers for board creation, task categorization, and priority assignment.

### Tech Stack
- Frontend: React, CSS3, Drag & Drop API
- Backend: Node.js, Express
- Database: SQL / PostgreSQL
- Version Control: Git',
  'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY['React', 'Node.js', 'SQL', 'Express', 'Git'],
  'Full-Stack',
  'https://taskstream-demo.example.com',
  'https://github.com/shaiksameer092526/taskstream',
  true,
  true,
  2
),
(
  '55555555-0000-0000-0000-000000000003',
  'ShopNova - Modern E-Commerce Storefront',
  'shopnova-ecommerce',
  'High-converting e-commerce web application with cart state persistence, product filtering, search indexing, and secure checkout integration.',
  '## Overview
ShopNova is a responsive e-commerce web app built to demonstrate scalable front-end state management and clean REST API integrations.

### Key Highlights
- Dynamic catalog filtering by category, price, and customer ratings.
- Persistent shopping cart backed by local storage and server-side validation.
- Responsive mobile-first design with smooth layout transitions.

### Tech Stack
- Frontend: React, HTML5, CSS3, JavaScript
- Backend: Node.js, Express
- Database: MongoDB',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY['JavaScript', 'React', 'Node.js', 'MongoDB', 'CSS3'],
  'Frontend',
  'https://shopnova-demo.example.com',
  'https://github.com/shaiksameer092526/shopnova',
  false,
  true,
  3
)
ON CONFLICT (id) DO NOTHING;

-- 6. Experience & Education Timeline
INSERT INTO experiences (id, type, title, organization, location, start_date, end_date, description, skills_used, sort_order) VALUES
(
  '66666666-0000-0000-0000-000000000001',
  'education',
  'B.Sc Computer Science',
  'SRM University AP',
  'Andhra Pradesh, India',
  '2021',
  '2024',
  'Acquired comprehensive foundation in computer science principles, data structures and algorithms, object-oriented programming, relational databases, web development, and software engineering methodologies.',
  ARRAY['Data Structures', 'Algorithms', 'SQL', 'Web Technologies', 'Software Engineering'],
  1
),
(
  '66666666-0000-0000-0000-000000000002',
  'experience',
  'Full-Stack Developer Intern / Projects',
  'Self-Directed & Academic Projects',
  'Andhra Pradesh, India',
  '2023',
  'Present',
  'Architected multiple production-grade web applications utilizing the MERN stack (MongoDB, Express, React, Node.js) and SQL. Implemented RESTful APIs, optimized database queries, integrated responsive UIs with Tailwind CSS, and managed code repositories with Git.',
  ARRAY['React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git'],
  2
)
ON CONFLICT (id) DO NOTHING;

-- 7. Testimonials
INSERT INTO testimonials (id, name, role, company, avatar_url, content, published, sort_order) VALUES
(
  '77777777-0000-0000-0000-000000000001',
  'Academic Mentor',
  'Professor of Computer Science',
  'SRM University AP',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  'Sameer consistently demonstrated a strong grasp of full-stack web architectures, algorithms, and database management. His problem-solving initiative and eagerness to build practical applications set him apart.',
  true,
  1
),
(
  '77777777-0000-0000-0000-000000000002',
  'Project Collaborator',
  'Frontend Engineer',
  'Tech Peer Community',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  'Working with Sameer on web projects is a breeze. He writes clean, predictable backend APIs, connects them flawlessly to React components, and always adheres to Git best practices.',
  true,
  2
)
ON CONFLICT (id) DO NOTHING;

-- 8. Social Links
INSERT INTO social_links (id, platform, url, icon, sort_order, is_active) VALUES
  ('88888888-0000-0000-0000-000000000001', 'GitHub', 'https://github.com/shaiksameer092526', 'Github', 1, true),
  ('88888888-0000-0000-0000-000000000002', 'LinkedIn', 'https://linkedin.com/in/shaiksameer', 'Linkedin', 2, true),
  ('88888888-0000-0000-0000-000000000003', 'Email', 'mailto:shaiksameer092526@gmail.com', 'Mail', 3, true),
  ('88888888-0000-0000-0000-000000000004', 'Twitter', 'https://twitter.com/shaiksameer', 'Twitter', 4, true)
ON CONFLICT (id) DO NOTHING;
