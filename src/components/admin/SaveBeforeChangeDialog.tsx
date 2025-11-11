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
import { AlertTriangle, Save } from "lucide-react";

interface SaveBeforeChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveAndContinue: (name: string, description?: string) => void;
  onContinueWithoutSaving: () => void;
  actionName?: string; // e.g., "change template", "close editor"
}

export function SaveBeforeChangeDialog({
  open,
  onOpenChange,
  onSaveAndContinue,
  onContinueWithoutSaving,
  actionName = "change template",
}: SaveBeforeChangeDialogProps) {
  const [mode, setMode] = useState<"prompt" | "save">("prompt");
  const [versionName, setVersionName] = useState("");
  const [versionDescription, setVersionDescription] = useState("");

  const handleSaveAndContinue = () => {
    if (!versionName.trim()) {
      alert("Please enter a version name");
      return;
    }
    onSaveAndContinue(versionName, versionDescription);
    setVersionName("");
    setVersionDescription("");
    setMode("prompt");
    onOpenChange(false);
  };

  const handleContinueWithoutSaving = () => {
    onContinueWithoutSaving();
    setMode("prompt");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setMode("prompt");
    setVersionName("");
    setVersionDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setMode("prompt");
          setVersionName("");
          setVersionDescription("");
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        {mode === "prompt" ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <DialogTitle>Save Current Version?</DialogTitle>
              </div>
              <DialogDescription className="text-left">
                You are about to {actionName}. Would you like to save your current work as a version
                before continuing?
              </DialogDescription>
            </DialogHeader>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Saving a version allows you to restore your current work
                anytime from the Version History.
              </p>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleContinueWithoutSaving}
                className="w-full sm:w-auto"
              >
                Continue Without Saving
              </Button>
              <Button onClick={() => setMode("save")} className="gap-2 w-full sm:w-auto">
                <Save className="h-4 w-4" />
                Save & Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <Save className="h-6 w-6 text-blue-600" />
                <DialogTitle>Save Current Version</DialogTitle>
              </div>
              <DialogDescription className="text-left">
                Give your current work a name so you can find it easily later.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="version-name">Version Name *</Label>
                <Input
                  id="version-name"
                  placeholder="e.g., Homepage v1, Before redesign"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  className="mt-1"
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="version-description">Description (Optional)</Label>
                <Input
                  id="version-description"
                  placeholder="e.g., Original design with all sections"
                  value={versionDescription}
                  onChange={(e) => setVersionDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setMode("prompt")}>
                Back
              </Button>
              <Button onClick={handleSaveAndContinue} className="gap-2">
                <Save className="h-4 w-4" />
                Save & Continue
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
