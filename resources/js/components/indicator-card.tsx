import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface IndicatorCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    className?: string;
}

export function IndicatorCard({ title, value, icon: Icon, className }: IndicatorCardProps) {
    return (
        <Card className={cn('flex flex-col', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}
