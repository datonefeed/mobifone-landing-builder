"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentConfig } from "@/types/landing";

interface GenerateHTMLOptions {
  includeInlineCSS?: boolean;
  minify?: boolean;
  title?: string;
  description?: string;
}

export class HTMLGenerator {
  private static readonly DEFAULT_FONTS = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  `;

  private static readonly BASE_STYLES = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      overflow-x: hidden;
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    a {
      text-decoration: none;
      color: inherit;
    }
    
    button {
      font-family: inherit;
      cursor: pointer;
    }
  `;

  static generate(components: ComponentConfig[], options: GenerateHTMLOptions = {}): string {
    const {
      includeInlineCSS = true,
      title = "Landing Page",
      description = "Generated landing page",
    } = options;

    const sortedComponents = [...components]
      .filter((c) => c.visible !== false)
      .sort((a, b) => a.order - b.order);

    const htmlContent = sortedComponents
      .map((component) => this.generateComponentHTML(component))
      .join("\n");

    const cssContent = includeInlineCSS
      ? `<style>\n${this.BASE_STYLES}\n${this.generateCSS(sortedComponents)}\n</style>`
      : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${this.escapeHTML(description)}">
  <title>${this.escapeHTML(title)}</title>
  ${this.DEFAULT_FONTS}
  ${cssContent}
</head>
<body>
${htmlContent}
</body>
</html>`;
  }

  private static generateComponentHTML(component: ComponentConfig): string {
    const { type, config, id } = component;

    switch (type) {
      case "hero":
        return this.generateHeroHTML(id, config);
      case "features":
        return this.generateFeaturesHTML(id, config);
      case "cta":
        return this.generateCTAHTML(id, config);
      case "footer":
        return this.generateFooterHTML(id, config);
      case "header":
        return this.generateHeaderHTML(id, config);
      case "pricing":
        return this.generatePricingHTML(id, config);
      case "testimonials":
        return this.generateTestimonialsHTML(id, config);
      case "faq":
        return this.generateFAQHTML(id, config);
      case "contact":
        return this.generateContactHTML(id, config);
      case "stats":
        return this.generateStatsHTML(id, config);
      case "logo-cloud":
        return this.generateLogoCloudHTML(id, config);
      case "newsletter":
        return this.generateNewsletterHTML(id, config);
      case "gallery":
        return this.generateGalleryHTML(id, config);
      case "content":
        return this.generateContentHTML(id, config);
      default:
        return `<!-- Unknown component type: ${type} -->`;
    }
  }

  private static generateHeroHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const alignment = config.alignment || "center";
    const padding = this.getPaddingClass(config.spacing?.padding);

    return `  <section id="${id}" class="hero-section ${padding}" style="${bgStyle}">
    <div class="container">
      <div class="hero-content text-${alignment}">
        ${config.subtitle ? `<p class="hero-subtitle">${this.escapeHTML(config.subtitle)}</p>` : ""}
        <h1 class="hero-title">${this.escapeHTML(config.title || "")}</h1>
        ${config.description ? `<p class="hero-description">${this.escapeHTML(config.description)}</p>` : ""}
        <div class="hero-cta">
          ${config.primaryCTA ? this.generateButtonHTML(config.primaryCTA, "primary") : ""}
          ${config.secondaryCTA ? this.generateButtonHTML(config.secondaryCTA, "secondary") : ""}
        </div>
      </div>
    </div>
  </section>`;
  }

  private static generateFeaturesHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const padding = this.getPaddingClass(config.spacing?.padding);
    const columns = config.columns || 3;
    const features = config.features || [];

    return `  <section id="${id}" class="features-section ${padding}" style="${bgStyle}">
    <div class="container">
      ${config.title ? `<h2 class="section-title">${this.escapeHTML(config.title)}</h2>` : ""}
      ${config.subtitle ? `<p class="section-subtitle">${this.escapeHTML(config.subtitle)}</p>` : ""}
      ${config.description ? `<p class="section-description">${this.escapeHTML(config.description)}</p>` : ""}
      <div class="features-grid cols-${columns}">
        ${features
          .map(
            (feature: any) => `
        <div class="feature-card">
          ${feature.icon ? `<div class="feature-icon">${feature.icon}</div>` : ""}
          ${feature.image ? `<img src="${this.escapeHTML(feature.image)}" alt="${this.escapeHTML(feature.title)}" class="feature-image">` : ""}
          <h3 class="feature-title">${this.escapeHTML(feature.title || "")}</h3>
          <p class="feature-description">${this.escapeHTML(feature.description || "")}</p>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
  }

  private static generateCTAHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const padding = this.getPaddingClass(config.spacing?.padding);
    const alignment = config.alignment || "center";

    return `  <section id="${id}" class="cta-section ${padding} text-${alignment}" style="${bgStyle}">
    <div class="container">
      ${config.subtitle ? `<p class="cta-subtitle">${this.escapeHTML(config.subtitle)}</p>` : ""}
      <h2 class="cta-title">${this.escapeHTML(config.title || "")}</h2>
      ${config.description ? `<p class="cta-description">${this.escapeHTML(config.description)}</p>` : ""}
      <div class="cta-buttons">
        ${config.primaryCTA ? this.generateButtonHTML(config.primaryCTA, "primary") : ""}
        ${config.secondaryCTA ? this.generateButtonHTML(config.secondaryCTA, "secondary") : ""}
      </div>
    </div>
  </section>`;
  }

  private static generateFooterHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const links = config.links || [];

    return `  <footer id="${id}" class="footer-section" style="${bgStyle}">
    <div class="container">
      <div class="footer-content">
        ${config.logo ? `<div class="footer-logo">${this.escapeHTML(config.logo)}</div>` : ""}
        ${config.description ? `<p class="footer-description">${this.escapeHTML(config.description)}</p>` : ""}
        ${
          links.length > 0
            ? `
        <div class="footer-links">
          ${links
            .map(
              (linkGroup: any) => `
          <div class="footer-link-group">
            <h4>${this.escapeHTML(linkGroup.title || "")}</h4>
            <ul>
              ${(linkGroup.items || [])
                .map(
                  (item: any) => `
              <li><a href="${this.escapeHTML(item.url || "#")}">${this.escapeHTML(item.label || "")}</a></li>
              `
                )
                .join("")}
            </ul>
          </div>
          `
            )
            .join("")}
        </div>`
            : ""
        }
        ${config.copyright ? `<p class="footer-copyright">${this.escapeHTML(config.copyright)}</p>` : ""}
      </div>
    </div>
  </footer>`;
  }

  private static generateHeaderHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const tabs = config.tabs || [];

    return `  <header id="${id}" class="header-section" style="${bgStyle}">
    <div class="container">
      <div class="header-content">
        ${config.logo ? `<div class="header-logo">${this.escapeHTML(config.logo)}</div>` : ""}
        ${
          tabs.length > 0
            ? `
        <nav class="header-nav">
          ${tabs
            .map(
              (tab: any) => `
          <a href="${this.escapeHTML(tab.link || "#")}" class="nav-link">${this.escapeHTML(tab.label || "")}</a>
          `
            )
            .join("")}
        </nav>`
            : ""
        }
        ${config.cta ? this.generateButtonHTML(config.cta, "primary") : ""}
      </div>
    </div>
  </header>`;
  }

  private static generatePricingHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const padding = this.getPaddingClass(config.spacing?.padding);
    const plans = config.plans || [];

    return `  <section id="${id}" class="pricing-section ${padding}" style="${bgStyle}">
    <div class="container">
      ${config.title ? `<h2 class="section-title">${this.escapeHTML(config.title)}</h2>` : ""}
      ${config.subtitle ? `<p class="section-subtitle">${this.escapeHTML(config.subtitle)}</p>` : ""}
      <div class="pricing-grid">
        ${plans
          .map(
            (plan: any) => `
        <div class="pricing-card ${plan.featured ? "featured" : ""}">
          <h3 class="plan-name">${this.escapeHTML(plan.name || "")}</h3>
          <div class="plan-price">
            <span class="price-amount">${this.escapeHTML(plan.price || "")}</span>
            ${plan.period ? `<span class="price-period">/${this.escapeHTML(plan.period)}</span>` : ""}
          </div>
          ${plan.description ? `<p class="plan-description">${this.escapeHTML(plan.description)}</p>` : ""}
          ${
            plan.features
              ? `
          <ul class="plan-features">
            ${plan.features.map((feature: string) => `<li>${this.escapeHTML(feature)}</li>`).join("")}
          </ul>`
              : ""
          }
          ${plan.cta ? this.generateButtonHTML(plan.cta, plan.featured ? "primary" : "secondary") : ""}
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
  }

  private static generateTestimonialsHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const padding = this.getPaddingClass(config.spacing?.padding);
    const testimonials = config.testimonials || [];

    return `  <section id="${id}" class="testimonials-section ${padding}" style="${bgStyle}">
    <div class="container">
      ${config.title ? `<h2 class="section-title">${this.escapeHTML(config.title)}</h2>` : ""}
      ${config.subtitle ? `<p class="section-subtitle">${this.escapeHTML(config.subtitle)}</p>` : ""}
      <div class="testimonials-grid">
        ${testimonials
          .map(
            (testimonial: any) => `
        <div class="testimonial-card">
          ${testimonial.image ? `<img src="${this.escapeHTML(testimonial.image)}" alt="${this.escapeHTML(testimonial.name)}" class="testimonial-avatar">` : ""}
          <p class="testimonial-text">"${this.escapeHTML(testimonial.content || "")}"</p>
          <p class="testimonial-name">${this.escapeHTML(testimonial.name || "")}</p>
          ${testimonial.role ? `<p class="testimonial-role">${this.escapeHTML(testimonial.role)}</p>` : ""}
          ${testimonial.company ? `<p class="testimonial-company">${this.escapeHTML(testimonial.company)}</p>` : ""}
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
  }

  private static generateFAQHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const padding = this.getPaddingClass(config.spacing?.padding);
    const faqs = config.faqs || [];

    return `  <section id="${id}" class="faq-section ${padding}" style="${bgStyle}">
    <div class="container">
      ${config.title ? `<h2 class="section-title">${this.escapeHTML(config.title)}</h2>` : ""}
      ${config.subtitle ? `<p class="section-subtitle">${this.escapeHTML(config.subtitle)}</p>` : ""}
      <div class="faq-list">
        ${faqs
          .map(
            (faq: any) => `
        <div class="faq-item">
          <h3 class="faq-question">${this.escapeHTML(faq.question || "")}</h3>
          <p class="faq-answer">${this.escapeHTML(faq.answer || "")}</p>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
  }

  private static generateContactHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const padding = this.getPaddingClass(config.spacing?.padding);

    return `  <section id="${id}" class="contact-section ${padding}" style="${bgStyle}">
    <div class="container">
      ${config.title ? `<h2 class="section-title">${this.escapeHTML(config.title)}</h2>` : ""}
      ${config.subtitle ? `<p class="section-subtitle">${this.escapeHTML(config.subtitle)}</p>` : ""}
      <form class="contact-form" action="${this.escapeHTML(config.formAction || "#")}" method="POST">
        <input type="text" name="name" placeholder="Your Name" required class="form-input">
        <input type="email" name="email" placeholder="Your Email" required class="form-input">
        ${config.includePhone ? `<input type="tel" name="phone" placeholder="Phone Number" class="form-input">` : ""}
        <textarea name="message" placeholder="Your Message" rows="5" required class="form-textarea"></textarea>
        <button type="submit" class="form-submit-btn">${this.escapeHTML(config.submitText || "Send Message")}</button>
      </form>
    </div>
  </section>`;
  }

  private static generateStatsHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const padding = this.getPaddingClass(config.spacing?.padding);
    const stats = config.stats || [];

    return `  <section id="${id}" class="stats-section ${padding}" style="${bgStyle}">
    <div class="container">
      <div class="stats-grid">
        ${stats
          .map(
            (stat: any) => `
        <div class="stat-item">
          <div class="stat-value">${this.escapeHTML(stat.value || "")}</div>
          <div class="stat-label">${this.escapeHTML(stat.label || "")}</div>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
  }

  private static generateLogoCloudHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const padding = this.getPaddingClass(config.spacing?.padding);
    const logos = config.logos || [];

    return `  <section id="${id}" class="logo-cloud-section ${padding}" style="${bgStyle}">
    <div class="container">
      ${config.title ? `<h2 class="section-title">${this.escapeHTML(config.title)}</h2>` : ""}
      <div class="logo-cloud-grid">
        ${logos
          .map(
            (logo: any) => `
        <div class="logo-item">
          <img src="${this.escapeHTML(logo.image || logo.url || "")}" alt="${this.escapeHTML(logo.name || "Logo")}" class="logo-image">
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
  }

  private static generateNewsletterHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const padding = this.getPaddingClass(config.spacing?.padding);

    return `  <section id="${id}" class="newsletter-section ${padding}" style="${bgStyle}">
    <div class="container">
      ${config.title ? `<h2 class="section-title">${this.escapeHTML(config.title)}</h2>` : ""}
      ${config.description ? `<p class="section-description">${this.escapeHTML(config.description)}</p>` : ""}
      <form class="newsletter-form" action="${this.escapeHTML(config.formAction || "#")}" method="POST">
        <input type="email" name="email" placeholder="${this.escapeHTML(config.placeholder || "Enter your email")}" required class="newsletter-input">
        <button type="submit" class="newsletter-submit">${this.escapeHTML(config.submitText || "Subscribe")}</button>
      </form>
    </div>
  </section>`;
  }

  private static generateGalleryHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const padding = this.getPaddingClass(config.spacing?.padding);
    const images = config.images || [];
    const columns = config.columns || 3;

    return `  <section id="${id}" class="gallery-section ${padding}" style="${bgStyle}">
    <div class="container">
      ${config.title ? `<h2 class="section-title">${this.escapeHTML(config.title)}</h2>` : ""}
      <div class="gallery-grid cols-${columns}">
        ${images
          .map(
            (image: any) => `
        <div class="gallery-item">
          <img src="${this.escapeHTML(image.url || image.src || "")}" alt="${this.escapeHTML(image.alt || "Gallery image")}" class="gallery-image">
          ${image.caption ? `<p class="gallery-caption">${this.escapeHTML(image.caption)}</p>` : ""}
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
  }

  private static generateContentHTML(id: string, config: Record<string, any>): string {
    const bgStyle = this.getBackgroundStyle(config.background);
    const padding = this.getPaddingClass(config.spacing?.padding);

    return `  <section id="${id}" class="content-section ${padding}" style="${bgStyle}">
    <div class="container">
      ${config.title ? `<h2 class="section-title">${this.escapeHTML(config.title)}</h2>` : ""}
      ${config.content ? `<div class="content-body">${config.content}</div>` : ""}
    </div>
  </section>`;
  }

  private static generateButtonHTML(cta: Record<string, any>, variant: string): string {
    return `<a href="${this.escapeHTML(cta.link || "#")}" class="btn btn-${variant}">${this.escapeHTML(cta.text || "Click Here")}</a>`;
  }

  private static getBackgroundStyle(background: Record<string, any> | undefined): string {
    if (!background) return "";

    switch (background.type) {
      case "solid":
        return `background-color: ${this.getTailwindColor(background.color)};`;
      case "gradient":
        const { from, to, direction = "to-r" } = background.gradient || {};
        const gradientDirection = this.getGradientDirection(direction);
        return `background: linear-gradient(${gradientDirection}, ${this.getTailwindColor(from)}, ${this.getTailwindColor(to)});`;
      case "image":
        return `background-image: url('${this.escapeHTML(background.image)}'); background-size: cover; background-position: center;`;
      default:
        return "";
    }
  }

  private static getGradientDirection(direction: string): string {
    const directionMap: Record<string, string> = {
      "to-r": "to right",
      "to-l": "to left",
      "to-t": "to top",
      "to-b": "to bottom",
      "to-br": "to bottom right",
      "to-bl": "to bottom left",
      "to-tr": "to top right",
      "to-tl": "to top left",
    };
    return directionMap[direction] || "to right";
  }

  private static getTailwindColor(color: string): string {
    if (!color) return "#ffffff";

    // If it's already a hex/rgb color
    if (color.startsWith("#") || color.startsWith("rgb")) return color;

    // Map Tailwind colors to actual hex values
    const colorMap: Record<string, string> = {
      white: "#ffffff",
      black: "#000000",
      "gray-50": "#f9fafb",
      "gray-100": "#f3f4f6",
      "gray-200": "#e5e7eb",
      "gray-300": "#d1d5db",
      "gray-400": "#9ca3af",
      "gray-500": "#6b7280",
      "gray-600": "#4b5563",
      "gray-700": "#374151",
      "gray-800": "#1f2937",
      "gray-900": "#111827",
      "blue-50": "#eff6ff",
      "blue-100": "#dbeafe",
      "blue-200": "#bfdbfe",
      "blue-300": "#93c5fd",
      "blue-400": "#60a5fa",
      "blue-500": "#3b82f6",
      "blue-600": "#2563eb",
      "blue-700": "#1d4ed8",
      "blue-800": "#1e40af",
      "blue-900": "#1e3a8a",
      "purple-600": "#9333ea",
      "purple-700": "#7e22ce",
      "red-600": "#dc2626",
      "green-600": "#16a34a",
      "yellow-600": "#ca8a04",
      "pink-600": "#db2777",
      "indigo-600": "#4f46e5",
    };

    return colorMap[color] || "#3b82f6"; // Default to blue-500
  }

  private static getPaddingClass(padding?: string): string {
    const paddingMap: Record<string, string> = {
      none: "py-0",
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
      xl: "py-24",
    };
    return paddingMap[padding || "lg"] || "py-16";
  }

  private static escapeHTML(text: unknown): string {
    // Handle null/undefined
    if (text == null || text === undefined) return "";

    // Force convert to string using concatenation
    let str = "";
    try {
      str = "" + text;
    } catch {
      return "";
    }

    // Manual character-by-character escape
    let escaped = "";
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (c === "&") {
        escaped += "&amp;";
      } else if (c === "<") {
        escaped += "&lt;";
      } else if (c === ">") {
        escaped += "&gt;";
      } else if (c === '"') {
        escaped += "&quot;";
      } else if (c === "'") {
        escaped += "&#039;";
      } else {
        escaped += c;
      }
    }
    return escaped;
  }

  private static generateCSS(_components: ComponentConfig[]): string {
    return `
    /* Container */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    /* Section Spacing */
    .py-0 { padding-top: 0; padding-bottom: 0; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
    .py-24 { padding-top: 6rem; padding-bottom: 6rem; }

    /* Text Alignment */
    .text-left { text-align: left; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }

    /* Hero Section */
    .hero-section {
      position: relative;
      color: white;
    }
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    .hero-subtitle {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      opacity: 0.9;
    }
    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.2;
    }
    .hero-description {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.95;
    }
    .hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Features Section */
    .features-section {
      background: white;
    }
    .features-grid {
      display: grid;
      gap: 2rem;
      margin-top: 3rem;
    }
    .features-grid.cols-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    .features-grid.cols-3 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .features-grid.cols-4 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
    .feature-card {
      text-align: center;
      padding: 2rem;
      border-radius: 0.5rem;
      transition: transform 0.3s;
    }
    .feature-card:hover {
      transform: translateY(-5px);
    }
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .feature-image {
      width: 100%;
      max-width: 200px;
      margin: 0 auto 1rem;
      border-radius: 0.5rem;
    }
    .feature-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }
    .feature-description {
      color: #6b7280;
      line-height: 1.6;
    }

    /* CTA Section */
    .cta-section {
      color: white;
    }
    .cta-subtitle {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      opacity: 0.9;
    }
    .cta-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .cta-description {
      font-size: 1.125rem;
      margin-bottom: 2rem;
      opacity: 0.95;
    }
    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Section Titles */
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0.5rem;
    }
    .section-subtitle {
      font-size: 1.125rem;
      text-align: center;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }
    .section-description {
      font-size: 1rem;
      text-align: center;
      color: #6b7280;
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    /* Buttons */
    .btn {
      display: inline-block;
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: all 0.3s;
      border: none;
    }
    .btn-primary {
      background-color: #2563eb;
      color: white;
    }
    .btn-primary:hover {
      background-color: #1d4ed8;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .btn-secondary {
      background-color: white;
      color: #2563eb;
      border: 2px solid #2563eb;
    }
    .btn-secondary:hover {
      background-color: #2563eb;
      color: white;
      transform: translateY(-2px);
    }

    /* Header */
    .header-section {
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }
    .header-logo {
      font-size: 1.5rem;
      font-weight: 700;
    }
    .header-nav {
      display: flex;
      gap: 2rem;
      flex: 1;
      justify-content: center;
    }
    .nav-link {
      font-weight: 500;
      transition: color 0.3s;
    }
    .nav-link:hover {
      color: #2563eb;
    }

    /* Footer */
    .footer-section {
      padding: 3rem 0 1rem;
      background: #1f2937;
      color: white;
    }
    .footer-content {
      text-align: center;
    }
    .footer-logo {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .footer-description {
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .footer-link-group h4 {
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .footer-link-group ul {
      list-style: none;
    }
    .footer-link-group li {
      margin-bottom: 0.5rem;
    }
    .footer-link-group a {
      opacity: 0.8;
      transition: opacity 0.3s;
    }
    .footer-link-group a:hover {
      opacity: 1;
    }
    .footer-copyright {
      padding-top: 2rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      opacity: 0.7;
    }

    /* Pricing */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }
    .pricing-card {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .pricing-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    }
    .pricing-card.featured {
      border-color: #2563eb;
      transform: scale(1.05);
    }
    .plan-name {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .plan-price {
      font-size: 3rem;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 1rem;
    }
    .price-period {
      font-size: 1rem;
      color: #6b7280;
    }
    .plan-description {
      color: #6b7280;
      margin-bottom: 1.5rem;
    }
    .plan-features {
      list-style: none;
      margin-bottom: 2rem;
      text-align: left;
    }
    .plan-features li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    /* Testimonials */
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }
    .testimonial-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .testimonial-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 auto 1rem;
      display: block;
      object-fit: cover;
    }
    .testimonial-text {
      font-style: italic;
      margin-bottom: 1rem;
      line-height: 1.6;
    }
    .testimonial-name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .testimonial-role,
    .testimonial-company {
      font-size: 0.875rem;
      color: #6b7280;
    }

    /* FAQ */
    .faq-list {
      max-width: 800px;
      margin: 3rem auto 0;
    }
    .faq-item {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .faq-question {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }
    .faq-answer {
      color: #6b7280;
      line-height: 1.6;
    }

    /* Contact Form */
    .contact-form {
      max-width: 600px;
      margin: 3rem auto 0;
    }
    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-family: inherit;
      font-size: 1rem;
    }
    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #2563eb;
    }
    .form-submit-btn {
      width: 100%;
      padding: 0.75rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .form-submit-btn:hover {
      background-color: #1d4ed8;
    }

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }
    .stat-item {
      text-align: center;
    }
    .stat-value {
      font-size: 3rem;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      font-size: 1.125rem;
      color: #6b7280;
    }

    /* Logo Cloud */
    .logo-cloud-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 2rem;
      align-items: center;
      margin-top: 3rem;
    }
    .logo-item {
      text-align: center;
    }
    .logo-image {
      max-width: 120px;
      height: auto;
      opacity: 0.6;
      transition: opacity 0.3s;
      margin: 0 auto;
      display: block;
    }
    .logo-image:hover {
      opacity: 1;
    }

    /* Newsletter */
    .newsletter-form {
      max-width: 500px;
      margin: 2rem auto 0;
      display: flex;
      gap: 0.5rem;
    }
    .newsletter-input {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
    }
    .newsletter-input:focus {
      outline: none;
      border-color: #2563eb;
    }
    .newsletter-submit {
      padding: 0.75rem 2rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .newsletter-submit:hover {
      background-color: #1d4ed8;
    }

    /* Gallery */
    .gallery-grid {
      display: grid;
      gap: 1rem;
      margin-top: 3rem;
    }
    .gallery-grid.cols-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    .gallery-grid.cols-3 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .gallery-grid.cols-4 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
    .gallery-item {
      position: relative;
      overflow: hidden;
      border-radius: 0.5rem;
    }
    .gallery-image {
      width: 100%;
      height: 250px;
      object-fit: cover;
      transition: transform 0.3s;
    }
    .gallery-item:hover .gallery-image {
      transform: scale(1.05);
    }
    .gallery-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 0.5rem;
      text-align: center;
    }

    /* Content Section */
    .content-body {
      max-width: 800px;
      margin: 2rem auto 0;
      line-height: 1.8;
    }
    .content-body h1,
    .content-body h2,
    .content-body h3 {
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }
    .content-body p {
      margin-bottom: 1rem;
    }
    .content-body ul,
    .content-body ol {
      margin-bottom: 1rem;
      padding-left: 2rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      .section-title {
        font-size: 1.75rem;
      }
      .header-nav {
        display: none;
      }
      .footer-links {
        flex-direction: column;
        gap: 2rem;
      }
      .newsletter-form {
        flex-direction: column;
      }
    }
    `;
  }
}
