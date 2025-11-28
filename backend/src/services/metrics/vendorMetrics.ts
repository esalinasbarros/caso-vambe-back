import { Client, CategorizedClient } from '../../types';
import { GroupedCounts, calculateConversion } from './builders';

export const buildVendorMetrics = (clients: Client[]) => {
    const vendorMap = new Map<string, GroupedCounts>();

    clients.forEach((client) => {
        const current = vendorMap.get(client.vendedor) || { total: 0, closed: 0 };
        vendorMap.set(client.vendedor, {
            total: current.total + 1,
            closed: current.closed + (client.closed === 1 ? 1 : 0),
        });
    });

    return Array.from(vendorMap.entries()).map(([vendedor, data]) => ({
        vendedor,
        totalClients: data.total,
        closedDeals: data.closed,
        conversionRate: calculateConversion(data.closed, data.total),
    }));
};

export const buildVendorIndustryMetrics = (clients: CategorizedClient[]) => {
    const vendorIndustryMap = new Map<string, GroupedCounts>();

    clients.forEach((client) => {
        const vendor = client.vendedor;
        const industry = client.categories.industry || 'N/A';
        const key = `${vendor}|${industry}`;
        const current = vendorIndustryMap.get(key) || { total: 0, closed: 0 };
        vendorIndustryMap.set(key, {
            total: current.total + 1,
            closed: current.closed + (client.closed === 1 ? 1 : 0),
        });
    });

    return Array.from(vendorIndustryMap.entries()).map(([key, data]) => {
        const [vendedor, industry] = key.split('|');
        return {
            vendedor,
            industry,
            count: data.total,
            closedCount: data.closed,
            conversionRate: calculateConversion(data.closed, data.total),
        };
    });
};

export const buildVendorPainPointMetrics = (clients: CategorizedClient[]) => {
    const vendorPainPointMap = new Map<string, GroupedCounts>();

    clients.forEach((client) => {
        const vendor = client.vendedor;
        const painPoint = client.categories.painPoint || 'N/A';
        const key = `${vendor}|${painPoint}`;
        const current = vendorPainPointMap.get(key) || { total: 0, closed: 0 };
        vendorPainPointMap.set(key, {
            total: current.total + 1,
            closed: current.closed + (client.closed === 1 ? 1 : 0),
        });
    });

    return Array.from(vendorPainPointMap.entries()).map(([key, data]) => {
        const [vendedor, painPoint] = key.split('|');
        return {
            vendedor,
            painPoint,
            count: data.total,
            closedCount: data.closed,
            conversionRate: calculateConversion(data.closed, data.total),
        };
    });
};

export const buildVendorVolumeMetrics = (clients: CategorizedClient[]) => {
    const vendorVolumeMap = new Map<string, GroupedCounts>();

    clients.forEach((client) => {
        const vendor = client.vendedor;
        const volumeRange = client.categories.byVolume || 'N/A';
        const key = `${vendor}|${volumeRange}`;
        const current = vendorVolumeMap.get(key) || { total: 0, closed: 0 };
        vendorVolumeMap.set(key, {
            total: current.total + 1,
            closed: current.closed + (client.closed === 1 ? 1 : 0),
        });
    });

    return Array.from(vendorVolumeMap.entries()).map(([key, data]) => {
        const [vendedor, volumeRange] = key.split('|');
        return {
            vendedor,
            volumeRange,
            count: data.total,
            closedCount: data.closed,
            conversionRate: calculateConversion(data.closed, data.total),
        };
    });
};

