"use client";

import { Theme, CTAConfig } from "@/types/landing";
import { Button } from "@/components/ui/button";
import { getBackgroundStyle, isBackgroundDark } from "@/lib/background-utils";
import { getLayoutClasses } from "@/lib/layout-utils";
import { AnimatedSection } from "@/components/landing/AnimatedSection";

interface CTAProps {
  config: CTAConfig;
  theme?: Theme;
}

export function CTA({ config }: CTAProps) {
  const {
    title,
    description,
    primaryCTA,
    secondaryCTA,
    background,
    spacing,
    alignment = "center",
    containerWidth,
    animation,
  } = config;

  // Use CSS variables for theme colors
  const primaryColor = "var(--color-primary)";
  const textColor = "var(--color-text)";
  const textMuted = "var(--color-text-muted)";
  const bgColor = "var(--color-background)";
  const headingFont = "var(--font-heading)";
  const bodyFont = "var(--font-body)";

  const isDarkBg = isBackgroundDark(background);
  const layout = getLayoutClasses({ spacing, containerWidth, alignment });

  // Handle CTA click - support both hash links and page navigation
  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    // Handle hash links for smooth scrolling
    if (link.startsWith("#")) {
      e.preventDefault();
      const targetId = link.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = 80; // Approximate header height
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
      return;
    }
    // For other links (like /slug/subpage), let the browser handle it naturally
  };

  return (
    <AnimatedSection animation={animation}>
      <section className={`${layout.section}`} style={getBackgroundStyle(background, bgColor)}>
        <div className={`${layout.container} ${layout.alignment} max-w-4xl`}>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              color: isDarkBg ? "#ffffff" : textColor,
              fontFamily: headingFont,
            }}
          >
            {title}
          </h2>

          <p
            className="text-lg md:text-xl mb-8"
            style={{
              color: isDarkBg ? "rgba(255,255,255,0.9)" : textMuted,
              fontFamily: bodyFont,
            }}
          >
            {description}
          </p>

          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-wrap gap-4 justify-center">
              {primaryCTA && (
                <Button
                  asChild
                  size="lg"
                  style={{
                    backgroundColor: isDarkBg ? "#ffffff" : primaryColor,
                    color: isDarkBg ? "#000000" : "#ffffff",
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  <a href={primaryCTA.link} onClick={(e) => handleCTAClick(e, primaryCTA.link)}>
                    {primaryCTA.text}
                  </a>
                </Button>
              )}
              {secondaryCTA && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  style={{
                    borderColor: isDarkBg ? "#ffffff" : primaryColor,
                    color: isDarkBg ? "#ffffff" : primaryColor,
                    backgroundColor: isDarkBg ? "transparent" : "transparent",
                  }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <a href={secondaryCTA.link} onClick={(e) => handleCTAClick(e, secondaryCTA.link)}>
                    {secondaryCTA.text}
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </AnimatedSection>
  );
}
