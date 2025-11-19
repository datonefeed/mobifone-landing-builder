"use client";

import { LandingPage } from "@/types/landing";
import { ComponentRenderer } from "./ComponentRenderer";
import { ThemeProvider } from "./ThemeProvider";
import { LandingPageLoader } from "./LandingPageLoader";
import { getTheme } from "@/lib/themes";

interface MultiPageRendererProps {
  page: LandingPage;
}

export default function MultiPageRenderer({ page }: MultiPageRendererProps) {
  const theme = getTheme(page.theme || "modern");

  // Sort and filter components
  const sortedComponents = [...page.components]
    .filter((c) => c.visible !== false)
    .sort((a, b) => a.order - b.order);

  // Get loading configuration
  const loadingConfig = page.loading || {
    enabled: false,
    type: "spin" as const,
    color: "#f97316",
    duration: 1000,
    minDuration: 500,
  };

  return (
    <ThemeProvider theme={theme}>
      <LandingPageLoader
        enabled={loadingConfig.enabled}
        type={loadingConfig.type}
        color={loadingConfig.color || "#f97316"}
        duration={loadingConfig.duration || 1000}
        minDuration={loadingConfig.minDuration || 500}
      >
        <main className="min-h-screen">
          {sortedComponents.map((component) => (
            <ComponentRenderer key={component.id} component={component} theme={theme} />
          ))}
        </main>
      </LandingPageLoader>
    </ThemeProvider>
  );
}
