"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinnerPreview, LoadingSpinnerType } from "@/components/landing/LoadingSpinner";

interface LoadingConfig {
  enabled: boolean;
  type: LoadingSpinnerType;
  color?: string;
  duration?: number;
  minDuration?: number;
}

interface LoadingConfigEditorProps {
  config: LoadingConfig;
  onChange: (config: LoadingConfig) => void;
}

const spinnerTypes: LoadingSpinnerType[] = [
  "spin",
  "pulse",
  "dots",
  "bounce",
  "square-corners",
  "dual-ring",
  "bars",
  "ripple",
];

export default function LoadingConfigEditor({ config, onChange }: LoadingConfigEditorProps) {
  const [localConfig, setLocalConfig] = useState<LoadingConfig>(config);

  const updateConfig = (updates: Partial<LoadingConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  return (
    <div className="space-y-6">
      {/* Enable/Disable Loading */}
      <div className="space-y-2">
        <Label htmlFor="loading-enabled">Enable Loading Screen</Label>
        <Select
          value={localConfig.enabled ? "enabled" : "disabled"}
          onValueChange={(value) => updateConfig({ enabled: value === "enabled" })}
        >
          <SelectTrigger id="loading-enabled">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="disabled">Disabled</SelectItem>
            <SelectItem value="enabled">Enabled</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Show a loading screen when users first visit your landing page
        </p>
      </div>

      {localConfig.enabled && (
        <>
          {/* Spinner Type Selection */}
          <div className="space-y-3">
            <Label>Spinner Style</Label>
            <div className="grid grid-cols-4 gap-3">
              {spinnerTypes.map((type) => (
                <LoadingSpinnerPreview
                  key={type}
                  type={type}
                  color={localConfig.color || "#f97316"}
                  selected={localConfig.type === type}
                  onSelect={() => updateConfig({ type })}
                />
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label htmlFor="loading-color">Spinner Color</Label>
            <div className="flex gap-2">
              <Input
                id="loading-color"
                type="color"
                value={localConfig.color || "#f97316"}
                onChange={(e) => updateConfig({ color: e.target.value })}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={localConfig.color || "#f97316"}
                onChange={(e) => updateConfig({ color: e.target.value })}
                placeholder="#f97316"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">Choose the color for your loading spinner</p>
          </div>

          {/* Duration Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loading-duration">Duration (ms)</Label>
              <Input
                id="loading-duration"
                type="number"
                min="0"
                max="5000"
                step="100"
                value={localConfig.duration || 1000}
                onChange={(e) => updateConfig({ duration: parseInt(e.target.value) || 1000 })}
              />
              <p className="text-xs text-gray-500">Maximum loading time</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loading-min-duration">Min Duration (ms)</Label>
              <Input
                id="loading-min-duration"
                type="number"
                min="0"
                max="5000"
                step="100"
                value={localConfig.minDuration || 500}
                onChange={(e) => updateConfig({ minDuration: parseInt(e.target.value) || 500 })}
              />
              <p className="text-xs text-gray-500">Minimum display time</p>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-medium mb-2">Preview Settings:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>
                {"• "}Type: <span className="font-semibold capitalize">{localConfig.type}</span>
              </li>
              <li>
                {"• "}Color: <span className="font-semibold">{localConfig.color || "#f97316"}</span>
              </li>
              <li>
                {"• "}Duration:{" "}
                <span className="font-semibold">{localConfig.duration || 1000}ms</span>
              </li>
              <li>
                {"• "}Min Duration:{" "}
                <span className="font-semibold">{localConfig.minDuration || 500}ms</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
