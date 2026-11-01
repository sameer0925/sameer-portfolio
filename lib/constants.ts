import { SiteSettings, PortfolioProfile, SkillCategory, Skill, Project, Experience, Testimonial, SocialLink } from './supabase/types'

export const ADMIN_EMAIL = 'shaiksameer092526@gmail.com'

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  site_title: 'Sameer Shaik | Full-Stack Developer',
  site_description: 'Portfolio of Sameer Shaik, Full-Stack Developer specializing in React, Node.js, Express, MongoDB, SQL, and modern web architectures.',
  logo_type: 'text',
  logo_text: 'Sameer.dev',
  logo_image_url: '',
  favicon_url: '',
  accent_color: 'indigo',
  font_family: 'sans',
  sections_visibility: {
    hero: true,
    about: true,
    skills: true,
    projects: true,
    experience: true,
    testimonials: true,
    contact: true,
  },
  seo_keywords: ['Sameer Shaik', 'Full-Stack Developer', 'React Developer', 'Node.js', 'Express', 'MongoDB', 'SQL', 'SRM University AP', 'Portfolio'],
}

export const DEFAULT_PROFILE: PortfolioProfile = {
  id: '00000000-0000-0000-0000-000000000002',
  full_name: 'Sameer Shaik',
  title: 'Full-Stack Developer',
  tagline: 'Building clean, fast, and scalable full-stack web applications with modern technologies.',
  bio: 'I am a passionate Full-Stack Developer with a degree in Computer Science from SRM University AP. I specialize in designing and engineering performant web applications using modern JavaScript/TypeScript, React, Node.js, Express, MongoDB, and SQL databases. With a strong commitment to clean architecture, intuitive UI responsiveness, and developer experience, I turn ambitious ideas into robust, production-ready software.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  resume_url: '/sample-resume.pdf',
  location: 'Andhra Pradesh, India',
  email: 'shaiksameer092526@gmail.com',
  phone: '+91 9876543210',
  hero_cta_primary_text: 'View Projects',
  hero_cta_primary_link: '#projects',
  hero_cta_secondary_text: 'Contact Me',
  hero_cta_secondary_link: '#contact',
  available_for_work: true,
}

export const DEFAULT_CATEGORIES: SkillCategory[] = [
  { id: 'cat-1', name: 'Frontend Development', sort_order: 1 },
  { id: 'cat-2', name: 'Backend & APIs', sort_order: 2 },
  { id: 'cat-3', name: 'Database & Cloud', sort_order: 3 },
  { id: 'cat-4', name: 'Tools & Version Control', sort_order: 4 },
]

export const DEFAULT_SKILLS: (Skill & { categoryName?: string })[] = [
  { id: 'sk-1', category_id: 'cat-1', name: 'React', icon: 'Atom', proficiency: 95, sort_order: 1, categoryName: 'Frontend Development' },
  { id: 'sk-2', category_id: 'cat-1', name: 'JavaScript (ES6+)', icon: 'FileCode', proficiency: 95, sort_order: 2, categoryName: 'Frontend Development' },
  { id: 'sk-3', category_id: 'cat-1', name: 'HTML5', icon: 'Code2', proficiency: 95, sort_order: 3, categoryName: 'Frontend Development' },
  { id: 'sk-4', category_id: 'cat-1', name: 'CSS3 & Tailwind', icon: 'Palette', proficiency: 90, sort_order: 4, categoryName: 'Frontend Development' },
  { id: 'sk-5', category_id: 'cat-2', name: 'Node.js', icon: 'Server', proficiency: 92, sort_order: 1, categoryName: 'Backend & APIs' },
  { id: 'sk-6', category_id: 'cat-2', name: 'Express.js', icon: 'Cpu', proficiency: 90, sort_order: 2, categoryName: 'Backend & APIs' },
  { id: 'sk-7', category_id: 'cat-2', name: 'RESTful APIs', icon: 'Network', proficiency: 92, sort_order: 3, categoryName: 'Backend & APIs' },
  { id: 'sk-8', category_id: 'cat-3', name: 'MongoDB', icon: 'Database', proficiency: 88, sort_order: 1, categoryName: 'Database & Cloud' },
  { id: 'sk-9', category_id: 'cat-3', name: 'SQL (PostgreSQL / MySQL)', icon: 'HardDrive', proficiency: 86, sort_order: 2, categoryName: 'Database & Cloud' },
  { id: 'sk-10', category_id: 'cat-4', name: 'Git & GitHub', icon: 'GitBranch', proficiency: 92, sort_order: 1, categoryName: 'Tools & Version Control' },
  { id: 'sk-11', category_id: 'cat-4', name: 'Postman & API Testing', icon: 'CheckCircle2', proficiency: 88, sort_order: 2, categoryName: 'Tools & Version Control' },
]

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'DevSphere - Developer Community Platform',
    slug: 'devsphere-platform',
    description: 'A full-stack social networking and technical discussion platform for software developers featuring real-time feeds, code snippet sharing, and interactive discussions.',
    content: `## Project Overview
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
- Deployment: Vercel & Render`,
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    ],
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    category: 'Full-Stack',
    demo_url: 'https://devsphere-demo.example.com',
    github_url: 'https://github.com/shaiksameer092526/devsphere',
    featured: true,
    published: true,
    sort_order: 1,
    created_at: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'proj-2',
    title: 'TaskStream - Agile Kanban Workflow Management',
    slug: 'taskstream-kanban',
    description: 'A productivity workspace featuring drag-and-drop Kanban boards, team role management, SQL query auditing, and automated status alerts.',
    content: `## Project Overview
TaskStream was created to streamline agile sprint planning for high-velocity teams. It combines the simplicity of Trello with the analytical depth required by modern engineering organizations.

### Key Highlights
- **Drag and Drop Interface**: Intuitive board columns with real-time state reordering.
- **Relational Data Integrity**: Built with PostgreSQL / SQL schemas enforcing relational constraints, foreign keys, and audit logs.
- **RESTful Endpoints**: Modular controllers for board creation, task categorization, and priority assignment.

### Tech Stack
- Frontend: React, CSS3, Drag & Drop API
- Backend: Node.js, Express
- Database: SQL / PostgreSQL
- Version Control: Git`,
    cover_image: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80',
    ],
    tags: ['React', 'Node.js', 'SQL', 'Express', 'Git'],
    category: 'Full-Stack',
    demo_url: 'https://taskstream-demo.example.com',
    github_url: 'https://github.com/shaiksameer092526/taskstream',
    featured: true,
    published: true,
    sort_order: 2,
    created_at: '2024-02-10T00:00:00.000Z',
  },
  {
    id: 'proj-3',
    title: 'ShopNova - Modern E-Commerce Storefront',
    slug: 'shopnova-ecommerce',
    description: 'High-converting e-commerce web application with cart state persistence, product filtering, search indexing, and secure checkout integration.',
    content: `## Project Overview
ShopNova is a responsive e-commerce web app built to demonstrate scalable front-end state management and clean REST API integrations.

### Key Highlights
- Dynamic catalog filtering by category, price, and customer ratings.
- Persistent shopping cart backed by local storage and server-side validation.
- Responsive mobile-first design with smooth layout transitions.

### Tech Stack
- Frontend: React, HTML5, CSS3, JavaScript
- Backend: Node.js, Express
- Database: MongoDB`,
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    ],
    tags: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'CSS3'],
    category: 'Frontend',
    demo_url: 'https://shopnova-demo.example.com',
    github_url: 'https://github.com/shaiksameer092526/shopnova',
    featured: false,
    published: true,
    sort_order: 3,
    created_at: '2024-03-01T00:00:00.000Z',
  },
]

export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    type: 'education',
    title: 'B.Sc Computer Science',
    organization: 'SRM University AP',
    location: 'Andhra Pradesh, India',
    start_date: '2021',
    end_date: '2024',
    description: 'Graduated with strong foundations in Data Structures, Object-Oriented Programming, Database Management Systems (SQL), Operating Systems, and Modern Web Architectures.',
    skills_used: ['Data Structures', 'Algorithms', 'SQL', 'Web Technologies', 'Software Engineering'],
    sort_order: 1,
  },
  {
    id: 'exp-2',
    type: 'experience',
    title: 'Full-Stack Developer Intern / Projects',
    organization: 'Self-Directed & Academic Projects',
    location: 'Andhra Pradesh, India',
    start_date: '2023',
    end_date: 'Present',
    description: 'Engineered multiple full-stack applications utilizing the MERN stack (MongoDB, Express, React, Node.js) and SQL databases. Designed modular RESTful APIs, optimized query performance, and implemented responsive UI designs.',
    skills_used: ['React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git'],
    sort_order: 2,
  },
]

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Academic Mentor',
    role: 'Faculty of Computer Science',
    company: 'SRM University AP',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    content: 'Sameer consistently demonstrated a strong grasp of full-stack web architectures, algorithms, and database management. His problem-solving initiative and eagerness to build practical applications set him apart.',
    published: true,
    sort_order: 1,
  },
  {
    id: 'test-2',
    name: 'Tech Collaborator',
    role: 'Frontend Engineer',
    company: 'Peer Developer Network',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    content: 'Working with Sameer on web projects is a breeze. He writes clean, predictable backend APIs, connects them flawlessly to React components, and always adheres to Git best practices.',
    published: true,
    sort_order: 2,
  },
]

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: 'soc-1', platform: 'GitHub', url: 'https://github.com/shaiksameer092526', icon: 'Github', sort_order: 1, is_active: true },
  { id: 'soc-2', platform: 'LinkedIn', url: 'https://linkedin.com/in/shaiksameer', icon: 'Linkedin', sort_order: 2, is_active: true },
  { id: 'soc-3', platform: 'Email', url: 'mailto:shaiksameer092526@gmail.com', icon: 'Mail', sort_order: 3, is_active: true },
  { id: 'soc-4', platform: 'Twitter', url: 'https://twitter.com/shaiksameer', icon: 'Twitter', sort_order: 4, is_active: true },
]
