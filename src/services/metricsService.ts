import { Metrics, CategorizedClient } from '../types';
import { loadClientsFromDatabase } from '../utils/clientLoader';
import { getCategorizedClients } from './clientService';
import { buildOverview, buildTimeSeries } from './metrics/builders';
import { buildVendorMetrics, buildVendorIndustryMetrics, buildVendorPainPointMetrics, buildVendorVolumeMetrics } from './metrics/vendorMetrics';
import { buildIndustryMetrics, buildDiscoveryChannelMetrics, buildPainPointMetrics, buildIntegrationNeedsMetrics, buildVolumeMetrics, buildSolutionPartMetrics, buildUsefulAddonsMetrics } from './metrics/categoryMetrics';

export async function getBasicMetrics(month?: string | null): Promise<Partial<Metrics>> {
    const clients = loadClientsFromDatabase(month);
    return {
        overview: buildOverview(clients),
        byVendor: buildVendorMetrics(clients),
        timeSeriesData: buildTimeSeries(clients),
    };
}

export async function getAdvancedMetrics(forceRefresh: boolean = false, month?: string | null): Promise<{ metrics: Partial<Metrics>; categorizedClients: CategorizedClient[] }> {
    const categorizedClients = await getCategorizedClients(forceRefresh, month);
    return {
        metrics: {
            byIndustry: buildIndustryMetrics(categorizedClients),
            byDiscoveryChannel: buildDiscoveryChannelMetrics(categorizedClients),
            byVendorIndustry: buildVendorIndustryMetrics(categorizedClients),
            byVendorPainPoint: buildVendorPainPointMetrics(categorizedClients),
            byVendorVolume: buildVendorVolumeMetrics(categorizedClients),
            byIntegrationNeeds: buildIntegrationNeedsMetrics(categorizedClients),
            byPainPoint: buildPainPointMetrics(categorizedClients),
            byVolume: buildVolumeMetrics(categorizedClients),
            bySolutionPart: buildSolutionPartMetrics(categorizedClients),
            byUsefulAddons: buildUsefulAddonsMetrics(categorizedClients),
        },
        categorizedClients,
    };
}

export async function getMetrics(month?: string | null): Promise<Metrics> {
    const basicMetrics = await getBasicMetrics(month);
    const { metrics: advancedMetrics } = await getAdvancedMetrics(false, month);
    return {
        ...basicMetrics,
        ...advancedMetrics,
    } as Metrics;
}
