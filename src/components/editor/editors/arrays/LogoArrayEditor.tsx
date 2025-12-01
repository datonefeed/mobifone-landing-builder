"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, GripVertical, ExternalLink } from "lucide-react";

interface LogoItem {
  name: string;
  url: string;
  link?: string;
}

interface LogoArrayEditorProps {
  logos: LogoItem[];
  onChange: (logos: LogoItem[]) => void;
}

export function LogoArrayEditor({ logos = [], onChange }: LogoArrayEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Create fallback SVG for failed images
  const createFallbackSVG = (name: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50">
      <rect width="150" height="50" fill="#e5e7eb"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">${name}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const handleAdd = () => {
    const newLogo: LogoItem = {
      name: "New Logo",
      url: "https://via.placeholder.com/150x50/cccccc/666666?text=Logo",
      link: "",
    };
    onChange([...logos, newLogo]);
    setExpandedIndex(logos.length);
  };

  const handleRemove = (index: number) => {
    const newLogos = logos.filter((_, i) => i !== index);
    onChange(newLogos);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const handleUpdate = (index: number, field: keyof LogoItem, value: string) => {
    const newLogos = [...logos];
    newLogos[index] = { ...newLogos[index], [field]: value };
    onChange(newLogos);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === logos.length - 1)
    ) {
      return;
    }

    const newLogos = [...logos];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newLogos[index], newLogos[newIndex]] = [newLogos[newIndex], newLogos[index]];
    onChange(newLogos);
    setExpandedIndex(newIndex);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Logos ({logos.length})</Label>
        <Button onClick={handleAdd} size="sm" variant="outline" className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Add Logo
        </Button>
      </div>

      <div className="space-y-2">
        {logos.map((logo, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Header */}
            <div
              className="flex items-center gap-2 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />

              {/* Logo Preview */}
              <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = createFallbackSVG(logo.name || "Logo");
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{logo.name || "Untitled Logo"}</div>
                {logo.link && (
                  <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {logo.link}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMove(index, "up");
                  }}
                  disabled={index === 0}
                  className="h-7 w-7 p-0"
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMove(index, "down");
                  }}
                  disabled={index === logos.length - 1}
                  className="h-7 w-7 p-0"
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedIndex === index && (
              <div className="p-3 space-y-3 border-t border-gray-200">
                <div className="space-y-2">
                  <Label className="text-xs">Company Name</Label>
                  <Input
                    value={logo.name}
                    onChange={(e) => handleUpdate(index, "name", e.target.value)}
                    placeholder="e.g. Microsoft, Google, Amazon"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Logo Image URL</Label>
                  <Input
                    value={logo.url}
                    onChange={(e) => handleUpdate(index, "url", e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500">Direct link to logo image (PNG, SVG, JPG)</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Website Link (Optional)</Label>
                  <Input
                    value={logo.link || ""}
                    onChange={(e) => handleUpdate(index, "link", e.target.value)}
                    placeholder="https://example.com"
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500">If provided, logo will be clickable</p>
                </div>

                {/* Image Preview */}
                <div className="space-y-2">
                  <Label className="text-xs">Preview</Label>
                  <div className="w-full h-20 bg-gray-50 rounded border border-gray-200 flex items-center justify-center p-4">
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/150x50/cccccc/666666?text=${encodeURIComponent(logo.name || "Logo")}`;
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {logos.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
            No logos added yet. Click &quot;Add Logo&quot; to get started.
          </div>
        )}
      </div>
    </div>
  );
}
