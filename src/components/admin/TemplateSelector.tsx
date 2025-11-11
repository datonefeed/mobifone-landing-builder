"use client";

import React, { useState } from "react";
import { landingPageTemplates, LandingPageTemplate } from "@/lib/landing-templates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Files } from "lucide-react";

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: LandingPageTemplate, type: "single" | "multi") => void;
}

export function TemplateSelector({ open, onOpenChange, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedType, setSelectedType] = useState<"single" | "multi">("single");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Tất cả" },
    { id: "business", label: "Doanh nghiệp" },
    { id: "saas", label: "SaaS" },
    { id: "agency", label: "Agency" },
    { id: "ecommerce", label: "Thương mại" },
    { id: "portfolio", label: "Portfolio" },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? landingPageTemplates
      : landingPageTemplates.filter((t) => t.category === selectedCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chọn mẫu Landing Page</DialogTitle>
          <DialogDescription>Chọn loại và mẫu landing page để bắt đầu</DialogDescription>
        </DialogHeader>

        {/* Type Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSelectedType("single")}
            className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-md ${
              selectedType === "single"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FileText
              className={`h-8 w-8 mb-3 ${selectedType === "single" ? "text-blue-600" : "text-gray-600"}`}
            />
            <h3 className="font-semibold text-lg mb-1">Single Page</h3>
            <p className="text-sm text-gray-600">
              Landing page đơn giản, tất cả nội dung trong một trang duy nhất
            </p>
          </button>

          <button
            onClick={() => setSelectedType("multi")}
            className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-md ${
              selectedType === "multi"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Files
              className={`h-8 w-8 mb-3 ${selectedType === "multi" ? "text-blue-600" : "text-gray-600"}`}
            />
            <h3 className="font-semibold text-lg mb-1">Multi Page</h3>
            <p className="text-sm text-gray-600">
              Landing page nhiều trang con (About, Pricing, Contact, v.v.)
            </p>
          </button>
        </div>

        {/* Template Selection */}
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Blank Template */}
              <div
                className="border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors bg-gradient-to-br from-gray-50 to-gray-100"
                onClick={() => {
                  onSelectTemplate(
                    {
                      id: "blank",
                      name: "Trang trống",
                      description: "Bắt đầu với trang trống",
                      category: "business",
                      components: [],
                    },
                    selectedType
                  );
                }}
              >
                <div className="h-48 border-2 border-dashed rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📄</div>
                    <div className="text-sm text-muted-foreground">Trang trống</div>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Trang trống</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bắt đầu với trang trống và tự do sáng tạo
                </p>
                <Badge variant="outline">Tùy chỉnh</Badge>
              </div>

              {/* Template Cards */}
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors hover:shadow-lg"
                  onClick={() => onSelectTemplate(template, selectedType)}
                >
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center text-white">
                    <div className="text-center px-4">
                      <div className="text-2xl font-bold mb-2">{template.name}</div>
                      <div className="text-sm opacity-90">
                        {template.components.length} components
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{getCategoryLabel(template.category)}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {template.components.length} sections
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    business: "Doanh nghiệp",
    saas: "SaaS",
    agency: "Agency",
    ecommerce: "Thương mại",
    portfolio: "Portfolio",
  };
  return labels[category] || category;
}
