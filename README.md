# 🚀 Multi Landing Page Builder

A powerful, flexible visual landing page builder for creating and managing professional landing pages with drag-and-drop functionality. Built with Next.js 14, TypeScript, TailwindCSS, and Framer Motion.

## ✨ Features

### Core Features

- **🎨 Visual Page Editor** - Drag-and-drop interface for building landing pages
- **📄 Multi-Page Support** - Create landing pages with multiple sub-pages
- **📱 Fully Responsive** - Mobile-first design that looks great on all devices
- **🎭 15+ Themes** - Modern, Dark, Vibrant, Minimal, Nature, Ocean, Elegant, and more
- **🧩 20+ Components** - Hero, Features, Pricing, Testimonials, CTA, Gallery, Team, FAQ, and more
- **⚡ Server-Side Rendering** - Fast page loads with Next.js SSR
- **🔍 Advanced SEO** - Full Next.js Metadata API support (Open Graph, Twitter Cards, Robots, etc.)
- **💾 JSON Configuration** - Simple file-based data storage
- **🎯 Type-Safe** - Full TypeScript support

### Editor Features

- **🖱️ Drag & Drop** - Reorder components easily with @dnd-kit
- **👁️ Real-time Preview** - See changes instantly
- **🎬 Animation Editor** - Configure component animations (fade, slide, zoom)
- **🖼️ Background Editor** - Solid colors, gradients, or images with overlays
- **📐 Spacing Controls** - Fine-tune padding and margins
- **📤 Export/Import** - Save and load page configurations
- **⌨️ Keyboard Shortcuts** - Efficient editing workflow
- **💾 Auto-Save** - Never lose your work

### Visual Features

- **✨ Scroll Animations** - Powered by Framer Motion
- **🎨 Custom Backgrounds** - Solid, gradient, or image backgrounds
- **📏 Container Width Control** - From narrow to fullscreen layouts
- **⏳ Loading Spinners** - 8 customizable loading animation styles

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser:

- **Page Editor**: http://localhost:3000/editor
- **Landing Pages**: http://localhost:3000/[slug]
- **Preview Mode**: http://localhost:3000/preview

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── public/
│   ├── data/
│   │   └── landing-config.json     # All pages configuration
│   └── assets/images/              # Uploaded images
├── src/
│   ├── app/
│   │   ├── editor/                 # Visual page editor
│   │   ├── (landing)/[slug]/       # Public landing pages (SSR)
│   │   ├── preview/                # Preview mode
│   │   └── api/                    # API routes
│   ├── components/
│   │   ├── editor/                 # Editor components
│   │   │   ├── core/               # Core editor functionality
│   │   │   ├── dialogs/            # Modal dialogs
│   │   │   ├── editors/            # Component-specific editors
│   │   │   ├── panels/             # Editor panels
│   │   │   └── selectors/          # Selection components
│   │   ├── landing/                # Landing page components
│   │   └── ui/                     # UI components (shadcn/ui)
│   ├── contexts/                   # React contexts
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utilities and helpers
│   └── types/                      # TypeScript type definitions
```

## 🧩 Available Components

| Component        | Description                                    |
| ---------------- | ---------------------------------------------- |
| **Header**       | Navigation bar with logo, links, and CTA       |
| **Hero**         | Eye-catching headers with CTAs and images      |
| **Features**     | Showcase features in grid/list/carousel layout |
| **Pricing**      | Display pricing plans and tiers                |
| **Testimonials** | Customer reviews with ratings and avatars      |
| **CTA**          | Call-to-action sections                        |
| **Footer**       | Multi-column footer with social links          |
| **Stats**        | Display statistics and metrics                 |
| **Team**         | Team member profiles                           |
| **FAQ**          | Frequently asked questions                     |
| **Gallery**      | Image gallery with lightbox                    |
| **Logo Cloud**   | Partner/client logo showcase                   |
| **Contact**      | Contact form section                           |
| **Content**      | Rich text content blocks                       |
| **Newsletter**   | Email subscription section                     |
| **Video**        | Embedded video sections                        |

## 🎭 Themes

15 professionally designed themes included:

| Theme                 | Style                                  |
| --------------------- | -------------------------------------- |
| **Modern Blue**       | Clean, professional with blue accents  |
| **Professional Dark** | Sleek dark mode with subtle highlights |
| **Vibrant Gradient**  | Bold, colorful design                  |
| **Minimal Clean**     | Simple black & white aesthetic         |
| **Nature Green**      | Organic, earthy tones                  |
| **Sunset Orange**     | Warm, inviting colors                  |
| **Ocean Blue**        | Fresh, cool tones                      |
| **Elegant Purple**    | Sophisticated purple palette           |
| **Tech Cyan**         | Modern, tech-focused design            |
| **Warm Terracotta**   | Cozy, warm aesthetic                   |
| **Corporate**         | Professional business style            |
| **Neon Futuristic**   | Bold, cyberpunk-inspired               |
| **Pastel Soft**       | Gentle, soft colors                    |
| **Bold Red**          | Strong, attention-grabbing             |
| **Retro Vintage**     | Classic, nostalgic feel                |

## 🔧 Configuration

All configuration is stored in `public/data/landing-config.json`:

- Page settings and metadata
- Component configurations
- Theme customizations
- SEO settings (Open Graph, Twitter, Robots)
- Multi-page navigation

## 🛠️ Tech Stack

| Category          | Technology              |
| ----------------- | ----------------------- |
| **Framework**     | Next.js 14 (App Router) |
| **Language**      | TypeScript              |
| **Styling**       | TailwindCSS             |
| **UI Components** | shadcn/ui + Radix UI    |
| **Animations**    | Framer Motion           |
| **Drag & Drop**   | @dnd-kit                |
| **Icons**         | Lucide React            |
| **Carousel**      | Embla Carousel          |
| **Export**        | JSZip                   |

## ⌨️ Keyboard Shortcuts

| Shortcut           | Action                    |
| ------------------ | ------------------------- |
| `Ctrl + S`         | Save page                 |
| `Ctrl + Z`         | Undo                      |
| `Ctrl + Shift + Z` | Redo                      |
| `Delete`           | Delete selected component |
| `Escape`           | Deselect component        |

## 🎯 Features Completed

- [x] Visual drag & drop editor
- [x] Real-time preview
- [x] Advanced component editor
- [x] Image upload
- [x] Theme selection
- [x] Multi-page support
- [x] Export/Import
- [x] Animation configuration
- [x] Background customization
- [x] SEO configuration
- [x] Loading spinners
- [x] Keyboard shortcuts
- [x] Auto-save

## 📝 License

MIT License

---

**Built with ❤️ using Next.js, TypeScript, TailwindCSS, and Framer Motion**
