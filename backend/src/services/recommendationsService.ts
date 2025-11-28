import { llmGetIndustry } from './llmService';
import { getCategorizedClients } from './clientService';

export async function getRecommendation(clientDescription: string) {
    const industry = await llmGetIndustry(clientDescription);
    
    const categorizedClients = await getCategorizedClients();
    
    const vendorIndustryMap = new Map<string, { total: number; closed: number }>();
    
    categorizedClients.forEach((client) => {
        if (client.categories.industry === industry) {
            const vendor = client.vendedor;
            const current = vendorIndustryMap.get(vendor) || { total: 0, closed: 0 };
            vendorIndustryMap.set(vendor, {
                total: current.total + 1,
                closed: current.closed + (client.closed === 1 ? 1 : 0),
            });
        }
    });
    
    const vendors = Array.from(vendorIndustryMap.entries())
        .map(([vendedor, data]) => ({
            vendedor,
            totalClients: data.total,
            closedDeals: data.closed,
            conversionRate: data.total > 0 ? (data.closed / data.total) * 100 : 0,
        }))
        .sort((a, b) => b.conversionRate - a.conversionRate);
    
    return {
        industry,
        vendors,
    };
}

