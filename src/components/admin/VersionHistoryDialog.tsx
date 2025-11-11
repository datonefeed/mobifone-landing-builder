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
import { LandingPageVersion, LandingPage } from "@/types/landing";
import { History, Save, Trash2, FileText, Calendar, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VersionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPage: LandingPage;
  versions: LandingPageVersion[];
  onSaveVersion: (name: string, description?: string) => void;
  onApplyVersion: (version: LandingPageVersion) => void;
  onDeleteVersion: (versionId: string) => void;
}

export function VersionHistoryDialog({
  open,
  onOpenChange,
  currentPage,
  versions,
  onSaveVersion,
  onApplyVersion,
  onDeleteVersion,
}: VersionHistoryDialogProps) {
  const [mode, setMode] = useState<"list" | "save">("list");
  const [versionName, setVersionName] = useState("");
  const [versionDescription, setVersionDescription] = useState("");

  const handleSave = () => {
    if (!versionName.trim()) {
      alert("Please enter a version name");
      return;
    }
    onSaveVersion(versionName, versionDescription);
    setVersionName("");
    setVersionDescription("");
    setMode("list");
  };

  const handleApply = (version: LandingPageVersion) => {
    if (confirm(`Apply version "${version.name}"? Current changes will be replaced.`)) {
      onApplyVersion(version);
      onOpenChange(false);
    }
  };

  const handleDelete = (versionId: string, versionName: string) => {
    if (confirm(`Delete version "${versionName}"? This action cannot be undone.`)) {
      onDeleteVersion(versionId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-blue-600" />
            <DialogTitle>Version History</DialogTitle>
          </div>
          <DialogDescription>
            Save and restore previous versions of your landing page
          </DialogDescription>
        </DialogHeader>

        {mode === "list" ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {/* Current Version */}
              <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Current Version</h3>
                  </div>
                  <Badge variant="default" className="bg-blue-600">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-blue-800 mb-1">{currentPage.title}</p>
                <p className="text-xs text-blue-600">
                  Last updated: {currentPage.updatedAt ? formatDate(currentPage.updatedAt) : "N/A"}
                </p>
              </div>

              {/* Saved Versions */}
              {versions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No saved versions yet</p>
                  <p className="text-sm mt-1">Save your first version to get started</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Saved Versions</h4>
                  {versions
                    .sort(
                      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    .map((version) => (
                      <div
                        key={version.id}
                        className="border rounded-lg p-4 hover:border-blue-400 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-gray-600" />
                              <h3 className="font-semibold text-gray-900">{version.name}</h3>
                            </div>
                            {version.description && (
                              <p className="text-sm text-gray-600 mb-2">{version.description}</p>
                            )}
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {formatDate(version.createdAt)}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApply(version)}
                              className="gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Apply
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(version.id, version.name)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => setMode("save")} className="gap-2">
                <Save className="h-4 w-4" />
                Save Current Version
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="version-name">Version Name *</Label>
                <Input
                  id="version-name"
                  placeholder="e.g., Homepage v1, Black Friday Campaign"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="version-description">Description (Optional)</Label>
                <Input
                  id="version-description"
                  placeholder="e.g., Original design with hero and pricing sections"
                  value={versionDescription}
                  onChange={(e) => setVersionDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This will save the current state of your landing page. You
                  can restore it anytime from the version history.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setMode("list")}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Version
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
