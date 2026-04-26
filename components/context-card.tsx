import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ContextCardProps = {
  title: string;
  caseNumber: number;
  description: string;
  steps: string[];
  tryItText: string;
};

export function ContextCard({
  title,
  caseNumber,
  description,
  steps,
  tryItText,
}: ContextCardProps) {
  return (
    <Card className="border-border bg-white shadow-sm h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-brand-gold/15 text-brand-gold border-brand-gold/30 hover:bg-brand-gold/20 text-xs">
            Case {caseNumber}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold text-brand-navy">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-brand-text leading-relaxed">
        <p>{description}</p>

        <div>
          <p className="font-semibold text-brand-navy text-xs uppercase tracking-wide mb-2">
            How it works
          </p>
          <ol className="list-decimal list-inside space-y-1 text-brand-muted text-sm">
            {steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="border-t border-brand-gold/20 pt-3">
          <p className="font-semibold text-brand-navy text-xs uppercase tracking-wide mb-1">
            Try it
          </p>
          <p className="text-brand-muted text-sm">{tryItText}</p>
        </div>
      </CardContent>
    </Card>
  );
}
