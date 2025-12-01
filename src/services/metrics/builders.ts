import { CategorizedClient, Client } from '../../types';

export type GroupedCounts = { total: number; closed: number };

export const calculateConversion = (closed: number, total: number) =>
    total > 0 ? (closed / total) * 100 : 0;

export const buildOverview = (clients: Client[]) => {
    const totalClients = clients.length;
    const closedDeals = clients.filter((c) => c.closed === 1).length;
    const conversionRate = calculateConversion(closedDeals, totalClients);

    return {
        totalClients,
        closedDeals,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        averageInteractionVolume: 0,
    };
};

export const buildTimeSeries = (clients: Client[]) => {
    const monthMap = new Map<string, GroupedCounts>();

    clients.forEach((client) => {
        const date = new Date(client.fecha);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const current = monthMap.get(monthKey) || { total: 0, closed: 0 };
        monthMap.set(monthKey, {
            total: current.total + 1,
            closed: current.closed + (client.closed === 1 ? 1 : 0),
        });
    });

    return Array.from(monthMap.entries())
        .map(([month, data]) => {
            const notClosed = data.total - data.closed;
            const conversionRate = calculateConversion(data.closed, data.total);
            return {
                month,
                totalClients: data.total,
                closedDeals: data.closed,
                notClosedDeals: notClosed,
                conversionRate: parseFloat(conversionRate.toFixed(2)),
            };
        })
        .sort((a, b) => a.month.localeCompare(b.month));
};

