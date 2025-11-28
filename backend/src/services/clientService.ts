import { Client, CategorizedClient, ClientCategories } from '../types';
import { loadClientsFromDatabase } from '../utils/clientLoader';
import { getDatabase } from '../utils/database';
import { llmClientCategorization } from './llmService';

export async function getClients(): Promise<Client[]> {
    return loadClientsFromDatabase();
}

function getCachedCategories(clientId: number): ClientCategories | null {
    const database = getDatabase();
    const row = database.prepare(`
        SELECT * FROM client_categories WHERE client_id = ?
    `).get(clientId) as any;
    
    if (!row) return null;
    
    let usefulAddons: string[] = [];
    if (row.useful_addons) {
        try {
            usefulAddons = JSON.parse(row.useful_addons);
        } catch (e) {
            usefulAddons = [];
        }
    }
    
    return {
        industry: row.industry || '',
        nicheIndustry: row.nicheIndustry || '',
        companySize: row.companySize || '',
        painPoint: row.painPoint || '',
        painPointDescription: row.painPointDescription || '',
        discoveryChannel: row.discoveryChannel || '',
        nicheDiscoveryChannel: row.nicheDiscoveryChannel || '',
        urgency: row.urgency || '',
        budgetIndicator: row.budgetIndicator || '',
        estimatedVolume: row.estimatedVolume || 0,
        integrationNeeds: row.integrationNeeds || '',
        byVolume: row.byVolume || '',
        solutionPart: row.solution_part || '',
        usefulAddons: usefulAddons,
    };
}

function saveCachedCategories(clientId: number, categories: ClientCategories): void {
    const database = getDatabase();
    database.prepare(`
        INSERT OR REPLACE INTO client_categories (
            client_id, industry, nicheIndustry, companySize, painPoint, painPointDescription,
            discoveryChannel, nicheDiscoveryChannel, urgency, budgetIndicator,
            estimatedVolume, integrationNeeds, byVolume, solution_part, useful_addons, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
        clientId,
        categories.industry,
        categories.nicheIndustry,
        categories.companySize,
        categories.painPoint,
        categories.painPointDescription,
        categories.discoveryChannel,
        categories.nicheDiscoveryChannel,
        categories.urgency,
        categories.budgetIndicator,
        categories.estimatedVolume,
        categories.integrationNeeds,
        categories.byVolume,
        categories.solutionPart,
        JSON.stringify(categories.usefulAddons || [])
    );
}

export async function getCategorizedClients(forceRefresh: boolean = false): Promise<CategorizedClient[]> {
    const clients = loadClientsFromDatabase();
    const database = getDatabase();
    
    const categorizedClients: CategorizedClient[] = [];
    const clientsToProcess: { client: Client; clientId: number }[] = [];
    
    const allClientsWithIds = database.prepare(`
        SELECT id, nombre, correo, telefono, fecha, vendedor, closed, transcripcion
        FROM clients
        ORDER BY id
    `).all() as any[];
    
    for (const dbClient of allClientsWithIds) {
        const client: Client = {
            nombre: dbClient.nombre,
            correo: dbClient.correo,
            telefono: dbClient.telefono || '',
            fecha: dbClient.fecha || '',
            vendedor: dbClient.vendedor || '',
            closed: dbClient.closed || 0,
            transcripcion: dbClient.transcripcion || '',
        };
        
        if (!forceRefresh) {
            const cached = getCachedCategories(dbClient.id);
            if (cached) {
                categorizedClients.push({
                    ...client,
                    categories: cached
                });
                continue;
            }
        }
        
        clientsToProcess.push({ client, clientId: dbClient.id });
    }
    
    if (clientsToProcess.length > 0) {
        const processed = await Promise.all(
            clientsToProcess.map(async ({ client, clientId }) => {
                const prompt = `Analiza este cliente y completa todos los campos de categorización.
                Nombre: ${client.nombre}
                Correo: ${client.correo}
                Transcripción: ${client.transcripcion}`;

                try {
                    const categories = await llmClientCategorization(prompt);
                    saveCachedCategories(clientId, categories);
                    
                    return {
                        ...client,
                        categories
                    };
                } catch (error) {
                    console.error(`Error procesando cliente ${client.nombre}:`, error);
                    const errorCategories: ClientCategories = {
                        industry: 'Error',
                        nicheIndustry: 'Error',
                        companySize: 'Error',
                        painPoint: 'Error',
                        painPointDescription: 'Error',
                        discoveryChannel: 'Error',
                        nicheDiscoveryChannel: 'Error',
                        urgency: 'Error',
                        budgetIndicator: 'Error',
                        estimatedVolume: 0,
                        integrationNeeds: 'Error',
                        byVolume: 'Error',
                        solutionPart: 'Error',
                        usefulAddons: [],
                    };
                    
                    return {
                        ...client,
                        categories: errorCategories
                    };
                }
            })
        );
        
        categorizedClients.push(...processed);
    }
    
    return categorizedClients.sort((a, b) => {
        const aId = allClientsWithIds.findIndex(c => c.nombre === a.nombre);
        const bId = allClientsWithIds.findIndex(c => c.nombre === b.nombre);
        return aId - bId;
    });
}

export function getCacheStatus(): { total: number; cached: number; lastUpdated: string | null } {
    const database = getDatabase();
    const total = database.prepare('SELECT COUNT(*) as count FROM clients').get() as { count: number };
    const cached = database.prepare('SELECT COUNT(*) as count FROM client_categories').get() as { count: number };
    const lastUpdated = database.prepare(`
        SELECT MAX(updated_at) as last_updated FROM client_categories
    `).get() as { last_updated: string | null };
    
    return {
        total: total.count,
        cached: cached.count,
        lastUpdated: lastUpdated.last_updated || null
    };
}

export function clearCache(): void {
    const database = getDatabase();
    database.prepare('DELETE FROM client_categories').run();
}

export async function getClientById(id: number): Promise<Client | null> {
    try {
        const { getDatabase } = await import('../utils/database');
        const database = getDatabase();
        
        const row = database.prepare(`
            SELECT nombre, correo, telefono, fecha, vendedor, closed, transcripcion
            FROM clients
            WHERE id = ?
        `).get(id) as any;
        
        if (!row) {
            return null;
        }
        
        return {
            nombre: row.nombre || '',
            correo: row.correo || '',
            telefono: row.telefono || '',
            fecha: row.fecha || '',
            vendedor: row.vendedor || '',
            closed: row.closed || 0,
            transcripcion: row.transcripcion || '',
        };
    } catch (error) {
        return null;
    }
}
