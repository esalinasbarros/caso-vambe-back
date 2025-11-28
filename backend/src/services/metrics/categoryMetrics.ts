import { CategorizedClient } from '../../types';
import { GroupedCounts, calculateConversion } from './builders';

export const buildIndustryMetrics = (clients: CategorizedClient[]) => {
    const industryMap = new Map<string, GroupedCounts>();

    clients.forEach((client) => {
        const industry = client.categories.industry || 'N/A';
        const current = industryMap.get(industry) || { total: 0, closed: 0 };
        industryMap.set(industry, {
            total: current.total + 1,
            closed: current.closed + (client.closed === 1 ? 1 : 0),
        });
    });

    return Array.from(industryMap.entries()).map(([industry, data]) => ({
        industry,
        count: data.total,
        closedCount: data.closed,
        conversionRate: calculateConversion(data.closed, data.total),
    }));
};

export const buildDiscoveryChannelMetrics = (clients: CategorizedClient[]) => {
    const channelMap = new Map<string, GroupedCounts>();

    clients.forEach((client) => {
        const channel = client.categories.discoveryChannel || 'N/A';
        const current = channelMap.get(channel) || { total: 0, closed: 0 };
        channelMap.set(channel, {
            total: current.total + 1,
            closed: current.closed + (client.closed === 1 ? 1 : 0),
        });
    });

    return Array.from(channelMap.entries()).map(([channel, data]) => ({
        channel,
        count: data.total,
        closedCount: data.closed,
        conversionRate: calculateConversion(data.closed, data.total),
    }));
};

export const buildPainPointMetrics = (clients: CategorizedClient[]) => {
    const painPointMap = new Map<string, GroupedCounts>();

    clients.forEach((client) => {
        const painPoint = client.categories.painPoint || 'N/A';
        const current = painPointMap.get(painPoint) || { total: 0, closed: 0 };
        painPointMap.set(painPoint, {
            total: current.total + 1,
            closed: current.closed + (client.closed === 1 ? 1 : 0),
        });
    });

    return Array.from(painPointMap.entries())
        .map(([painPoint, data]) => ({
            painPoint,
            count: data.total,
            closedCount: data.closed,
            conversionRate: calculateConversion(data.closed, data.total),
        }))
        .sort((a, b) => b.count - a.count);
};

export const buildIntegrationNeedsMetrics = (clients: CategorizedClient[]) => {
    const integrationMap = new Map<string, number>();

    clients
        .filter((client) => client.closed === 0)
        .forEach((client) => {
            const integrationNeed = client.categories.integrationNeeds || 'N/A';
            const current = integrationMap.get(integrationNeed) || 0;
            integrationMap.set(integrationNeed, current + 1);
        });

    return Array.from(integrationMap.entries())
        .map(([integrationNeed, count]) => ({
            integrationNeed,
            count,
        }))
        .sort((a, b) => b.count - a.count);
};

export const buildVolumeMetrics = (clients: CategorizedClient[]) => {
    const volumeMap = new Map<string, GroupedCounts>();

    clients.forEach((client) => {
        const volumeRange = client.categories.byVolume || 'N/A';
        const current = volumeMap.get(volumeRange) || { total: 0, closed: 0 };
        volumeMap.set(volumeRange, {
            total: current.total + 1,
            closed: current.closed + (client.closed === 1 ? 1 : 0),
        });
    });

    // Ordenar por rango de volumen (de menor a mayor)
    const volumeOrder = ['0-50', '51-100', '101-200', '201-500', '500+', 'N/A'];
    
    return Array.from(volumeMap.entries())
        .map(([volumeRange, data]) => ({
            volumeRange,
            count: data.total,
            closedCount: data.closed,
            conversionRate: calculateConversion(data.closed, data.total),
        }))
        .sort((a, b) => {
            const indexA = volumeOrder.indexOf(a.volumeRange);
            const indexB = volumeOrder.indexOf(b.volumeRange);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
};

export const buildSolutionPartMetrics = (clients: CategorizedClient[]) => {
    const solutionPartMap = new Map<string, GroupedCounts>();

    clients.forEach((client) => {
        const solutionPart = client.categories.solutionPart || 'N/A';
        const current = solutionPartMap.get(solutionPart) || { total: 0, closed: 0 };
        solutionPartMap.set(solutionPart, {
            total: current.total + 1,
            closed: current.closed + (client.closed === 1 ? 1 : 0),
        });
    });

    const solutionPartOrder = ['Vambe AI', 'Vambe Ads', 'Vambe Connect', 'N/A'];
    
    return Array.from(solutionPartMap.entries())
        .map(([solutionPart, data]) => ({
            solutionPart,
            count: data.total,
            closedCount: data.closed,
            conversionRate: calculateConversion(data.closed, data.total),
        }))
        .sort((a, b) => {
            const indexA = solutionPartOrder.indexOf(a.solutionPart);
            const indexB = solutionPartOrder.indexOf(b.solutionPart);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
};

export const buildUsefulAddonsMetrics = (clients: CategorizedClient[]) => {
    const addonMap = new Map<string, number>();

    clients
        .filter((client) => client.closed === 1)
        .forEach((client) => {
            const addons = client.categories.usefulAddons || [];
            addons.forEach((addon) => {
                const current = addonMap.get(addon) || 0;
                addonMap.set(addon, current + 1);
            });
        });

    return Array.from(addonMap.entries())
        .map(([addon, count]) => ({
            addon,
            count,
        }))
        .sort((a, b) => b.count - a.count);
};

