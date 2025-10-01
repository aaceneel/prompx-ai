import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Play, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface WorkflowStep {
  id: string;
  name: string;
  prompt: string;
  model?: string;
}

interface WorkflowBuilderProps {
  onExecute: (steps: WorkflowStep[]) => void;
  isExecuting: boolean;
}

export const WorkflowBuilder = ({ onExecute, isExecuting }: WorkflowBuilderProps) => {
  const { toast } = useToast();
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: '1', name: 'Step 1', prompt: '', model: 'google/gemini-2.5-flash' }
  ]);

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      name: `Step ${steps.length + 1}`,
      prompt: '',
      model: 'google/gemini-2.5-flash'
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    if (steps.length === 1) {
      toast({
        title: "Cannot remove",
        description: "Workflow must have at least one step",
        variant: "destructive"
      });
      return;
    }
    setSteps(steps.filter(step => step.id !== id));
  };

  const updateStep = (id: string, field: keyof WorkflowStep, value: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const handleExecute = () => {
    const emptySteps = steps.filter(s => !s.prompt.trim());
    if (emptySteps.length > 0) {
      toast({
        title: "Invalid workflow",
        description: "All steps must have a prompt",
        variant: "destructive"
      });
      return;
    }
    onExecute(steps);
  };

  const loadTemplate = (templateName: string) => {
    const templates: Record<string, WorkflowStep[]> = {
      'content-creation': [
        { id: '1', name: 'Research', prompt: 'Research the topic: {{input}} and provide key facts and insights', model: 'google/gemini-2.5-flash' },
        { id: '2', name: 'Outline', prompt: 'Create a detailed outline based on this research: {{previous}}', model: 'google/gemini-2.5-flash' },
        { id: '3', name: 'Write', prompt: 'Write a comprehensive article following this outline: {{previous}}', model: 'google/gemini-2.5-flash' },
        { id: '4', name: 'Polish', prompt: 'Polish and refine this article for better flow and engagement: {{previous}}', model: 'google/gemini-2.5-flash' }
      ],
      'social-media': [
        { id: '1', name: 'Summarize', prompt: 'Summarize this content in key points: {{input}}', model: 'google/gemini-2.5-flash' },
        { id: '2', name: 'Twitter Thread', prompt: 'Create an engaging Twitter thread from these points: {{previous}}', model: 'google/gemini-2.5-flash' },
        { id: '3', name: 'Hashtags', prompt: 'Generate relevant hashtags for this thread: {{previous}}', model: 'google/gemini-2.5-flash' }
      ],
      'analysis': [
        { id: '1', name: 'Analyze', prompt: 'Analyze this data/content: {{input}} and identify key patterns', model: 'google/gemini-2.5-flash' },
        { id: '2', name: 'Insights', prompt: 'Extract actionable insights from this analysis: {{previous}}', model: 'google/gemini-2.5-flash' },
        { id: '3', name: 'Report', prompt: 'Create a professional report with recommendations: {{previous}}', model: 'google/gemini-2.5-flash' }
      ]
    };

    if (templates[templateName]) {
      setSteps(templates[templateName]);
      toast({
        title: "Template loaded",
        description: `${templateName.replace('-', ' ')} workflow loaded successfully`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Workflow Builder</h3>
          <p className="text-sm text-muted-foreground">Chain multiple prompts for complex tasks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => loadTemplate('content-creation')}>
            Content Creation
          </Button>
          <Button variant="outline" size="sm" onClick={() => loadTemplate('social-media')}>
            Social Media
          </Button>
          <Button variant="outline" size="sm" onClick={() => loadTemplate('analysis')}>
            Analysis
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={step.id} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <Input
                    value={step.name}
                    onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                    className="w-40"
                    placeholder="Step name"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(step.id)}
                  disabled={steps.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Prompt</Label>
                <Textarea
                  value={step.prompt}
                  onChange={(e) => updateStep(step.id, 'prompt', e.target.value)}
                  placeholder="Use {{input}} for initial input or {{previous}} for previous step output"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Variables: <code className="px-1 py-0.5 bg-muted rounded">{'{{input}}'}</code> (your input), <code className="px-1 py-0.5 bg-muted rounded">{'{{previous}}'}</code> (previous step result)
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="flex justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={addStep} disabled={isExecuting}>
          <Plus className="h-4 w-4 mr-2" />
          Add Step
        </Button>
        <Button onClick={handleExecute} disabled={isExecuting} className="flex-1">
          <Play className="h-4 w-4 mr-2" />
          {isExecuting ? 'Executing Workflow...' : 'Execute Workflow'}
        </Button>
      </div>
    </div>
  );
};
