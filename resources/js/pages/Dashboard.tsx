import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { IndicatorCard } from '@/components/indicator-card';
import { DollarSign, Landmark, PiggyBank, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Chart from '@/components/client-only-chart';
import { useAppearance } from '@/hooks/use-appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type ChartView = 'month' | 'year';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VUV', // Using VUV for Vanuatu Vatu as VT is not standard
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function Dashboard() {
    const { props } = usePage<PageProps<{
        stats: {
            yourTotalContributionsThisYear: number;
            withdrawableAmount: number;
            yourRetainedShare: number;
            totalGroupContributionsThisYear: number;
        };
        charts: {
            monthlyContributions: { name: string; amount: number }[];
            yearlyGroupContributions: number[];
            cumulativeGroupContributions: number[];
        };
    }>>();

    const { stats, charts } = props;
    const [chartView, setChartView] = useState<ChartView>('month');
    const { theme } = useAppearance();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const groupContributionsOptions: ApexCharts.ApexOptions = {
        chart: {
            type: 'bar',
            foreColor: theme === 'dark' ? '#f8fafc' : '#020817',
        },
        xaxis: {
            categories: chartView === 'month' ? charts.monthlyContributions.map(c => c.name) : monthNames,
        },
        yaxis: {
            title: {
                text: 'Amount (VT)',
            },
        },
        tooltip: {
            theme: theme,
            y: {
                formatter: (val) => formatCurrency(val),
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 4,
            },
        },
        theme: {
            mode: theme,
        }
    };

    const groupContributionsSeries = [{
        name: 'Contribution',
        data: chartView === 'month' ? charts.monthlyContributions.map(c => c.amount) : charts.yearlyGroupContributions,
    }];

    const cumulativeChartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: 'area',
            foreColor: theme === 'dark' ? '#f8fafc' : '#020817',
        },
        xaxis: {
            categories: monthNames.slice(0, new Date().getMonth() + 1),
        },
        yaxis: {
            title: {
                text: 'Cumulative Amount (VT)',
            },
        },
        tooltip: {
            theme: theme,
            y: {
                formatter: (val) => formatCurrency(val),
            }
        },
        stroke: {
            curve: 'smooth',
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 90, 100],
            },
        },
        theme: {
            mode: theme,
        }
    };

    const cumulativeChartSeries = [{
        name: 'Cumulative Contributions',
        data: charts.cumulativeGroupContributions,
    }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <IndicatorCard
                        title="Your Total Contributions This Year"
                        value={formatCurrency(stats.yourTotalContributionsThisYear)}
                        icon={PiggyBank}
                    />
                    <IndicatorCard
                        title="How Much You Can Withdraw"
                        value={formatCurrency(stats.withdrawableAmount)}
                        icon={DollarSign}
                    />
                    <IndicatorCard
                        title="Your Retained Share"
                        value={formatCurrency(stats.yourRetainedShare)}
                        icon={Landmark}
                    />
                    <IndicatorCard
                        title="Total Group Contributions This Year"
                        value={formatCurrency(stats.totalGroupContributionsThisYear)}
                        icon={Users}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Group Contributions</CardTitle>
                             <ToggleGroup
                                type="single"
                                size="sm"
                                value={chartView}
                                onValueChange={(value: ChartView) => value && setChartView(value)}
                            >
                                <ToggleGroupItem value="month">Month</ToggleGroupItem>
                                <ToggleGroupItem value="year">Year</ToggleGroupItem>
                            </ToggleGroup>
                        </CardHeader>
                        <CardContent>
                             <Chart
                                options={groupContributionsOptions}
                                series={groupContributionsSeries}
                                type="bar"
                                height={350}
                            />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Group Cumulative Contributions This Year</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Chart
                                options={cumulativeChartOptions}
                                series={cumulativeChartSeries}
                                type="area"
                                height={350}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}