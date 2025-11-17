"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Palette } from "lucide-react";
import { getThemesArray, getTheme } from "@/lib/themes";
import { Theme } from "@/types/landing";

interface ThemeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentThemeId: string;
  onThemeChange: (themeId: string) => void;
}

export default function ThemeSelector({
  open,
  onOpenChange,
  currentThemeId,
  onThemeChange,
}: ThemeSelectorProps) {
  const [selectedThemeId, setSelectedThemeId] = useState(currentThemeId);
  const [hoveredThemeId, setHoveredThemeId] = useState<string | null>(null);
  const themes = getThemesArray();

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
  };

  const handleApplyTheme = () => {
    onThemeChange(selectedThemeId);
    onOpenChange(false);
  };

  const renderColorPalette = (themeId: string) => {
    const theme = getTheme(themeId);
    return (
      <div className="flex gap-1 mt-2">
        <div
          className="w-6 h-6 rounded border border-gray-200"
          style={{ backgroundColor: theme.colors.primary }}
          title="Primary"
        />
        <div
          className="w-6 h-6 rounded border border-gray-200"
          style={{ backgroundColor: theme.colors.secondary }}
          title="Secondary"
        />
        <div
          className="w-6 h-6 rounded border border-gray-200"
          style={{ backgroundColor: theme.colors.accent }}
          title="Accent"
        />
        <div
          className="w-6 h-6 rounded border border-gray-200"
          style={{ backgroundColor: theme.colors.background }}
          title="Background"
        />
      </div>
    );
  };

  const renderThemePreview = (theme: Theme, themeId: string) => {
    return (
      <div
        className="w-full h-32 rounded-lg border-2 overflow-hidden"
        style={{
          backgroundColor: theme.colors.background,
          borderColor: selectedThemeId === themeId ? theme.colors.primary : "#E5E7EB",
        }}
      >
        {/* Mini preview of landing page */}
        <div className="h-full p-3 space-y-2">
          {/* Header bar */}
          <div
            className="h-2 rounded"
            style={{
              background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
            }}
          />

          {/* Content blocks */}
          <div className="space-y-1.5">
            <div
              className="h-4 rounded"
              style={{ backgroundColor: theme.colors.surface, opacity: 0.8 }}
            />
            <div
              className="h-3 rounded w-3/4"
              style={{ backgroundColor: theme.colors.surface, opacity: 0.6 }}
            />
          </div>

          {/* Button */}
          <div className="flex gap-1 pt-1">
            <div className="h-3 w-12 rounded" style={{ backgroundColor: theme.colors.primary }} />
            <div
              className="h-3 w-12 rounded border"
              style={{ borderColor: theme.colors.primary }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            <div>
              <SheetTitle>Choose Theme</SheetTitle>
              <SheetDescription>
                Select a color theme for your landing page ({themes.length} themes available)
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((themePreview) => {
              const theme = getTheme(themePreview.id);
              const isSelected = selectedThemeId === themePreview.id;
              const isHovered = hoveredThemeId === themePreview.id;
              const isCurrent = currentThemeId === themePreview.id;

              return (
                <Card
                  key={themePreview.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-blue-500 shadow-lg" : isHovered ? "shadow-md" : ""
                  }`}
                  onClick={() => handleSelectTheme(themePreview.id)}
                  onMouseEnter={() => setHoveredThemeId(themePreview.id)}
                  onMouseLeave={() => setHoveredThemeId(null)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <CardTitle className="text-lg">{theme.name}</CardTitle>
                          {isCurrent && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <CardDescription className="mt-1 text-xs">
                          {theme.fonts.heading.split(",")[0]} •{" "}
                          {theme.shadows === "none" ? "No shadows" : `${theme.shadows} shadows`}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Theme Preview */}
                    {renderThemePreview(theme, themePreview.id)}

                    {/* Color Palette */}
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Color Palette</p>
                      {renderColorPalette(themePreview.id)}
                    </div>

                    {/* Font Info */}
                    <div className="text-xs text-gray-500 pt-1 border-t">
                      <span className="font-medium">Heading:</span>{" "}
                      {theme.fonts.heading.split(",")[0]}
                      <br />
                      <span className="font-medium">Body:</span> {theme.fonts.body.split(",")[0]}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white pb-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApplyTheme}
              disabled={selectedThemeId === currentThemeId}
              className="min-w-[120px]"
            >
              {selectedThemeId === currentThemeId ? "Already Applied" : "Apply Theme"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
