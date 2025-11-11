"use client";

import { useState, useEffect } from "react";
import { LandingPage, ComponentConfig, Theme, LandingConfig } from "@/types/landing";
import { ComponentRenderer } from "@/components/landing/ComponentRenderer";
import { EditableBlock } from "./EditableBlock";
import { ComponentEditor } from "./ComponentEditor";
import ComponentTemplatesPanel from "./ComponentTemplatesPanel";
import PageSettingsModal from "./PageSettingsModal";
import { ExportImportDialog } from "./ExportImportDialog";
import { KeyboardShortcutsHelp } from "./KeyboardShortcutsHelp";
import { HiddenComponentsList } from "./HiddenComponentsList";
import ThemeSelector from "./ThemeSelector";
import CustomThemeCreator from "./CustomThemeCreator";
import { EditModeProvider } from "@/contexts/EditModeContext";
import { Button } from "@/components/ui/button";
import { Save, Eye, Plus, Settings, Download, HelpCircle, Palette, Paintbrush } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useKeyboardShortcuts, COMMON_SHORTCUTS } from "@/hooks/use-keyboard-shortcuts";
import { getTheme, applyTheme } from "@/lib/themes";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
// import { SortableItem } from "./SortableItem";

interface EditableLandingPageProps {
  page: LandingPage;
  theme?: Theme;
  config: LandingConfig;
  onSave: (page: LandingPage) => Promise<void>;
}

/**
 * EditableLandingPage - Visual editor for landing pages
 * Wraps components in EditableBlock, shows ComponentEditor panel
 */
export function EditableLandingPage({ page, theme, config, onSave }: EditableLandingPageProps) {
  const [editingPage, setEditingPage] = useState<LandingPage>(page);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportImportOpen, setExportImportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [customThemeCreatorOpen, setCustomThemeCreatorOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedComponent = editingPage.components.find((c) => c.id === selectedComponentId);

  // Apply theme when page loads or theme changes
  useEffect(() => {
    const currentTheme = getTheme(editingPage.theme || "modern");
    applyTheme(currentTheme);
  }, [editingPage.theme]);

  // Sync header tabs when subpages change
  useEffect(() => {
    const headerComponent = editingPage.components.find((c) => c.type === "header");
    if (headerComponent) {
      const syncedComponents = syncHeaderTabs(editingPage.components);
      if (JSON.stringify(syncedComponents) !== JSON.stringify(editingPage.components)) {
        setEditingPage({
          ...editingPage,
          components: syncedComponents,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPage.subPages]);

  // Preview page
  const handlePreview = () => {
    window.open(`/${editingPage.slug}`, "_blank");
  };

  // Note: "Back to Dashboard" removed in new flow
  // Admin page is now the editor itself, no separate dashboard

  // Auto-save functionality
  const { hasUnsavedChanges, markAsSaved } = useAutoSave({
    data: editingPage,
    onSave: async () => {
      await onSave(editingPage);
    },
    delay: 5000, // Auto-save every 5 seconds
    enabled: true,
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        ...COMMON_SHORTCUTS.SAVE,
        action: () => !saving && handleSave(),
      },
      {
        ...COMMON_SHORTCUTS.ADD_COMPONENT,
        action: () => setTemplatesOpen(true),
      },
      {
        ...COMMON_SHORTCUTS.TOGGLE_PREVIEW,
        action: handlePreview,
      },
      {
        key: "Escape",
        description: "Close panels",
        action: () => {
          setSelectedComponentId(null);
          setTemplatesOpen(false);
          setSettingsOpen(false);
          setExportImportOpen(false);
          setHelpOpen(false);
        },
      },
      {
        key: "Delete",
        description: "Delete selected component",
        action: () => {
          if (selectedComponentId) {
            handleDeleteComponent(selectedComponentId);
          }
        },
      },
    ],
    enabled: true,
  });

  // Update a component's config
  const handleComponentUpdate = (updatedComponent: ComponentConfig) => {
    const updatedComponents = editingPage.components.map((c) =>
      c.id === updatedComponent.id ? updatedComponent : c
    );

    setEditingPage({
      ...editingPage,
      components: updatedComponents,
    });

    toast({
      title: "🔧 Component Updated",
      description: `${updatedComponent.type} component has been modified`,
      duration: 2000,
    });
  };

  // Toggle component visibility
  const handleToggleVisibility = (componentId: string) => {
    const component = editingPage.components.find((c) => c.id === componentId);
    const updatedComponents = editingPage.components.map((c) =>
      c.id === componentId ? { ...c, visible: !c.visible } : c
    );

    // Auto-sync header tabs if header exists
    const syncedComponents = syncHeaderTabs(updatedComponents);

    setEditingPage({
      ...editingPage,
      components: syncedComponents,
    });

    toast({
      title: component?.visible ? "👁️ Component Hidden" : "👁️ Component Visible",
      description: `${component?.type || "Component"} is now ${component?.visible ? "hidden" : "visible"} on the page`,
      duration: 2000,
    });
  };

  // Delete a component
  const handleDeleteComponent = (componentId: string) => {
    const updatedComponents = editingPage.components.filter((c) => c.id !== componentId);

    // Auto-sync header tabs if header exists
    const syncedComponents = syncHeaderTabs(updatedComponents);

    setEditingPage({
      ...editingPage,
      components: syncedComponents,
    });

    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }

    const deletedComponent = editingPage.components.find((c) => c.id === componentId);
    toast({
      title: "🗑️ Component Deleted",
      description: `${deletedComponent?.type || "Component"} has been removed from the page`,
      duration: 3000,
    });
  };

  // Auto-sync header tabs with components and subpages
  const syncHeaderTabs = (components: ComponentConfig[]) => {
    const headerComponent = components.find((c) => c.type === "header");
    if (!headerComponent) return components;

    // Get all visible non-header components
    const visibleComponents = components.filter(
      (c) => c.type !== "header" && c.visible && c.type !== "footer"
    );

    // Create tabs for each component (hash links)
    const componentTabs = visibleComponents.map((comp) => ({
      id: comp.id,
      text: getComponentDisplayName(comp),
      link: `#${comp.id}`,
    }));

    // Add tabs for subpages if any (page links)
    const subPageTabs =
      editingPage.subPages
        ?.filter((sp) => sp.visible)
        .map((sp) => ({
          id: sp.id,
          text: sp.title,
          link: `/${editingPage.slug}/${sp.slug}`,
        })) || [];

    // Combine component tabs and subpage tabs
    const newTabs = [...componentTabs, ...subPageTabs];

    // Update header config with new tabs
    const updatedHeader = {
      ...headerComponent,
      config: {
        ...headerComponent.config,
        tabs: newTabs,
      },
    };

    return components.map((c) => (c.id === headerComponent.id ? updatedHeader : c));
  };

  // Get display name for component type
  const getComponentDisplayName = (component: ComponentConfig): string => {
    const typeNames: Record<string, string> = {
      hero: "Home",
      features: "Features",
      pricing: "Pricing",
      testimonials: "Testimonials",
      cta: "Get Started",
      stats: "Stats",
      team: "Team",
      faq: "FAQ",
      gallery: "Gallery",
      "logo-cloud": "Partners",
      contact: "Contact",
      content: "About",
      newsletter: "Newsletter",
      video: "Video",
    };

    // Return component type name (short, clean text)
    return typeNames[component.type] || component.type;
  };

  // Add a new component
  const handleAddComponent = (component: ComponentConfig) => {
    // Header components should always be at the top
    if (component.type === "header") {
      const newComponent = {
        ...component,
        order: 0,
      };

      // Reorder all existing components
      const reorderedComponents = editingPage.components.map((c) => ({
        ...c,
        order: c.order + 1,
      }));

      // Sync header tabs with existing components
      const allComponents = [newComponent, ...reorderedComponents];
      const syncedComponents = syncHeaderTabs(allComponents);

      setEditingPage({
        ...editingPage,
        components: syncedComponents,
      });

      toast({
        title: "📱 Header Added",
        description: "Header component has been added with navigation tabs",
        duration: 3000,
      });
    } else {
      // For other components, add to the end
      const maxOrder = Math.max(0, ...editingPage.components.map((c) => c.order));
      const newComponent = {
        ...component,
        order: maxOrder + 1,
      };

      const updatedComponents = [...editingPage.components, newComponent];

      // Auto-sync header tabs if header exists
      const syncedComponents = syncHeaderTabs(updatedComponents);

      setEditingPage({
        ...editingPage,
        components: syncedComponents,
      });

      toast({
        title: "➕ Component Added",
        description: `${component.type} component has been added to your page`,
        duration: 3000,
      });
    }
  };

  // Duplicate a component
  const handleDuplicateComponent = (componentId: string) => {
    const component = editingPage.components.find((c) => c.id === componentId);
    if (!component) return;

    const maxOrder = Math.max(0, ...editingPage.components.map((c) => c.order));
    const duplicatedComponent: ComponentConfig = {
      ...component,
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: maxOrder + 1,
    };

    setEditingPage({
      ...editingPage,
      components: [...editingPage.components, duplicatedComponent],
    });

    toast({
      title: "Duplicated",
      description: "Component duplicated successfully",
    });
  };

  // Save page settings
  const handleSaveSettings = async (updates: Partial<LandingPage>) => {
    const updatedPage = {
      ...editingPage,
      ...updates,
    };

    setEditingPage(updatedPage);

    toast({
      title: "Settings Updated",
      description: "Page settings saved successfully",
    });
  };

  // Change theme
  const handleThemeChange = (themeId: string) => {
    const updatedPage = {
      ...editingPage,
      theme: themeId,
    };

    setEditingPage(updatedPage);

    const themeName = getTheme(themeId).name;

    toast({
      title: "🎨 Theme Changed",
      description: `Switched to ${themeName} theme`,
      duration: 3000,
    });
  };

  // Save custom theme
  const handleSaveCustomTheme = (theme: Theme, themeId: string) => {
    // In real app, save to config.themes
    // For now, just apply it and notify
    handleThemeChange(themeId);

    toast({
      title: "✨ Custom Theme Created",
      description: `"${theme.name}" has been created and applied!`,
      duration: 3000,
    });
  };

  // Move component up
  const handleMoveUp = (componentId: string) => {
    const index = editingPage.components.findIndex((c) => c.id === componentId);
    if (index <= 0) return;

    const newComponents = [...editingPage.components];
    [newComponents[index - 1], newComponents[index]] = [
      newComponents[index],
      newComponents[index - 1],
    ];

    // Update order numbers
    const reorderedComponents = newComponents.map((c, i) => ({ ...c, order: i }));

    setEditingPage({
      ...editingPage,
      components: reorderedComponents,
    });
  };

  // Move component down
  const handleMoveDown = (componentId: string) => {
    const index = editingPage.components.findIndex((c) => c.id === componentId);
    if (index < 0 || index >= editingPage.components.length - 1) return;

    const newComponents = [...editingPage.components];
    [newComponents[index], newComponents[index + 1]] = [
      newComponents[index + 1],
      newComponents[index],
    ];

    // Update order numbers
    const reorderedComponents = newComponents.map((c, i) => ({ ...c, order: i }));

    setEditingPage({
      ...editingPage,
      components: reorderedComponents,
    });
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = editingPage.components.findIndex((c) => c.id === active.id);
      const newIndex = editingPage.components.findIndex((c) => c.id === over.id);

      const newComponents = arrayMove(editingPage.components, oldIndex, newIndex);

      // Update order numbers
      const reorderedComponents = newComponents.map((c, i) => ({ ...c, order: i }));

      setEditingPage({
        ...editingPage,
        components: reorderedComponents,
      });

      toast({
        title: "↕️ Components Reordered",
        description: "Component order has been updated successfully",
        duration: 2000,
      });
    }

    setActiveId(null);
  };

  // Save changes
  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    const startTime = Date.now();

    // Show optimistic loading toast with better UX
    const savingToast = toast({
      title: "💾 Saving Changes...",
      description: "Processing your updates, please wait a moment",
      duration: 30000, // Long duration, will be dismissed manually
    });

    try {
      // Process temporary images (base64 -> permanent files)
      const processedPage = await processImages(editingPage);

      // Save to API
      await onSave(processedPage);

      // Update local state with processed page
      setEditingPage(processedPage);

      // Mark as saved to reset unsaved changes indicator (after state update)
      setTimeout(() => markAsSaved(processedPage), 0);

      // Calculate save duration
      const duration = Date.now() - startTime;
      const durationText = duration > 1000 ? `${(duration / 1000).toFixed(1)}s` : `${duration}ms`;

      // Dismiss saving toast after a brief delay to show completion
      setTimeout(() => {
        savingToast.dismiss();

        // Show success toast with timing
        toast({
          title: "✅ Saved Successfully!",
          description: `Landing page "${editingPage.title}" saved in ${durationText} (${editingPage.components.length} components)`,
          duration: 3500, // Slightly shorter for better UX
        });
      }, 800); // 800ms delay để user thấy "Saving..." hoàn thành
    } catch (error) {
      console.error("Save error:", error);

      const duration = Date.now() - startTime;

      // Dismiss saving toast after a brief delay, then show error
      setTimeout(() => {
        savingToast.dismiss();

        toast({
          title: "❌ Save Failed",
          description:
            error instanceof Error
              ? `Error after ${duration}ms: ${error.message}`
              : "Failed to save page. Please try again.",
          variant: "destructive",
          duration: 6000,
        });
      }, 600); // Shorter delay for errors
    } finally {
      setSaving(false);
    }
  };

  // Process images: convert base64 to permanent files
  const processImages = async (pageData: LandingPage): Promise<LandingPage> => {
    const imagesToSave: Array<{ url: string; filename?: string }> = [];

    // Quick check - only scan if we might have base64 images
    const pageJsonString = JSON.stringify(pageData.components);
    if (!pageJsonString.includes("data:image/")) {
      // No base64 images found, return immediately
      return pageData;
    }

    // Collect all base64 images from components
    const collectImages = (obj: unknown) => {
      if (typeof obj === "string" && obj.startsWith("data:image/")) {
        imagesToSave.push({ url: obj });
      } else if (typeof obj === "object" && obj !== null) {
        Object.values(obj).forEach(collectImages);
      }
    };

    pageData.components.forEach((component) => collectImages(component.config));

    // If no images to process, return as is
    if (imagesToSave.length === 0) {
      return pageData;
    }

    try {
      // Save images to permanent files with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("/api/save-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: imagesToSave }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Image save failed: ${response.status} ${response.statusText}`);
      }

      const { savedImages } = await response.json();

      // Replace base64 URLs with permanent URLs
      const replaceImages = (obj: unknown): unknown => {
        if (typeof obj === "string") {
          const replacement = savedImages.find(
            (img: { originalUrl: string; newUrl: string }) => img.originalUrl === obj
          );
          return replacement ? replacement.newUrl : obj;
        }
        if (Array.isArray(obj)) {
          return obj.map(replaceImages);
        }
        if (typeof obj === "object" && obj !== null) {
          const result: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(obj)) {
            result[key] = replaceImages(value);
          }
          return result;
        }
        return obj;
      };

      const processedComponents = pageData.components.map((component) => ({
        ...component,
        config: replaceImages(component.config),
      }));

      return {
        ...pageData,
        components: processedComponents as ComponentConfig[],
      };
    } catch (error) {
      console.warn("Image processing failed, saving without image conversion:", error);
      // Return original data if image processing fails
      return pageData;
    }
  };

  // Sort components by order
  const sortedComponents = [...editingPage.components].sort((a, b) => a.order - b.order);

  return (
    <EditModeProvider isEditMode={true} sidebarOpen={!!selectedComponentId}>
      <div className="min-h-screen bg-gray-100">
        {/* Top Toolbar */}
        <div
          className={`bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-all duration-300 `}
        >
          <div
            className={`px-4 py-3 flex items-center justify-between ${
              selectedComponentId ? "" : "container mx-auto"
            }`}
          >
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-semibold">{editingPage.title}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">/{editingPage.slug}</p>
                  {saving && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-600 font-medium">Saving...</span>
                    </div>
                  )}
                  {!saving && hasUnsavedChanges && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-orange-600 font-medium">Unsaved changes</span>
                    </div>
                  )}
                  {!saving && !hasUnsavedChanges && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">All changes saved</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <HiddenComponentsList
                components={editingPage.components}
                onToggleVisibility={handleToggleVisibility}
                onSelectComponent={setSelectedComponentId}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setThemeSelectorOpen(true)}
                className="gap-1"
              >
                <Palette className="h-4 w-4" />
                Theme
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomThemeCreatorOpen(true)}
                className="gap-1"
              >
                <Paintbrush className="h-4 w-4" />
                Custom Theme
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportImportOpen(true)}
                className="gap-1"
              >
                <Download className="h-4 w-4" />
                Export/Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTemplatesOpen(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Component
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettingsOpen(true)}
                className="gap-1"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handlePreview} className="gap-1">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHelpOpen(true)}
                className="gap-1"
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
                className={`gap-1 transition-all duration-200 ${
                  saving
                    ? "bg-blue-400 cursor-not-allowed"
                    : hasUnsavedChanges
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <Save className={`h-4 w-4 ${saving ? "animate-spin" : ""}`} />
                {saving ? "Saving..." : hasUnsavedChanges ? "Save Changes*" : "Saved"}
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div
          className={`transition-all duration-300 ${
            selectedComponentId
              ? "md:ml-96 md:mr-4" // Add margin and reduce width on desktop
              : "container mx-auto"
          } px-4 py-8`}
          style={{
            maxWidth: selectedComponentId ? "calc(100vw - 400px)" : undefined,
          }}
        >
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedComponents.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {sortedComponents.map((component, index) => (
                  <div key={component.id}>
                    <EditableBlock
                      component={component}
                      isSelected={selectedComponentId === component.id}
                      onSelect={() => setSelectedComponentId(component.id)}
                      onToggleVisibility={() => handleToggleVisibility(component.id)}
                      onDelete={() => handleDeleteComponent(component.id)}
                      onDuplicate={() => handleDuplicateComponent(component.id)}
                      onMoveUp={() => handleMoveUp(component.id)}
                      onMoveDown={() => handleMoveDown(component.id)}
                      canMoveUp={index > 0}
                      canMoveDown={index < sortedComponents.length - 1}
                    >
                      {/* Special wrapper for header to ensure EditableBlock features work properly */}
                      <div
                        className={`w-full ${component.type === "header" ? "relative" : "overflow-hidden"}`}
                        style={
                          component.type === "header"
                            ? {
                                // Contain header within EditableBlock bounds
                                position: "relative",
                                isolation: "isolate",
                              }
                            : undefined
                        }
                      >
                        <ComponentRenderer component={component} theme={theme} />
                      </div>
                    </EditableBlock>
                  </div>
                ))}
              </SortableContext>

              <DragOverlay>
                {activeId ? (
                  <div className="opacity-50 bg-white rounded-lg shadow-lg p-4 border-2 border-blue-400">
                    <div className="text-sm font-semibold text-gray-700">Moving component...</div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {sortedComponents.length === 0 && (
              <div className="py-20 text-center text-gray-500">
                <p>No components yet. Add your first component to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Component Editor Panel */}
        {selectedComponent && (
          <ComponentEditor
            component={selectedComponent}
            onUpdate={handleComponentUpdate}
            onClose={() => setSelectedComponentId(null)}
            allComponents={editingPage.components}
            subPages={editingPage.subPages || []}
            pageSlug={editingPage.slug}
          />
        )}

        {/* Component Templates Panel */}
        <ComponentTemplatesPanel
          open={templatesOpen}
          onOpenChange={setTemplatesOpen}
          onAddComponent={handleAddComponent}
        />

        {/* Page Settings Modal */}
        <PageSettingsModal
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          page={editingPage}
          config={config}
          onSave={handleSaveSettings}
        />

        {/* Export/Import Dialog */}
        <ExportImportDialog
          isOpen={exportImportOpen}
          onClose={() => setExportImportOpen(false)}
          components={editingPage.components}
          onImport={(components) => {
            setEditingPage({
              ...editingPage,
              components: components.map((c, index) => ({ ...c, order: index })),
            });
            setExportImportOpen(false);
          }}
        />

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutsHelp isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

        {/* Theme Selector */}
        <ThemeSelector
          open={themeSelectorOpen}
          onOpenChange={setThemeSelectorOpen}
          currentThemeId={editingPage.theme}
          onThemeChange={handleThemeChange}
        />

        {/* Custom Theme Creator */}
        <CustomThemeCreator
          open={customThemeCreatorOpen}
          onOpenChange={setCustomThemeCreatorOpen}
          onSaveTheme={handleSaveCustomTheme}
        />

        {/* Sidebar Open Indicator */}
        {selectedComponentId && (
          <div className="fixed top-4 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium z-40 shadow-sm border border-blue-200">
            <span className="mr-2">📝</span>
            Editing Component
          </div>
        )}
      </div>
    </EditModeProvider>
  );
}
