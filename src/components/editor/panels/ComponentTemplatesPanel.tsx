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
import { ComponentConfig } from "@/types/landing";
import { Plus, ArrowLeft, Check } from "lucide-react";
import {
  componentCategories,
  type ComponentCategory,
  type ComponentVariant,
} from "@/components/editor/data/component-templates-data";

interface ComponentTemplatesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddComponent: (component: ComponentConfig) => void;
  existingComponents?: ComponentConfig[];
}

export default function ComponentTemplatesPanel({
  open,
  onOpenChange,
  onAddComponent,
  existingComponents = [],
}: ComponentTemplatesPanelProps) {
  const [step, setStep] = useState<"category" | "variant">("category");
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);

  // Check if header already exists
  const hasHeader = existingComponents.some((comp) => comp.type === "header");

  const handleSelectCategory = (category: ComponentCategory) => {
    setSelectedCategory(category);
    setSelectedVariantIndex(null);
    setStep("variant");
  };

  const handleBack = () => {
    setStep("category");
    setSelectedCategory(null);
    setSelectedVariantIndex(null);
  };

  const handleAddComponent = (variant: ComponentVariant) => {
    const newComponent: ComponentConfig = {
      ...variant.template,
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: 0, // Will be set by parent component
    };
    onAddComponent(newComponent);
    onOpenChange(false);
    // Reset state
    setStep("category");
    setSelectedCategory(null);
    setSelectedVariantIndex(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation
    setTimeout(() => {
      setStep("category");
      setSelectedCategory(null);
      setSelectedVariantIndex(null);
    }, 200);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            {step === "variant" && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <SheetTitle>
                {step === "category" ? "Add Component" : `Select ${selectedCategory?.name} Variant`}
              </SheetTitle>
              <SheetDescription>
                {step === "category"
                  ? "Choose a component type to add to your landing page"
                  : `Choose from ${selectedCategory?.variants.length} ${selectedCategory?.name.toLowerCase()} styles`}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6">
          {/* STEP 1: Category Selection */}
          {step === "category" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {componentCategories.map((category, index) => {
                const isHeaderCategory = category.type === "header";
                const isDisabled = isHeaderCategory && hasHeader;

                return (
                  <Card
                    key={index}
                    className={`transition-all ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:shadow-lg hover:border-blue-500 group"
                    }`}
                    onClick={() => !isDisabled && handleSelectCategory(category)}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="text-4xl">{category.icon}</div>
                        <div className="flex-1">
                          <CardTitle
                            className={`text-lg ${
                              isDisabled ? "text-gray-400" : "group-hover:text-blue-600"
                            } transition-colors`}
                          >
                            {category.name}
                          </CardTitle>
                          <CardDescription className="mt-1">{category.description}</CardDescription>
                          {isDisabled ? (
                            <div className="mt-3 text-xs text-red-600 font-medium flex items-center gap-1">
                              <span>⚠️</span>
                              <span>Header already exists - only 1 per page</span>
                            </div>
                          ) : (
                            <div className="mt-3 text-xs text-blue-600 font-medium">
                              {category.variants.length} variant
                              {category.variants.length > 1 ? "s" : ""} available →
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}

          {/* STEP 2: Variant Selection */}
          {step === "variant" && selectedCategory && (
            <div className="space-y-4">
              {selectedCategory.variants.map((variant, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedVariantIndex === index ? "ring-2 ring-blue-500 shadow-md" : ""
                  }`}
                  onClick={() => setSelectedVariantIndex(index)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {selectedVariantIndex === index && (
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <CardTitle className="text-lg">{variant.name}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">{variant.description}</CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddComponent(variant);
                        }}
                        className="ml-4"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Preview when selected */}
                  {selectedVariantIndex === index && (
                    <CardContent>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                          <span className="text-blue-600">✨</span> Preview
                        </p>
                        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                          {/* Render preview based on component type */}
                          {selectedCategory.type === "hero" &&
                            (() => {
                              const config = variant.template.config as Record<string, unknown>;
                              return (
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                                    {String(config.subtitle || "")}
                                  </div>
                                  <div className="font-bold text-lg">
                                    {String(config.title || "")}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {String(config.description || "")}
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                    {config.primaryCTA && typeof config.primaryCTA === "object" ? (
                                      <div className="px-3 py-1 bg-blue-500 text-white text-xs rounded">
                                        {String(
                                          (config.primaryCTA as Record<string, unknown>).text || ""
                                        )}
                                      </div>
                                    ) : null}
                                    {config.secondaryCTA &&
                                    typeof config.secondaryCTA === "object" ? (
                                      <div className="px-3 py-1 border border-gray-300 text-xs rounded">
                                        {String(
                                          (config.secondaryCTA as Record<string, unknown>).text ||
                                            ""
                                        )}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })()}

                          {selectedCategory.type === "features" &&
                            (() => {
                              const config = variant.template.config as Record<string, unknown>;
                              const features = (config.features as unknown[]) || [];
                              return (
                                <div className="space-y-2">
                                  <div className="font-bold text-base">
                                    {String(config.title || "")}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {features.length} features • {String(config.columns || 3)}{" "}
                                    columns
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    {features.slice(0, 2).map((f, i) => {
                                      const feature = f as Record<string, unknown>;
                                      return (
                                        <div key={i} className="text-xs p-2 bg-gray-50 rounded">
                                          <div className="font-medium">
                                            {String(feature.icon || "")}{" "}
                                            {String(feature.title || "")}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}

                          {selectedCategory.type === "pricing" &&
                            (() => {
                              const config = variant.template.config as Record<string, unknown>;
                              const plans = (config.plans as unknown[]) || [];
                              return (
                                <div className="space-y-2">
                                  <div className="font-bold text-base">
                                    {String(config.title || "")}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {plans.length} pricing plans
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    {plans.map((p, i) => {
                                      const plan = p as Record<string, unknown>;
                                      return (
                                        <div
                                          key={i}
                                          className="text-xs p-2 bg-gray-50 rounded flex-1"
                                        >
                                          <div className="font-bold">{String(plan.name || "")}</div>
                                          <div className="text-blue-600">
                                            {String(plan.price || "")}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}

                          {selectedCategory.type === "testimonials" &&
                            (() => {
                              const config = variant.template.config as Record<string, unknown>;
                              const testimonials = (config.testimonials as unknown[]) || [];
                              return (
                                <div className="space-y-2">
                                  <div className="font-bold text-base">
                                    {String(config.title || "")}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {testimonials.length} testimonials
                                  </div>
                                </div>
                              );
                            })()}

                          {selectedCategory.type === "stats" &&
                            (() => {
                              const config = variant.template.config as Record<string, unknown>;
                              const stats = (config.stats as unknown[]) || [];
                              return (
                                <div className="space-y-2">
                                  <div className="font-bold text-base">
                                    {String(config.title || "Statistics")}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    {stats.slice(0, 4).map((s, i) => {
                                      const stat = s as Record<string, unknown>;
                                      return (
                                        <div key={i} className="text-center p-2 bg-gray-50 rounded">
                                          <div className="font-bold text-blue-600">
                                            {String(stat.prefix || "")}
                                            {String(stat.value || "")}
                                            {String(stat.suffix || "")}
                                          </div>
                                          <div className="text-xs text-gray-600">
                                            {String(stat.label || "")}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}

                          {selectedCategory.type === "cta" &&
                            (() => {
                              const config = variant.template.config as Record<string, unknown>;
                              return (
                                <div className="space-y-2 text-center">
                                  <div className="font-bold text-base">
                                    {String(config.title || "")}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {String(config.description || "")}
                                  </div>
                                </div>
                              );
                            })()}

                          {/* Generic preview for other types */}
                          {![
                            "hero",
                            "features",
                            "pricing",
                            "testimonials",
                            "stats",
                            "cta",
                          ].includes(selectedCategory.type) &&
                            (() => {
                              const config = variant.template.config as Record<string, unknown>;
                              return (
                                <div className="space-y-1">
                                  <div className="font-bold text-base">
                                    {String(config.title || selectedCategory.name)}
                                  </div>
                                  <div className="text-xs text-gray-600">{variant.description}</div>
                                </div>
                              );
                            })()}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
