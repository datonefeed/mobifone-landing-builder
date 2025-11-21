"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQArrayEditorProps {
  faqs: FAQItem[];
  onChange: (faqs: FAQItem[]) => void;
}

export function FAQArrayEditor({ faqs, onChange }: FAQArrayEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newId = String(Date.now());
    onChange([
      ...faqs,
      {
        id: newId,
        question: "Your question here?",
        answer: "The answer to your question goes here.",
      },
    ]);
    setExpandedIndex(faqs.length);
  };

  const handleUpdate = (index: number, updates: Partial<FAQItem>) => {
    const updated = faqs.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    if (confirm("Delete this FAQ item?")) {
      onChange(faqs.filter((_, i) => i !== index));
      setExpandedIndex(null);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faqs.length) return;

    const updated = [...faqs];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
    setExpandedIndex(newIndex);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">FAQ Items ({faqs.length})</Label>
        <Button size="sm" variant="outline" onClick={handleAdd} className="h-8">
          <Plus className="h-3 w-3 mr-1" />
          Add Question
        </Button>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <Card key={faq.id} className="border border-gray-200">
            <CardHeader className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100">
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-2 flex-1"
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium line-clamp-1">
                      {faq.question}
                    </CardTitle>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(index, "up");
                    }}
                    disabled={index === 0}
                    title="Move Up"
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(index, "down");
                    }}
                    disabled={index === faqs.length - 1}
                    title="Move Down"
                  >
                    ↓
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedIndex === index && (
              <CardContent className="p-3 space-y-3 border-t">
                <div className="space-y-1.5">
                  <Label htmlFor={`question-${index}`} className="text-xs">
                    Question
                  </Label>
                  <Input
                    id={`question-${index}`}
                    value={faq.question}
                    onChange={(e) => handleUpdate(index, { question: e.target.value })}
                    placeholder="Enter your question..."
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`answer-${index}`} className="text-xs">
                    Answer
                  </Label>
                  <textarea
                    id={`answer-${index}`}
                    value={faq.answer}
                    onChange={(e) => handleUpdate(index, { answer: e.target.value })}
                    placeholder="Enter the answer..."
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                  />
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {faqs.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed rounded">
          No FAQ items yet. Click &quot;Add Question&quot; to get started.
        </div>
      )}
    </div>
  );
}
