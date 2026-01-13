import { useEffect, useState } from 'react';
import type { Props as ApexChartProps } from 'react-apexcharts';

const Chart = (props: ApexChartProps) => {
    const [ChartComponent, setChartComponent] = useState<React.ComponentType<ApexChartProps> | null>(null);

    useEffect(() => {
        import('react-apexcharts').then((mod) => {
            setChartComponent(() => mod.default);
        });
    }, []);

    if (!ChartComponent) {
        return null;
    }

    return <ChartComponent {...props} />;
};

export default Chart;
