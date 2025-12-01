"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LandingConfig } from "@/types/landing";
import { TemplateSelector } from "@/components/editor/selectors/TemplateSelector";
import { LandingPageTemplate } from "@/lib/landing-templates";
import { ArrowLeft } from "lucide-react";

interface CreatePageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: LandingConfig;
  onSuccess: () => void;
}

export default function CreatePageModal({
  open,
  onOpenChange,
  config,
  onSuccess,
}: CreatePageModalProps) {
  const [step, setStep] = useState<"template" | "details">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<LandingPageTemplate | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    theme: "modern",
    isMultiPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value),
    });
    setError("");
  };

  const handleSlugChange = (value: string) => {
    const cleanSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, slug: cleanSlug });
    setError("");
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.slug.trim()) {
      setError("Slug is required");
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      setError("Slug can only contain lowercase letters, numbers, and hyphens");
      return false;
    }
    if (Object.values(config.pages).some((p) => p.slug === formData.slug)) {
      setError("A page with this slug already exists");
      return false;
    }
    return true;
  };

  const handleTemplateSelect = (template: LandingPageTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      ...formData,
      title: template.name,
      slug: generateSlug(template.name),
    });
    setStep("details");
  };

  const handleBack = () => {
    setStep("template");
    setSelectedTemplate(null);
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Create components from template
      const components = selectedTemplate
        ? selectedTemplate.components.map((comp, index) => ({
            ...comp,
            id: `comp-${Date.now()}-${index}`,
            order: index,
          }))
        : [];

      const pageId = `page-${Date.now()}`;
      const newPage = {
        id: pageId,
        title: formData.title,
        description: formData.description,
        slug: formData.slug,
        theme: formData.theme,
        status: "draft" as const,
        seo: {
          title: formData.title,
          description: formData.description,
          keywords: [],
          ogImage: "",
        },
        components,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Multi-page support
        isMultiPage: formData.isMultiPage,
        subPages: formData.isMultiPage ? [] : undefined,
        navigation: formData.isMultiPage
          ? {
              enabled: true,
              style: "tabs" as const,
              showIcons: true,
              sticky: true,
            }
          : undefined,
      };

      const response = await fetch("/api/landing-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: pageId,
          pageData: newPage,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create page");
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        slug: "",
        theme: "modern",
        isMultiPage: false,
      });
      setStep("template");
      setSelectedTemplate(null);

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create page");
    } finally {
      setLoading(false);
    }
  };

  // Template Selection Step
  if (step === "template") {
    return (
      <TemplateSelector
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setStep("template");
            setSelectedTemplate(null);
            setFormData({
              title: "",
              description: "",
              slug: "",
              theme: "modern",
              isMultiPage: false,
            });
          }
          onOpenChange(isOpen);
        }}
        onSelectTemplate={handleTemplateSelect}
      />
    );
  }

  // Details Step
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {selectedTemplate ? `Tạo page: ${selectedTemplate.name}` : "Tạo Landing Page mới"}
          </DialogTitle>
          <DialogDescription>
            {selectedTemplate
              ? selectedTemplate.description
              : "Điền thông tin cho landing page của bạn"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Page Title *</Label>
            <Input
              id="title"
              placeholder="e.g., AI Startup Landing Page"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of this page"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">/</span>
              <Input
                id="slug"
                placeholder="ai-startup"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Only lowercase letters, numbers, and hyphens allowed
            </p>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <Label htmlFor="theme">Theme *</Label>
            <Select
              value={formData.theme}
              onValueChange={(value) => setFormData({ ...formData, theme: value })}
              disabled={loading}
            >
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(config.themes).map(([key, theme]) => (
                  <SelectItem key={key} value={key}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Type */}
          <div className="space-y-2">
            <Label htmlFor="pageType">Loại Landing Page *</Label>
            <Select
              value={formData.isMultiPage ? "multi" : "single"}
              onValueChange={(value) =>
                setFormData({ ...formData, isMultiPage: value === "multi" })
              }
              disabled={loading}
            >
              <SelectTrigger id="pageType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">
                  <div className="flex flex-col">
                    <span className="font-medium">Single Page</span>
                    <span className="text-xs text-gray-500">
                      Một trang duy nhất với các section
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="multi">
                  <div className="flex flex-col">
                    <span className="font-medium">Multiple Pages</span>
                    <span className="text-xs text-gray-500">Nhiều trang con với navigation</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {formData.isMultiPage
                ? "Bạn có thể thêm nhiều trang con sau khi tạo"
                : "Trang đơn giản với các component"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={loading}>
            <ArrowLeft className="h-4 w-4" />
            Back to select template
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo Page"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
