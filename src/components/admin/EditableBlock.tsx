"use client";

import { ComponentConfig } from "@/types/landing";
import {
  Eye,
  EyeOff,
  Trash2,
  GripVertical,
  Edit,
  Copy,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";

interface EditableBlockProps {
  component: ComponentConfig;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onChangeTemplate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  children: React.ReactNode;
}

/**
 * EditableBlock - Wrapper for components in edit mode
 * Provides selection, visibility toggle, delete, duplicate, move functionality
 */
export function EditableBlock({
  component,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDelete,
  onDuplicate,
  onChangeTemplate,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  children,
}: EditableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 50 : undefined,
  };
  const getComponentName = (type: string) => {
    const names: Record<string, string> = {
      header: "Header Navigation",
      hero: "Hero Section",
      features: "Features",
      pricing: "Pricing",
      testimonials: "Testimonials",
      cta: "Call to Action",
      footer: "Footer",
      stats: "Statistics",
      team: "Team",
      faq: "FAQ",
      gallery: "Gallery",
      "logo-cloud": "Logo Cloud",
      contact: "Contact",
      content: "Content",
      newsletter: "Newsletter",
      video: "Video",
      "gym-hero": "Gym Hero",
      "gym-services": "Gym Services",
      "gym-pricing": "Gym Pricing",
      "gym-testimonials": "Gym Testimonials",
      "gym-navigation": "Gym Navigation",
      "gym-about": "Gym About",
      "gym-contact": "Gym Contact",
    };
    return names[type] || type;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group transition-all duration-200 ${isSelected ? "shadow-xl z-10" : "hover:shadow-md z-0"} ${!component.visible ? "opacity-60" : ""} ${isDragging ? "opacity-50 scale-105" : ""}`}
      onClick={onSelect}
    >
      {/* Component Content */}
      <div className="pointer-events-none">{children}</div>

      {/* Border Indicator - Clean solid border when selected */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
          isSelected
            ? "border-2 border-blue-500"
            : "border-2 border-transparent group-hover:border-gray-300"
        } ${!component.visible ? "border-2 border-dashed !border-orange-400" : ""}`}
      />

      {/* Edit Overlay - Shows on hover or when selected */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
          isSelected
            ? "bg-blue-500 bg-opacity-5"
            : "bg-blue-500 bg-opacity-0 group-hover:bg-opacity-3"
        }`}
      />

      {/* Corner Indicators when selected - Smaller and more elegant */}
      {isSelected && (
        <>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-[3px] border-l-[3px] border-blue-500 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-[3px] border-r-[3px] border-blue-500 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[3px] border-l-[3px] border-blue-500 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[3px] border-r-[3px] border-blue-500 pointer-events-none"></div>
        </>
      )}

      {/* Toolbar - Shows on hover or when selected */}
      <div
        className={`absolute top-0 right-0 m-2 flex gap-1 transition-opacity z-[60] ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex items-center gap-1 p-1">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="px-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded"
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4 text-gray-500" />
          </div>

          {/* Component Label */}
          <div className="px-2 text-xs font-medium text-gray-700">
            {getComponentName(component.type)}
          </div>

          <div className="w-px h-4 bg-gray-300" />

          {/* Move Up/Down Buttons */}
          {onMoveUp && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              disabled={!canMoveUp}
              title="Move Up"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              disabled={!canMoveDown}
              title="Move Down"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
          )}

          <div className="w-px h-4 bg-gray-300" />

          {/* Change Template Button */}
          {onChangeTemplate && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-purple-50 hover:text-purple-600"
              onClick={(e) => {
                e.stopPropagation();
                onChangeTemplate();
              }}
              title="Change Template"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Edit Button */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            title="Edit"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>

          {/* Visibility Toggle */}
          <Button
            size="sm"
            variant="ghost"
            className={`h-7 w-7 p-0 ${
              component.visible
                ? "hover:bg-gray-100"
                : "hover:bg-green-50 bg-orange-50 border border-orange-200"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            title={component.visible ? "Hide component" : "Show component (Click to unhide)"}
          >
            {component.visible ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-orange-600" />
            )}
          </Button>

          {/* Duplicate Button */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            title="Duplicate"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>

          {/* Delete Button */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete ${getComponentName(component.type)}?`)) {
                onDelete();
              }
            }}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Order Badge - Bottom Left */}
      <div
        className={`absolute bottom-2 left-2 transition-opacity ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <div className="bg-white rounded px-2 py-1 text-xs font-medium text-gray-600 shadow-sm border border-gray-200">
          Order: {component.order}
        </div>
      </div>

      {/* Hidden Badge - Shows when component is hidden */}
      {!component.visible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-900 bg-opacity-90 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <EyeOff className="h-5 w-5" />
              <div>
                <div className="text-sm font-bold">Component Hidden</div>
                <div className="text-xs text-gray-300 mt-0.5">
                  Click the eye icon above to show it again
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
