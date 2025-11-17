"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Upload, FileJson, Copy, Check } from "lucide-react";
import { ComponentConfig } from "@/types/landing";
import { ExportImportManager } from "@/lib/export-import";
import { useToast } from "@/hooks/use-toast";

interface ExportImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  components: ComponentConfig[];
  onImport: (components: ComponentConfig[]) => void;
}

export function ExportImportDialog({
  isOpen,
  onClose,
  components,
  onImport,
}: ExportImportDialogProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportData, setExportData] = useState("");
  const [importData, setImportData] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    const metadata = {
      title: templateName || "Landing Page Template",
      description: templateDescription || "Exported landing page configuration",
      author: "Landing Page Builder",
    };

    const exported = ExportImportManager.export(components, metadata);
    setExportData(exported);
  };

  const handleDownload = () => {
    if (!exportData) {
      handleExport();
    }

    const filename = templateName
      ? `${templateName.toLowerCase().replace(/\s+/g, "-")}.json`
      : "landing-page-template.json";

    const metadata = {
      title: templateName || "Landing Page Template",
      description: templateDescription || "Exported landing page configuration",
      author: "Landing Page Builder",
    };

    ExportImportManager.downloadAsFile(components, filename, metadata);

    toast({
      title: "Template exported",
      description: `Downloaded as ${filename}`,
    });
  };

  const handleCopyToClipboard = async () => {
    if (!exportData) {
      handleExport();
      return;
    }

    try {
      await navigator.clipboard.writeText(exportData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast({
        title: "Copied to clipboard",
        description: "Template configuration copied successfully",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await ExportImportManager.importFromFile(file);
      setImportData(JSON.stringify(result, null, 2));

      toast({
        title: "File loaded",
        description: "Template file loaded successfully. Click Import to apply.",
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import template",
        variant: "destructive",
      });
    }
  };

  const handleImportFromText = async () => {
    if (!importData.trim()) {
      toast({
        title: "No data",
        description: "Please paste template data or upload a file",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await ExportImportManager.import(importData);
      onImport(result.components);
      onClose();

      toast({
        title: "Import successful",
        description: `Imported ${result.components.length} components`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import template",
        variant: "destructive",
      });
    }
  };

  const handleUsePreset = (
    preset: ReturnType<typeof ExportImportManager.getPresetTemplates>[0]
  ) => {
    onImport(preset.components);
    onClose();

    toast({
      title: "Template applied",
      description: `Applied "${preset.metadata?.title}" template`,
    });
  };

  const presets = ExportImportManager.getPresetTemplates();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import / Export Templates</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="My Landing Page Template"
                />
              </div>

              <div>
                <Label htmlFor="template-description">Description</Label>
                <Input
                  id="template-description"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="A brief description of this template"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download JSON
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <FileJson className="h-4 w-4 mr-2" />
                  Generate Preview
                </Button>
              </div>

              {exportData && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Export Preview</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyToClipboard}
                      className="flex items-center gap-2"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <textarea
                    className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                    value={exportData}
                    readOnly
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Upload Template File</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".json"
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="import-data">Or Paste Template JSON</Label>
                <textarea
                  id="import-data"
                  className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your template JSON here..."
                />
              </div>

              <Button onClick={handleImportFromText} className="w-full">
                Import Template
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose from pre-built templates to get started quickly.
              </p>

              {presets.map((preset, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold">{preset.metadata?.title}</h3>
                  <p className="text-sm text-muted-foreground">{preset.metadata?.description}</p>
                  <div className="text-xs text-muted-foreground">
                    {preset.components.length} components
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleUsePreset(preset)}>
                    Use This Template
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
