"use client";

import { useState } from "react";
import { Theme, AnimationConfig } from "@/types/landing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/landing/AnimatedSection";

interface ContactConfig {
  title: string;
  subtitle?: string;
  description?: string;
  formFields?: {
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    company?: boolean;
    message?: boolean;
  };
  submitText?: string;
  contactInfo?: {
    address?: string;
    phone?: string;
    email?: string;
    hours?: string;
  };
  layout?: "form-only" | "with-info" | "split";
  background: {
    type: "solid";
    color?: string;
  };
  spacing?: {
    padding?: "md" | "lg" | "xl";
  };
  animation?: AnimationConfig;
}

interface ContactProps {
  config: ContactConfig;
  theme?: Theme;
}

export function Contact({ config, theme }: ContactProps) {
  const {
    title,
    subtitle,
    description,
    formFields = {
      name: true,
      email: true,
      phone: false,
      company: false,
      message: true,
    },
    submitText = "Send Message",
    contactInfo,
    layout = "form-only",
    background,
    spacing,
  } = config;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const primaryColor = "var(--color-primary)";
  const textColor = "var(--color-text)";
  const textMuted = "var(--color-text-muted)";
  const surfaceColor = "var(--color-surface)";
  const headingFont = "var(--font-heading)";
  const bodyFont = "var(--font-body)";

  const getBackgroundColor = () => {
    if (background.color === "background") return "var(--color-background)";
    if (background.color === "surface") return surfaceColor;
    return background.color || "#ffffff";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const paddingClass = spacing?.padding === "xl" ? "py-20" : "py-16";

  return (
    <AnimatedSection animation={config.animation}>
      <section className={`${paddingClass} px-4`} style={{ backgroundColor: getBackgroundColor() }}>
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            {subtitle && (
              <div
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: primaryColor }}
              >
                {subtitle}
              </div>
            )}

            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: textColor, fontFamily: headingFont }}
            >
              {title}
            </h2>

            {description && (
              <p className="text-lg" style={{ color: textMuted, fontFamily: bodyFont }}>
                {description}
              </p>
            )}
          </div>

          {/* Content */}
          <div
            className={`grid grid-cols-1 ${layout === "split" || layout === "with-info" ? "lg:grid-cols-2" : ""} gap-12`}
          >
            {/* Contact Form */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formFields.name && (
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                        style={{ color: textColor }}
                      >
                        Name *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                  )}

                  {formFields.email && (
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                        style={{ color: textColor }}
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  )}

                  {formFields.phone && (
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-2"
                        style={{ color: textColor }}
                      >
                        Phone
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  )}

                  {formFields.company && (
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium mb-2"
                        style={{ color: textColor }}
                      >
                        Company
                      </label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your company"
                      />
                    </div>
                  )}

                  {formFields.message && (
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-2"
                        style={{ color: textColor }}
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your project..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{ borderColor: "#e5e7eb" }}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {submitText}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            {(layout === "split" || layout === "with-info") && contactInfo && (
              <div className="space-y-8">
                <div>
                  <h3
                    className="text-2xl font-bold mb-6"
                    style={{ color: textColor, fontFamily: headingFont }}
                  >
                    Contact Information
                  </h3>

                  <div className="space-y-4">
                    {contactInfo.address && (
                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${primaryColor}20` }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: primaryColor }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium mb-1" style={{ color: textColor }}>
                            Address
                          </div>
                          <div style={{ color: textMuted }}>{contactInfo.address}</div>
                        </div>
                      </div>
                    )}

                    {contactInfo.phone && (
                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${primaryColor}20` }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: primaryColor }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium mb-1" style={{ color: textColor }}>
                            Phone
                          </div>
                          <a
                            href={`tel:${contactInfo.phone}`}
                            style={{ color: textMuted }}
                            className="hover:underline"
                          >
                            {contactInfo.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {contactInfo.email && (
                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${primaryColor}20` }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: primaryColor }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium mb-1" style={{ color: textColor }}>
                            Email
                          </div>
                          <a
                            href={`mailto:${contactInfo.email}`}
                            style={{ color: textMuted }}
                            className="hover:underline"
                          >
                            {contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {contactInfo.hours && (
                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${primaryColor}20` }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: primaryColor }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium mb-1" style={{ color: textColor }}>
                            Business Hours
                          </div>
                          <div style={{ color: textMuted }}>{contactInfo.hours}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
