# Sameer Shaik - Full-Stack Developer Portfolio & Private Admin Dashboard

A modern, responsive, high-performance personal portfolio website built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

Visitors can view projects, technical skills, academic credentials from SRM University AP, download the resume, and send contact messages. Only the portfolio owner (**Sameer Shaik** / `shaiksameer092526@gmail.com`) can log in to the private admin dashboard to edit, publish, hide, or upload content without touching code.

---

## 🌟 Key Features

### 🌐 Public Website (One-Page Smooth Scroll + Project Deep-Dives)
1. **Sticky Glassmorphism Navbar**: Text/Image logo, navigation links with smooth scrolling, theme switcher (Dark/Light mode), and "Let's Talk" CTA.
2. **Hero Section**: Animated introduction, "Available for work" pulsating badge, glowing avatar photo, tagline, and custom CTA buttons.
3. **About Me**: Professional biography, education highlights (SRM University AP), core stack focus, and direct **Download Resume (PDF)** button.
4. **Skills & Expertise**: Categorized technical arsenal (Frontend, Backend, Database & Cloud, Tools) with proficiency percentages and icons.
5. **Featured Projects**: Filterable project grid (All, Full-Stack, Frontend, etc.) with preview cards, tech tags, live demo & GitHub repository links, and click-through case study pages (`/projects/[slug]`).
6. **Project Detail Page (`/projects/[slug]`)**: Dedicated case study view with multi-screenshot galleries, architectural highlights, tech pills, and navigation.
7. **Experience & Education Timeline**: Vertical timeline highlighting B.Sc Computer Science at SRM University AP and developer experience.
8. **Testimonials & Endorsements**: Peer reviews and mentor feedback (toggleable).
9. **Interactive Contact Section**: Contact form that saves inquiries to the database, plus direct social links (GitHub, LinkedIn, Email, Twitter).
10. **Dynamic SEO & Sitemap**: Preconfigured `sitemap.ts`, `robots.ts`, Open Graph meta cards, and responsive mobile-first typography.

---

### 🔒 Private Admin Dashboard (`/admin`)
- **Strict Supabase Authentication**: Restricted to owner email: `shaiksameer092526@gmail.com`. All unauthorized users are blocked.
- **Row-Level Security (RLS)**: Enforced directly inside PostgreSQL so only `shaiksameer092526@gmail.com` can create, update, or delete data. Visitors have read-only access.
- **Site Settings & Branding**: Customize site title, meta description, text/image logo, accent colors, and **instant section visibility switches** (hide or show any section on the site with one click).
- **Hero & About Bio**: Edit name, title, tagline, avatar photo, CTA buttons, bio paragraphs, and upload/replace resume PDF.
- **Skills & Categories**: Add, edit, delete skills and manage categories with interactive proficiency sliders.
- **Projects Portfolio**: Add new projects, upload cover images and multi-screenshot galleries with client-side compression, toggle **Published / Draft** and **Featured** status.
- **Experience Timeline**: Add and manage education and employment milestones.
- **Testimonials Manager**: Create and manage client/peer recommendations.
- **Inquiries Inbox**: View incoming contact form messages, mark as read/unread, delete, or reply via email.

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in (or sign up).
2. Click **New Project**.
3. Choose an organization, enter a name (e.g. `sameer-portfolio`), and generate a secure database password.
4. Select your preferred region (e.g. **South Asia / Mumbai**) and choose the **Free Plan**.

---

### Step 2: Run the Database Schema & Seed Data
1. In your Supabase dashboard, navigate to the **SQL Editor** tab from the left sidebar.
2. Click **New query**.
3. Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and paste it into the editor, then click **Run**. This creates:
   - All tables (`site_settings`, `portfolio_profile`, `skill_categories`, `skills`, `projects`, `experiences`, `testimonials`, `social_links`, `contact_messages`)
   - Row-Level Security policies restricting write permissions strictly to `shaiksameer092526@gmail.com`
   - The public storage bucket `portfolio-assets`
4. Create another new query in the SQL Editor, copy [`supabase/seed.sql`](./supabase/seed.sql), paste it, and click **Run**. This populates your portfolio with initial data for Sameer Shaik.

---

### Step 3: Create the Owner User in Supabase Auth
1. In Supabase, go to **Authentication** -> **Users**.
2. Click **Add user** -> **Create user**.
3. Enter:
   - **Email**: `shaiksameer092526@gmail.com`
   - **Password**: Choose a secure password
   - Check **Auto Confirm User?** so email confirmation is not required.
4. Click **Create user**.

---

### Step 4: Configure Local Environment Variables
1. In the root directory of this project, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Retrieve your project credentials from Supabase:
   - Go to **Project Settings** (gear icon) -> **API**.
   - Copy **Project URL** and paste it as `NEXT_PUBLIC_SUPABASE_URL`.
   - Copy **anon public** key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Copy **service_role secret** key and paste it as `SUPABASE_SERVICE_ROLE_KEY`.

Example `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1Ni...
NEXT_PUBLIC_ADMIN_EMAIL=shaiksameer092526@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### Step 5: Run Locally
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
To access the admin dashboard, visit [http://localhost:3000/admin](http://localhost:3000/admin) and log in with `shaiksameer092526@gmail.com`.

---

### Step 6: Deploy to Vercel
1. Push this repository to your GitHub account (`https://github.com/shaiksameer092526/portfolio`).
2. Log in to [https://vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add the same 5 variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAIL`
   - `NEXT_PUBLIC_SITE_URL` (set to your Vercel production domain e.g. `https://sameer-portfolio.vercel.app`)
5. Click **Deploy**. Your portfolio will be live worldwide in less than 2 minutes!

---

## 📖 How to Use the Admin Dashboard

- **Brand & Theme**: Go to `/admin/settings` to upload a logo image, choose accent theme colors, and toggle any section on/off.
- **Update Profile & Resume**: Go to `/admin/hero-about` to replace your bio text, update your profile picture, or upload a new PDF resume.
- **Add Projects**: Go to `/admin/projects/new` to add a project. Drop screenshots into the uploader (they are automatically compressed before upload). Toggle **Featured** or **Published**.
- **Edit Skills**: Go to `/admin/skills` to add new technologies or categories with proficiency bars.
- **View Inquiries**: Go to `/admin/messages` to view messages sent by visitors, mark them as read, or reply directly.
