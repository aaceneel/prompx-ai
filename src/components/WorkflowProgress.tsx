import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, Clock, AlertCircle } from "lucide-react";

export interface StepProgress {
  stepIndex: number;
  stepName: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  startTime?: number;
  endTime?: number;
  error?: string;
}

interface WorkflowProgressProps {
  steps: StepProgress[];
  currentStep: number;
  totalSteps: number;
}

export const WorkflowProgress = ({ steps, currentStep, totalSteps }: WorkflowProgressProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  const getStatusIcon = (status: StepProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getExecutionTime = (step: StepProgress) => {
    if (!step.startTime || !step.endTime) return null;
    const time = step.endTime - step.startTime;
    return time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(1)}s`;
  };

  const getStatusBadge = (status: StepProgress['status']) => {
    const variants: Record<StepProgress['status'], "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'outline',
      running: 'default',
      completed: 'secondary',
      error: 'destructive'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Workflow Progress</h4>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              step.status === 'running' ? 'border-blue-500 bg-blue-50/10' : 
              step.status === 'completed' ? 'border-green-500/20 bg-green-50/10' :
              step.status === 'error' ? 'border-red-500 bg-red-50/10' :
              'border-border'
            }`}
          >
            <div className="flex-shrink-0">
              {getStatusIcon(step.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">
                  {step.stepName}
                </span>
                {getStatusBadge(step.status)}
              </div>
              {step.error && (
                <p className="text-xs text-red-500 mt-1">{step.error}</p>
              )}
            </div>
            {step.status === 'completed' && (
              <div className="flex-shrink-0">
                <span className="text-xs text-muted-foreground">
                  {getExecutionTime(step)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
