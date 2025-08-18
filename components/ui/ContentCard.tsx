import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContentCardProps {
  title: string;
  content: string;
  subtitle?: string;
  references?: string[];
  isCompleted?: boolean;
  onClick?: () => void;
}

export default function ContentCard({
  title,
  content,
  subtitle,
  references,
  isCompleted,
  onClick
}: ContentCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isCompleted ? 'ring-2 ring-amber-200 bg-amber-50/50 dark:bg-amber-900/10' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {isCompleted && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              Lido
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {content}
        </p>
        
        {references && references.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Referências:</p>
            <div className="flex flex-wrap gap-1">
              {references.map((ref, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {ref}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}