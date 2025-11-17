"use client";

import { SubPage, PageNavigationStyle, Theme } from "@/types/landing";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface MultiPageNavigationProps {
  subPages: SubPage[];
  activePageId: string;
  onNavigate: (pageId: string) => void;
  style: PageNavigationStyle;
  position?: "top" | "left" | "right";
  showIcons?: boolean;
  sticky?: boolean;
  theme?: Theme;
  mainPageTitle?: string; // Title for main page
}

export default function MultiPageNavigation({
  subPages,
  activePageId,
  onNavigate,
  style,
  position = "top",
  showIcons = true,
  sticky = true,
  theme,
  mainPageTitle = "Home",
}: MultiPageNavigationProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const visiblePages = subPages.filter((p) => p.visible);
  const activePage = visiblePages.find((p) => p.id === activePageId);

  if (visiblePages.length === 0) return null;

  // Tabs Style
  if (style === "tabs") {
    return (
      <nav
        className={cn("border-b bg-white/80 backdrop-blur-sm z-50", sticky && "sticky top-0")}
        style={{
          borderColor: theme?.colors.primary ? `${theme.colors.primary}20` : undefined,
        }}
      >
        <div className="container mx-auto">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {/* Main Page Tab */}
            <button
              onClick={() => onNavigate("main")}
              className={cn(
                "flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap font-medium",
                activePageId === "main"
                  ? "border-current text-current"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              )}
              style={
                activePageId === "main" && theme?.colors.primary
                  ? { color: theme.colors.primary, borderColor: theme.colors.primary }
                  : undefined
              }
            >
              {showIcons && <span className="text-lg">🏠</span>}
              <span>{mainPageTitle}</span>
            </button>

            {/* SubPages Tabs */}
            {visiblePages.map((page) => {
              const isActive = page.id === activePageId;
              return (
                <button
                  key={page.id}
                  onClick={() => onNavigate(page.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap font-medium",
                    isActive
                      ? "border-current text-current"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  )}
                  style={
                    isActive && theme?.colors.primary
                      ? { color: theme.colors.primary, borderColor: theme.colors.primary }
                      : undefined
                  }
                >
                  {showIcons && page.icon && <span className="text-lg">{page.icon}</span>}
                  <span>{page.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }

  // Pills Style
  if (style === "pills") {
    return (
      <nav className={cn("bg-gray-50 border-b z-50", sticky && "sticky top-0")}>
        <div className="container mx-auto py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {/* Main Page Pill */}
            <button
              onClick={() => onNavigate("main")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap font-medium",
                activePageId === "main"
                  ? "text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              )}
              style={
                activePageId === "main" && theme?.colors.primary
                  ? { backgroundColor: theme.colors.primary }
                  : undefined
              }
            >
              {showIcons && <span className="text-lg">🏠</span>}
              <span>{mainPageTitle}</span>
            </button>

            {/* SubPages Pills */}
            {visiblePages.map((page) => {
              const isActive = page.id === activePageId;
              return (
                <button
                  key={page.id}
                  onClick={() => onNavigate(page.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap font-medium",
                    isActive ? "text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100"
                  )}
                  style={
                    isActive && theme?.colors.primary
                      ? { backgroundColor: theme.colors.primary }
                      : undefined
                  }
                >
                  {showIcons && page.icon && <span className="text-lg">{page.icon}</span>}
                  <span>{page.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }

  // Dropdown Style
  if (style === "dropdown") {
    // Get active page display (could be main or a subpage)
    const activeDisplay =
      activePageId === "main"
        ? { icon: "🏠", title: mainPageTitle }
        : activePage || { icon: "", title: "Select Page" };

    return (
      <nav className={cn("border-b bg-white/80 backdrop-blur-sm z-50", sticky && "sticky top-0")}>
        <div className="container mx-auto py-3">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-full md:w-64 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
              style={{
                borderColor: theme?.colors.primary ? `${theme.colors.primary}40` : undefined,
              }}
            >
              <div className="flex items-center gap-2">
                {showIcons && activeDisplay.icon && (
                  <span className="text-lg">{activeDisplay.icon}</span>
                )}
                <span className="font-medium">{activeDisplay.title}</span>
              </div>
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", dropdownOpen && "rotate-180")}
              />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-full md:w-64 bg-white border rounded-lg shadow-lg z-20 overflow-hidden">
                  {/* Main Page Option */}
                  <button
                    onClick={() => {
                      onNavigate("main");
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 w-full px-4 py-3 text-left transition-colors",
                      activePageId === "main" ? "bg-opacity-10 font-medium" : "hover:bg-gray-50"
                    )}
                    style={
                      activePageId === "main" && theme?.colors.primary
                        ? {
                            backgroundColor: `${theme.colors.primary}10`,
                            color: theme.colors.primary,
                          }
                        : undefined
                    }
                  >
                    {showIcons && <span className="text-lg">🏠</span>}
                    <div>{mainPageTitle}</div>
                  </button>

                  {/* SubPages Options */}
                  {visiblePages.map((page) => {
                    const isActive = page.id === activePageId;
                    return (
                      <button
                        key={page.id}
                        onClick={() => {
                          onNavigate(page.id);
                          setDropdownOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-2 w-full px-4 py-3 text-left transition-colors",
                          isActive ? "bg-opacity-10 font-medium" : "hover:bg-gray-50"
                        )}
                        style={
                          isActive && theme?.colors.primary
                            ? {
                                backgroundColor: `${theme.colors.primary}10`,
                                color: theme.colors.primary,
                              }
                            : undefined
                        }
                      >
                        {showIcons && page.icon && <span className="text-lg">{page.icon}</span>}
                        <div>
                          <div>{page.title}</div>
                          {page.description && (
                            <div className="text-xs text-gray-500">{page.description}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    );
  }

  // Sidebar Style
  if (style === "sidebar") {
    const sidebarPosition = position === "right" ? "right-0" : "left-0";

    return (
      <nav
        className={cn(
          "fixed top-0 h-screen w-64 bg-white border-r shadow-sm z-50 overflow-y-auto",
          sidebarPosition
        )}
        style={{
          borderColor: theme?.colors.primary ? `${theme.colors.primary}20` : undefined,
        }}
      >
        <div className="p-4 space-y-1">
          {/* Main Page Button */}
          <button
            onClick={() => onNavigate("main")}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all text-left font-medium",
              activePageId === "main" ? "text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
            )}
            style={
              activePageId === "main" && theme?.colors.primary
                ? { backgroundColor: theme.colors.primary }
                : undefined
            }
          >
            {showIcons && <span className="text-xl">🏠</span>}
            <div className="flex-1">
              <div>{mainPageTitle}</div>
            </div>
          </button>

          {/* SubPages Buttons */}
          {visiblePages.map((page) => {
            const isActive = page.id === activePageId;
            return (
              <button
                key={page.id}
                onClick={() => onNavigate(page.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all text-left font-medium",
                  isActive ? "text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
                )}
                style={
                  isActive && theme?.colors.primary
                    ? { backgroundColor: theme.colors.primary }
                    : undefined
                }
              >
                {showIcons && page.icon && <span className="text-xl">{page.icon}</span>}
                <div className="flex-1">
                  <div>{page.title}</div>
                  {page.description && (
                    <div
                      className={cn("text-xs mt-0.5", isActive ? "text-white/80" : "text-gray-500")}
                    >
                      {page.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return null;
}
