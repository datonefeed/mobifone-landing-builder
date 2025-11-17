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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LandingPage, LandingConfig, LoadingConfig } from "@/types/landing";
import LoadingConfigEditor from "./LoadingConfigEditor";

interface PageSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: LandingPage;
  config: LandingConfig;
  onSave: (updates: Partial<LandingPage>) => Promise<void>;
}

export default function PageSettingsModal({
  open,
  onOpenChange,
  page,
  config,
  onSave,
}: PageSettingsModalProps) {
  const [formData, setFormData] = useState({
    title: page.title,
    description: page.description,
    slug: page.slug,
    theme: page.theme,
    status: page.status || "draft",
    seoTitle: page.seo?.metaTitle || page.title,
    seoDescription: page.seo?.metaDescription || page.description,
    seoKeywords: page.seo?.keywords?.join(", ") || "",
    seoOgImage: page.seo?.ogImage || "",
  });
  const [loadingConfig, setLoadingConfig] = useState<LoadingConfig>(
    page.loading || {
      enabled: false,
      type: "spin",
      color: "#f97316",
      duration: 1000,
      minDuration: 500,
    }
  );
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
      slug: formData.slug === generateSlug(page.title) ? generateSlug(value) : formData.slug,
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
    if (
      formData.slug !== page.slug &&
      Object.values(config.pages).some((p) => p.slug === formData.slug)
    ) {
      setError("A page with this slug already exists");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const updates: Partial<LandingPage> = {
        title: formData.title,
        description: formData.description,
        slug: formData.slug,
        theme: formData.theme,
        status: formData.status as "draft" | "published" | "archived",
        seo: {
          metaTitle: formData.seoTitle,
          metaDescription: formData.seoDescription,
          keywords: formData.seoKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          ogImage: formData.seoOgImage,
        },
        loading: loadingConfig,
        updatedAt: new Date().toISOString(),
      };

      await onSave(updates);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Page Settings</DialogTitle>
          <DialogDescription>
            Update page metadata, SEO settings, and publishing status.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="py-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="loading">Loading</TabsTrigger>
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic" className="space-y-6 pt-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    disabled={loading}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as "draft" | "published" | "archived",
                      })
                    }
                    disabled={loading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6 pt-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">SEO Settings</h3>

              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  disabled={loading}
                  placeholder="Leave empty to use page title"
                />
                <p className="text-xs text-gray-500">Max 60 characters recommended</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Input
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  disabled={loading}
                  placeholder="Leave empty to use page description"
                />
                <p className="text-xs text-gray-500">Max 160 characters recommended</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">SEO Keywords</Label>
                <Input
                  id="seoKeywords"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                  disabled={loading}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-gray-500">Separate keywords with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoOgImage">Open Graph Image URL</Label>
                <Input
                  id="seoOgImage"
                  value={formData.seoOgImage}
                  onChange={(e) => setFormData({ ...formData, seoOgImage: e.target.value })}
                  disabled={loading}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">Image for social media sharing</p>
              </div>
            </div>
          </TabsContent>

          {/* Loading Tab */}
          <TabsContent value="loading" className="space-y-6 pt-4">
            <LoadingConfigEditor config={loadingConfig} onChange={setLoadingConfig} />
          </TabsContent>
        </Tabs>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
