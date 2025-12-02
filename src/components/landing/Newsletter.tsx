/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Theme, AnimationConfig } from "@/types/landing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackgroundConfig, getBackgroundStyle, isBackgroundDark } from "@/lib/background-utils";
import { AnimatedSection } from "@/components/landing/AnimatedSection";

interface NewsletterConfig {
  title: string;
  subtitle?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  showNameField?: boolean;
  layout?: "inline" | "stacked" | "centered";
  background: BackgroundConfig;
  spacing?: {
    padding?: "md" | "lg" | "xl";
  };
  animation?: AnimationConfig;
}

interface NewsletterProps {
  config: NewsletterConfig;
  theme?: Theme;
}

export function Newsletter({ config, theme }: NewsletterProps) {
  const {
    title,
    subtitle,
    description,
    placeholder = "Enter your email",
    buttonText = "Subscribe",
    showNameField = false,
    layout = "centered",
    background,
    spacing,
  } = config;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const primaryColor = "var(--color-primary)";
  const textColor = "var(--color-text)";
  const textMuted = "var(--color-text-muted)";
  const headingFont = "var(--font-heading)";
  const bodyFont = "var(--font-body)";

  const isDarkBg = isBackgroundDark(background);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", { email, name });
    setSubmitted(true);
    setTimeout(() => {
      setEmail("");
      setName("");
      setSubmitted(false);
    }, 3000);
  };

  const paddingClass =
    spacing?.padding === "xl" ? "py-20" : spacing?.padding === "md" ? "py-12" : "py-16";

  return (
    <AnimatedSection animation={config.animation}>
      <section className={`${paddingClass} px-4`} style={getBackgroundStyle(background)}>
        <div
          className={`container mx-auto ${layout === "centered" ? "max-w-3xl text-center" : "max-w-6xl"}`}
        >
          {layout === "inline" ? (
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                {subtitle && (
                  <div
                    className="text-sm font-semibold uppercase tracking-wider mb-4"
                    style={{ color: isDarkBg ? "rgba(255,255,255,0.9)" : primaryColor }}
                  >
                    {subtitle}
                  </div>
                )}
                <h2
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{
                    color: isDarkBg ? "#ffffff" : textColor,
                    fontFamily: headingFont,
                  }}
                >
                  {title}
                </h2>
                {description && (
                  <p
                    className="text-lg"
                    style={{
                      color: isDarkBg ? "rgba(255,255,255,0.8)" : textMuted,
                      fontFamily: bodyFont,
                    }}
                  >
                    {description}
                  </p>
                )}
              </div>

              <div className="flex-1 w-full max-w-md">
                <form onSubmit={handleSubmit} className="space-y-3">
                  {showNameField && (
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full"
                      disabled={submitted}
                    />
                  )}
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={placeholder}
                      className="flex-1"
                      disabled={submitted}
                    />
                    <Button
                      type="submit"
                      disabled={submitted}
                      style={{ backgroundColor: primaryColor }}
                    >
                      {submitted ? "✓ Subscribed!" : buttonText}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                {subtitle && (
                  <div
                    className="text-sm font-semibold uppercase tracking-wider mb-4"
                    style={{ color: isDarkBg ? "rgba(255,255,255,0.9)" : primaryColor }}
                  >
                    {subtitle}
                  </div>
                )}
                <h2
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{
                    color: isDarkBg ? "#ffffff" : textColor,
                    fontFamily: headingFont,
                  }}
                >
                  {title}
                </h2>
                {description && (
                  <p
                    className="text-lg max-w-2xl mx-auto"
                    style={{
                      color: isDarkBg ? "rgba(255,255,255,0.8)" : textMuted,
                      fontFamily: bodyFont,
                    }}
                  >
                    {description}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-3">
                {showNameField && (
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full"
                    disabled={submitted}
                  />
                )}
                <div className={`flex ${layout === "stacked" ? "flex-col" : "flex-row"} gap-3`}>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1"
                    disabled={submitted}
                  />
                  <Button
                    type="submit"
                    className={layout === "stacked" ? "w-full" : ""}
                    disabled={submitted}
                    style={{ backgroundColor: primaryColor }}
                  >
                    {submitted ? "✓ Subscribed!" : buttonText}
                  </Button>
                </div>
                {submitted && (
                  <p
                    className="text-sm text-center"
                    style={{ color: isDarkBg ? "rgba(255,255,255,0.9)" : primaryColor }}
                  >
                    Thank you for subscribing!
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </section>
    </AnimatedSection>
  );
}
