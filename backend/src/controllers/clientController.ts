import { Context } from 'koa';
import * as clientService from '../services/clientService';

export const getClients = async (ctx: Context) => {
    try {
        const clients = await clientService.getClients();
        ctx.body = {
            success: true,
            data: clients,
            count: clients.length
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: (error as Error).message
        };
    }
};

export const getCategorizedClients = async (ctx: Context) => {
    try {
        const forceRefresh = ctx.query.forceRefresh === 'true';
        const categorizedClients = await clientService.getCategorizedClients(forceRefresh);
        ctx.body = {
            success: true,
            data: categorizedClients,
            count: categorizedClients.length
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: (error as Error).message
        };
    }
};

export const getCacheStatus = async (ctx: Context) => {
    try {
        const status = clientService.getCacheStatus();
        ctx.body = {
            success: true,
            data: status
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: (error as Error).message
        };
    }
};

export const clearCache = async (ctx: Context) => {
    try {
        clientService.clearCache();
        ctx.body = {
            success: true,
            message: 'Cache cleared successfully'
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: (error as Error).message
        };
    }
};

// Para uso futuro, todavia no veo una implementacion clara para esto

export const getClientById = async (ctx: Context) => {
    try {
        const id = parseInt(ctx.params.id);
        if (isNaN(id)) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                error: 'Invalid client ID'
            };
            return;
        }

        const client = await clientService.getClientById(id);
        if (!client) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                error: 'Client not found'
            };
            return;
        }

        ctx.body = {
            success: true,
            data: client
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: (error as Error).message
        };
    }
};
