"use client";

import { LandingPage } from "@/types/landing";
import { ComponentRenderer } from "./ComponentRenderer";
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

  return (
    <div className="min-h-screen">
      {sortedComponents.map((component) => (
        <ComponentRenderer key={component.id} component={component} theme={theme} />
      ))}
    </div>
  );
}
