"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

interface Stat {
  id: string;
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface StatsArrayEditorProps {
  stats: Stat[];
  onChange: (stats: Stat[]) => void;
}

export function StatsArrayEditor({ stats, onChange }: StatsArrayEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(stats[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = stats.findIndex((stat) => stat.id === active.id);
      const newIndex = stats.findIndex((stat) => stat.id === over.id);
      onChange(arrayMove(stats, oldIndex, newIndex));
    }
  };

  const addStat = () => {
    const newStat: Stat = {
      id: `stat-${Date.now()}`,
      value: "100+",
      label: "New Statistic",
      suffix: "",
      prefix: "",
    };
    onChange([...stats, newStat]);
    setExpandedId(newStat.id);
  };

  const removeStat = (id: string) => {
    onChange(stats.filter((stat) => stat.id !== id));
    if (expandedId === id) {
      setExpandedId(stats[0]?.id || null);
    }
  };

  const updateStat = (id: string, field: keyof Stat, value: string) => {
    onChange(
      stats.map((stat) =>
        stat.id === id
          ? {
              ...stat,
              [field]: value,
            }
          : stat
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Statistics ({stats.length})</Label>
        <Button onClick={addStat} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Stat
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={stats.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {stats.map((stat, index) => (
              <SortableItem key={stat.id} id={stat.id}>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  {/* Header */}
                  <button
                    onClick={() => setExpandedId(expandedId === stat.id ? null : stat.id)}
                    className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {stat.prefix}
                        {stat.value}
                        {stat.suffix} - {stat.label}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">#{index + 1}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStat(stat.id);
                      }}
                      className="ml-2 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </button>

                  {/* Expanded Content */}
                  {expandedId === stat.id && (
                    <div className="p-4 space-y-3 border-t border-gray-200">
                      <div className="space-y-2">
                        <Label className="text-xs">Value</Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => updateStat(stat.id, "value", e.target.value)}
                          placeholder="e.g., 100, 1000, 5K"
                        />
                        <p className="text-xs text-gray-500">
                          The main number to display (e.g., 100, 1000, 5K, 99%)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => updateStat(stat.id, "label", e.target.value)}
                          placeholder="e.g., Happy Customers"
                        />
                        <p className="text-xs text-gray-500">Description text below the number</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Prefix (Optional)</Label>
                          <Input
                            value={stat.prefix || ""}
                            onChange={(e) => updateStat(stat.id, "prefix", e.target.value)}
                            placeholder="e.g., $, ~"
                          />
                          <p className="text-xs text-gray-500">Symbol before number</p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Suffix (Optional)</Label>
                          <Input
                            value={stat.suffix || ""}
                            onChange={(e) => updateStat(stat.id, "suffix", e.target.value)}
                            placeholder="e.g., +, %, K, M"
                          />
                          <p className="text-xs text-gray-500">Symbol after number</p>
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="pt-3 border-t border-gray-200">
                        <Label className="text-xs text-gray-500 mb-2 block">Preview</Label>
                        <div className="bg-gray-50 p-4 rounded text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {stat.prefix}
                            {stat.value}
                            {stat.suffix}
                          </div>
                          <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {stats.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
          No statistics added yet. Click &quot;Add Stat&quot; to create one.
        </div>
      )}
    </div>
  );
}
