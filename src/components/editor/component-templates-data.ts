import { ComponentConfig } from "@/types/landing";

export interface ComponentVariant {
  name: string;
  description: string;
  preview?: string;
  template: Omit<ComponentConfig, "id" | "order">;
}

export interface ComponentCategory {
  type: ComponentConfig["type"];
  name: string;
  description: string;
  icon: string;
  variants: ComponentVariant[];
}

const categories: ComponentCategory[] = [
  // ==================== HEADER ====================
  {
    type: "header",
    name: "Header",
    description: "Navigation header with logo and menu",
    icon: "📱",
    variants: [
      {
        name: "Modern Header",
        description: "Clean header with navigation and CTA button",
        template: {
          type: "header",
          visible: true,
          config: {
            logo: {
              type: "text",
              text: "Your Brand",
              link: "/",
            },
            tabs: [], // Will be auto-populated with components
            ctaButton: {
              text: "Get Started",
              link: "#",
              style: "primary",
            },
            position: "sticky",
            transparent: false,
            background: {
              type: "solid",
              color: "#ffffff",
            },
            spacing: { padding: "md" },
            animation: { type: "none" },
          },
        },
      },
      {
        name: "Transparent Header",
        description: "Transparent header that becomes solid on scroll",
        template: {
          type: "header",
          visible: true,
          config: {
            logo: {
              type: "text",
              text: "Your Brand",
              link: "/",
            },
            tabs: [], // Will be auto-populated with components
            ctaButton: {
              text: "Contact Us",
              link: "#",
              style: "outline",
            },
            position: "fixed",
            transparent: true,
            background: {
              type: "solid",
              color: "#ffffff",
            },
            spacing: { padding: "md" },
            animation: { type: "fadeIn", duration: 600 },
          },
        },
      },
      {
        name: "Header with Logo Image",
        description: "Header with image logo",
        template: {
          type: "header",
          visible: true,
          config: {
            logo: {
              type: "image",
              image: "/assets/images/default-logo.svg",
              link: "/",
            },
            tabs: [], // Will be auto-populated with components
            ctaButton: {
              text: "Sign Up",
              link: "#",
              style: "primary",
            },
            position: "sticky",
            transparent: false,
            background: {
              type: "solid",
              color: "#ffffff",
            },
            spacing: { padding: "md" },
            animation: { type: "none" },
          },
        },
      },
    ],
  },

  // ==================== HERO SECTIONS ====================
  {
    type: "hero",
    name: "Hero Section",
    description: "Eye-catching headers with CTA buttons",
    icon: "🎯",
    variants: [
      {
        name: "Gradient Hero - Center",
        description: "Centered hero with gradient background",
        template: {
          type: "hero",
          visible: true,
          config: {
            title: "Welcome to Our Platform",
            subtitle: "Innovate • Transform • Succeed",
            description:
              "Transform your business with our cutting-edge solutions. Get started today and see the difference.",
            alignment: "center",
            primaryCTA: { text: "Get Started", link: "#" },
            secondaryCTA: { text: "Learn More", link: "#" },
            background: {
              type: "solid",
              color: "#ffffff",
            },
            spacing: { padding: "2xl" },
            animation: { type: "fadeInUp", duration: 800, delay: 200 },
          },
        },
      },
      {
        name: "Image Hero - Left",
        description: "Hero with left-aligned text and right image",
        template: {
          type: "hero",
          visible: true,
          config: {
            title: "Build Something Amazing",
            subtitle: "The Future is Now",
            description:
              "Join thousands of companies using our platform to accelerate their growth and achieve remarkable results.",
            alignment: "left",
            primaryCTA: { text: "Start Free Trial", link: "#" },
            secondaryCTA: { text: "Watch Demo", link: "#" },
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
            background: { type: "solid", color: "#ffffff" },
            spacing: { padding: "xl" },
            animation: { type: "fadeInUp", duration: 800, delay: 200 },
          },
        },
      },
      {
        name: "Minimal Hero",
        description: "Clean and minimal design",
        template: {
          type: "hero",
          visible: true,
          config: {
            title: "Simple. Powerful. Effective.",
            subtitle: "",
            description:
              "The all-in-one solution you've been waiting for. No complexity, just results.",
            alignment: "center",
            primaryCTA: { text: "Get Started", link: "#" },
            background: { type: "solid", color: "#ffffff" },
            animation: { type: "fadeInUp", duration: 800, delay: 200 },
            spacing: { padding: "xl" },
          },
        },
      },
      {
        name: "Dark Hero with Image",
        description: "Dark background with hero image",
        template: {
          type: "hero",
          visible: true,
          config: {
            title: "Experience Excellence",
            subtitle: "Premium Quality",
            description:
              "Discover the difference that quality makes. Elevate your experience today.",
            alignment: "center",
            primaryCTA: { text: "Explore Now", link: "#" },
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
            background: {
              type: "solid",
              color: "#ffffff",
            },
            spacing: { padding: "2xl" },
          },
        },
      },
    ],
  },

  // ==================== FEATURES ====================
  {
    type: "features",
    name: "Features Grid",
    description: "Showcase your product features",
    icon: "✨",
    variants: [
      {
        name: "3-Column Grid",
        description: "Standard 3-column feature grid",
        template: {
          type: "features",
          visible: true,
          config: {
            title: "Amazing Features",
            subtitle: "Everything you need to succeed",
            description: "Our platform provides all the tools you need to grow your business.",
            features: [
              {
                id: "1",
                icon: "⚡",
                title: "Lightning Fast",
                description: "Blazing fast performance for the best user experience.",
              },
              {
                id: "2",
                icon: "🔒",
                title: "Secure & Reliable",
                description: "Enterprise-grade security to keep your data safe.",
              },
              {
                id: "3",
                icon: "🎨",
                title: "Beautiful Design",
                description: "Stunning interfaces that users love to interact with.",
              },
            ],
            columns: 3,
            background: { type: "solid", color: "#ffffff" },
            spacing: { padding: "xl" },
          },
        },
      },
      {
        name: "4-Column Grid",
        description: "Compact 4-column layout",
        template: {
          type: "features",
          visible: true,
          config: {
            title: "Powerful Capabilities",
            subtitle: "Built for Performance",
            features: [
              { id: "1", icon: "🚀", title: "Fast", description: "Optimized for speed" },
              { id: "2", icon: "💪", title: "Powerful", description: "Enterprise features" },
              { id: "3", icon: "🎯", title: "Precise", description: "Pixel-perfect design" },
              { id: "4", icon: "📈", title: "Scalable", description: "Grows with you" },
            ],
            columns: 4,
            background: { type: "solid", color: "#ffffff" },
            spacing: { padding: "lg" },
            animation: { type: "fadeInUp", duration: 600, delay: 0 },
          },
        },
      },
      {
        name: "Features with Images",
        description: "Features grid with images",
        template: {
          type: "features",
          visible: true,
          config: {
            title: "What We Offer",
            subtitle: "Complete Solutions",
            description: "Everything you need in one powerful platform",
            features: [
              {
                id: "1",
                icon: "",
                title: "Smart Analytics",
                description: "Get insights that drive decisions",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
              },
              {
                id: "2",
                icon: "",
                title: "Team Collaboration",
                description: "Work together seamlessly",
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
              },
              {
                id: "3",
                icon: "",
                title: "24/7 Support",
                description: "We're here when you need us",
                image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
              },
            ],
            columns: 3,
            background: { type: "solid", color: "#ffffff" },
            spacing: { padding: "xl" },
          },
        },
      },
    ],
  },

  // ==================== STATS ====================
  {
    type: "stats",
    name: "Stats Section",
    description: "Display impressive metrics",
    icon: "📊",
    variants: [
      {
        name: "Gradient 4-Column",
        description: "4 stats with gradient background",
        template: {
          type: "stats",
          visible: true,
          config: {
            title: "Our Impact",
            subtitle: "BY THE NUMBERS",
            description: "Trusted by thousands worldwide",
            stats: [
              { id: "1", value: "10K", label: "Active Users", suffix: "+" },
              { id: "2", value: "99.9", label: "Uptime", suffix: "%" },
              { id: "3", value: "24", label: "Support", suffix: "/7" },
              { id: "4", value: "150", label: "Countries", suffix: "+" },
            ],
            layout: "grid",
            columns: 4,
            background: {
              type: "solid",
              color: "#ffffff",
            },
            spacing: { padding: "xl" },
          },
        },
      },
      {
        name: "Minimal 3-Column",
        description: "Clean 3-column stats",
        template: {
          type: "stats",
          visible: true,
          config: {
            title: "Proven Results",
            stats: [
              { id: "1", value: "500", label: "Projects Completed", suffix: "+" },
              { id: "2", value: "50", label: "Team Members", suffix: "+" },
              { id: "3", value: "98", label: "Client Satisfaction", suffix: "%" },
            ],
            layout: "grid",
            columns: 3,
            background: { type: "solid", color: "#ffffff" },
            spacing: { padding: "lg" },
          },
        },
      },
      {
        name: "Horizontal Stats",
        description: "Horizontal layout for key metrics",
        template: {
          type: "stats",
          visible: true,
          config: {
            stats: [
              { id: "1", value: "1M", label: "Downloads", suffix: "+" },
              { id: "2", value: "4.9", label: "Rating" },
              { id: "3", value: "24/7", label: "Support" },
            ],
            layout: "horizontal",
            background: { type: "solid", color: "#ffffff" },
            spacing: { padding: "md" },
          },
        },
      },
    ],
  },

  // ==================== PRICING ====================
  {
    type: "pricing",
    name: "Pricing Table",
    description: "Display your pricing plans",
    icon: "💰",
    variants: [
      {
        name: "3-Tier Pricing",
        description: "Standard 3-plan layout",
        template: {
          type: "pricing",
          visible: true,
          config: {
            title: "Simple, Transparent Pricing",
            subtitle: "Choose the plan that's right for you",
            description: "No hidden fees. Cancel anytime.",
            plans: [
              {
                name: "Starter",
                price: "$29",
                period: "per month",
                description: "Perfect for individuals",
                features: ["Up to 10 projects", "5GB storage", "Email support", "Basic analytics"],
                cta: { text: "Start Free Trial", link: "#" },
                highlighted: false,
              },
              {
                name: "Professional",
                price: "$99",
                period: "per month",
                description: "Best for growing businesses",
                features: [
                  "Unlimited projects",
                  "100GB storage",
                  "Priority support",
                  "Advanced analytics",
                  "Custom integrations",
                ],
                cta: { text: "Get Started", link: "#" },
                highlighted: true,
                badge: "Popular",
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large organizations",
                features: [
                  "Everything in Pro",
                  "Unlimited storage",
                  "24/7 phone support",
                  "Dedicated account manager",
                  "Custom SLA",
                ],
                cta: { text: "Contact Sales", link: "#" },
                highlighted: false,
              },
            ],
            spacing: { padding: "xl" },
          },
        },
      },
      {
        name: "2-Tier Simple",
        description: "Simple 2-plan comparison",
        template: {
          type: "pricing",
          visible: true,
          config: {
            title: "Choose Your Plan",
            subtitle: "Flexible pricing for everyone",
            plans: [
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Get started for free",
                features: ["5 projects", "1GB storage", "Community support"],
                cta: { text: "Sign Up Free", link: "#" },
                highlighted: false,
              },
              {
                name: "Pro",
                price: "$49",
                period: "per month",
                description: "Everything you need",
                features: [
                  "Unlimited projects",
                  "50GB storage",
                  "Priority email support",
                  "Advanced features",
                ],
                cta: { text: "Upgrade to Pro", link: "#" },
                highlighted: true,
              },
            ],
            spacing: { padding: "lg" },
          },
        },
      },
    ],
  },

  // ==================== CTA ====================
  {
    type: "cta",
    name: "Call to Action",
    description: "Drive conversions with CTAs",
    icon: "🚀",
    variants: [
      {
        name: "Gradient CTA",
        description: "CTA with gradient background",
        template: {
          type: "cta",
          visible: true,
          config: {
            title: "Ready to Get Started?",
            description: "Join thousands of satisfied customers today.",
            primaryCTA: { text: "Start Free Trial", link: "#" },
            secondaryCTA: { text: "Schedule Demo", link: "#" },
            background: {
              type: "solid",
              color: "#ffffff",
            },
            spacing: { padding: "xl" },
          },
        },
      },
      {
        name: "Simple CTA",
        description: "Clean and simple",
        template: {
          type: "cta",
          visible: true,
          config: {
            title: "Start Your Free Trial",
            description: "No credit card required. Get started in minutes.",
            primaryCTA: { text: "Get Started", link: "#" },
            background: { type: "solid", color: "#ffffff" },
            spacing: { padding: "lg" },
          },
        },
      },
      {
        name: "Urgent CTA",
        description: "CTA with urgency",
        template: {
          type: "cta",
          visible: true,
          config: {
            title: "Limited Time Offer!",
            description: "Get 50% off your first year. Offer ends soon!",
            primaryCTA: { text: "Claim Offer Now", link: "#" },
            secondaryCTA: { text: "Learn More", link: "#" },
            background: {
              type: "solid",
              color: "#ffffff",
            },
            spacing: { padding: "xl" },
          },
        },
      },
    ],
  },

  // ==================== TESTIMONIALS ====================
  {
    type: "testimonials",
    name: "Testimonials",
    description: "Customer reviews and ratings",
    icon: "💬",
    variants: [
      {
        name: "3-Column Grid",
        description: "Standard testimonials grid",
        template: {
          type: "testimonials",
          visible: true,
          config: {
            title: "What Our Customers Say",
            subtitle: "Trusted by thousands",
            testimonials: [
              {
                content: "This platform has transformed how we work. Simply amazing results!",
                author: "Sarah Johnson",
                role: "CEO",
                company: "TechCorp",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
              },
              {
                content: "Best decision we made this year. Highly recommended!",
                author: "Michael Chen",
                role: "Product Manager",
                company: "StartupXYZ",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
              },
              {
                content: "Outstanding support and incredible features.",
                author: "Emily Rodriguez",
                role: "Marketing Director",
                company: "GrowthCo",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
              },
            ],
            layout: { columns: 3 },
            background: { type: "solid", color: "#ffffff" },
            spacing: { padding: "xl" },
          },
        },
      },
      {
        name: "2-Column Featured",
        description: "Larger 2-column layout",
        template: {
          type: "testimonials",
          visible: true,
          config: {
            title: "Client Success Stories",
            testimonials: [
              {
                content:
                  "We've seen a 300% increase in productivity since switching. The team loves it and our clients have noticed the difference.",
                author: "David Park",
                role: "Founder & CEO",
                company: "InnovateCo",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
              },
              {
                content:
                  "The ROI has been incredible. Best investment we've made in our business this year.",
                author: "Lisa Wang",
                role: "Operations Director",
                company: "ScaleCorp",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100",
              },
            ],
            layout: { columns: 2 },
            background: { type: "solid", color: "#ffffff" },
            spacing: { padding: "lg" },
          },
        },
      },
    ],
  },

  // Team Section
  {
    type: "team",
    name: "Team Section",
    description: "Showcase your team members with photos and bios",
    icon: "👥",
    variants: [
      {
        name: "3-Member Grid",
        description: "Standard 3-column team grid with photos and social links",
        template: {
          type: "team",
          visible: true,
          config: {
            title: "Meet Our Team",
            description: "Our team of experts is here to help you succeed",
            members: [
              {
                name: "Sarah Johnson",
                role: "CEO & Founder",
                bio: "10+ years building successful products",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
                social: { linkedin: "#", twitter: "#" },
              },
              {
                name: "Michael Chen",
                role: "CTO",
                bio: "Former tech lead at major tech companies",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
                social: { linkedin: "#", github: "#" },
              },
              {
                name: "Emily Rodriguez",
                role: "Head of Design",
                bio: "Award-winning designer with 8 years experience",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
                social: { linkedin: "#", dribbble: "#" },
              },
            ],
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
      {
        name: "4-Member Grid",
        description: "Compact 4-column layout for larger teams",
        template: {
          type: "team",
          visible: true,
          config: {
            title: "Our Leadership Team",
            description: "Meet the people driving innovation",
            members: [
              {
                name: "David Park",
                role: "CEO",
                bio: "Strategic leader with vision",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
                social: { linkedin: "#" },
              },
              {
                name: "Lisa Wang",
                role: "COO",
                bio: "Operations expert",
                image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
                social: { linkedin: "#" },
              },
              {
                name: "James Miller",
                role: "CFO",
                bio: "Financial strategist",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
                social: { linkedin: "#" },
              },
              {
                name: "Maria Garcia",
                role: "CMO",
                bio: "Marketing innovator",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
                social: { linkedin: "#" },
              },
            ],
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
    ],
  },

  // FAQ Section
  {
    type: "faq",
    name: "FAQ Section",
    description: "Answer common questions from your customers",
    icon: "❓",
    variants: [
      {
        name: "Single Column",
        description: "Simple FAQ list with expandable answers",
        template: {
          type: "faq",
          visible: true,
          config: {
            title: "Frequently Asked Questions",
            description: "Find answers to common questions",
            faqs: [
              {
                question: "How does the free trial work?",
                answer: "Full access for 14 days, no credit card required.",
              },
              { question: "Can I change plans?", answer: "Yes! Upgrade or downgrade anytime." },
              {
                question: "What payment methods?",
                answer: "We accept all major credit cards and PayPal.",
              },
              { question: "Is my data secure?", answer: "Bank-level encryption, SOC 2 certified." },
            ],
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
      {
        name: "Two Column Grid",
        description: "Compact 2-column FAQ layout",
        template: {
          type: "faq",
          visible: true,
          config: {
            title: "Common Questions",
            description: "Quick answers to help you",
            columns: 2,
            faqs: [
              {
                question: "What is included?",
                answer: "All features, unlimited users, 24/7 support.",
              },
              { question: "How to get started?", answer: "Sign up and start building!" },
              { question: "Can I cancel anytime?", answer: "Yes, cancel with no penalties." },
              { question: "Do you offer support?", answer: "24/7 email and chat support." },
            ],
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
    ],
  },

  // Gallery Section
  {
    type: "gallery",
    name: "Image Gallery",
    description: "Showcase your work with beautiful image grids",
    icon: "🖼️",
    variants: [
      {
        name: "3-Column Grid",
        description: "Balanced 3-column photo grid",
        template: {
          type: "gallery",
          visible: true,
          config: {
            title: "Our Work",
            description: "Recent projects showcase",
            columns: 3,
            images: [
              {
                url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
                title: "Dashboard Design",
              },
              {
                url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
                title: "Mobile App",
              },
              {
                url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
                title: "Brand Strategy",
              },
              {
                url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
                title: "Team Collaboration",
              },
              {
                url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
                title: "Analytics Platform",
              },
              {
                url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
                title: "E-commerce Site",
              },
            ],
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
      {
        name: "4-Column Compact",
        description: "High-density 4-column layout",
        template: {
          type: "gallery",
          visible: true,
          config: {
            title: "Portfolio",
            columns: 4,
            images: [
              {
                url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80",
                title: "Project 1",
              },
              {
                url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80",
                title: "Project 2",
              },
              {
                url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
                title: "Project 3",
              },
              {
                url: "https://images.unsplash.com/photo-1550439062-609e1531270e?w=600&q=80",
                title: "Project 4",
              },
            ],
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
    ],
  },

  // Logo Cloud
  {
    type: "logo-cloud",
    name: "Logo Cloud",
    description: "Display client or partner logos",
    icon: "🏢",
    variants: [
      {
        name: "6-Logo Grid",
        description: "Standard logo grid",
        template: {
          type: "logo-cloud",
          visible: true,
          config: {
            title: "Trusted by Industry Leaders",
            logos: [
              {
                name: "Company A",
                url: "https://via.placeholder.com/150x50/4A90E2/FFF?text=Logo+A",
              },
              {
                name: "Company B",
                url: "https://via.placeholder.com/150x50/E94B3C/FFF?text=Logo+B",
              },
              {
                name: "Company C",
                url: "https://via.placeholder.com/150x50/50C878/FFF?text=Logo+C",
              },
              {
                name: "Company D",
                url: "https://via.placeholder.com/150x50/FFB347/FFF?text=Logo+D",
              },
            ],
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
    ],
  },

  // Contact Section
  {
    type: "contact",
    name: "Contact Section",
    description: "Contact forms with optional company information",
    icon: "📧",
    variants: [
      {
        name: "Form Only",
        description: "Simple centered contact form",
        template: {
          type: "contact",
          visible: true,
          config: {
            title: "Get In Touch",
            description: "We'd love to hear from you",
            fields: [
              { name: "name", label: "Name", type: "text", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "message", label: "Message", type: "textarea", required: true },
            ],
            submitText: "Send Message",
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
      {
        name: "Split with Info",
        description: "Form with contact details sidebar",
        template: {
          type: "contact",
          visible: true,
          config: {
            title: "Contact Us",
            description: "We'll get back to you within 24 hours",
            layout: "split",
            fields: [
              { name: "name", label: "Full Name", type: "text", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "message", label: "Message", type: "textarea", required: true },
            ],
            submitText: "Submit",
            contactInfo: {
              email: "hello@company.com",
              phone: "+1 (555) 123-4567",
              address: "123 Business St, San Francisco, CA",
            },
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
    ],
  },

  // Content Section
  {
    type: "content",
    name: "Content Section",
    description: "Rich content areas with text and images",
    icon: "📄",
    variants: [
      {
        name: "Image Right",
        description: "Text left, image right",
        template: {
          type: "content",
          visible: true,
          config: {
            title: "Why Choose Us",
            subtitle: "THE BEST CHOICE",
            content: "We combine years of experience with cutting-edge technology.",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
            imagePosition: "right",
            features: ["Expert team", "24/7 support", "Proven results"],
            cta: { text: "Learn More", link: "#" },
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
      {
        name: "Image Left",
        description: "Image left, text right",
        template: {
          type: "content",
          visible: true,
          config: {
            title: "Our Mission",
            subtitle: "WHAT DRIVES US",
            content: "Empowering businesses with tools for success.",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
            imagePosition: "left",
            cta: { text: "Read Our Story", link: "#" },
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
    ],
  },

  // Newsletter Section
  {
    type: "newsletter",
    name: "Newsletter Signup",
    description: "Email subscription forms",
    icon: "📬",
    variants: [
      {
        name: "Centered Minimal",
        description: "Simple centered signup",
        template: {
          type: "newsletter",
          visible: true,
          config: {
            title: "Stay Updated",
            description: "Get the latest news delivered to your inbox",
            placeholder: "Enter your email",
            buttonText: "Subscribe",
            style: "centered",
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
      {
        name: "Inline Horizontal",
        description: "Compact inline form",
        template: {
          type: "newsletter",
          visible: true,
          config: {
            title: "Join Our Newsletter",
            description: "Weekly insights from experts",
            placeholder: "you@example.com",
            buttonText: "Sign Up",
            style: "inline",
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
    ],
  },

  // Video Section
  {
    type: "video",
    name: "Video Section",
    description: "Embed videos with optional content",
    icon: "🎥",
    variants: [
      {
        name: "16:9 Standard",
        description: "Full-width video",
        template: {
          type: "video",
          visible: true,
          config: {
            title: "Watch Our Demo",
            description: "See how it works in 2 minutes",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            aspectRatio: "16:9",
            background: { type: "solid", color: "#ffffff" },
          },
        },
      },
    ],
  },

  // Footer Section
  {
    type: "footer",
    name: "Footer",
    description: "Page footer with links",
    icon: "⬇️",
    variants: [
      {
        name: "3-Column Footer",
        description: "Standard footer with 3 columns",
        template: {
          type: "footer",
          visible: true,
          config: {
            logo: "Your Company",
            tagline: "Building the future",
            columns: [
              {
                title: "Product",
                links: [
                  { text: "Features", url: "#" },
                  { text: "Pricing", url: "#" },
                ],
              },
              {
                title: "Company",
                links: [
                  { text: "About", url: "#" },
                  { text: "Blog", url: "#" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { text: "Privacy", url: "#" },
                  { text: "Terms", url: "#" },
                ],
              },
            ],
            social: [
              { platform: "twitter", url: "#" },
              { platform: "linkedin", url: "#" },
            ],
            copyright: "© 2024 Your Company. All rights reserved.",
          },
        },
      },
      {
        name: "Minimal Footer",
        description: "Clean simple footer",
        template: {
          type: "footer",
          visible: true,
          config: {
            logo: "Brand",
            style: "minimal",
            links: [
              { text: "About", url: "#" },
              { text: "Privacy", url: "#" },
              { text: "Terms", url: "#" },
            ],
            social: [{ platform: "twitter", url: "#" }],
            copyright: "© 2024 Brand",
          },
        },
      },
    ],
  },
];

export const componentCategories: ComponentCategory[] = categories;
