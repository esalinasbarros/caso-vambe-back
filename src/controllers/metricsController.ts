import { Context } from 'koa';
import * as metricsService from '../services/metricsService';

export const getMetrics = async (ctx: Context) => {
    try {
        const month = ctx.query.month as string | undefined;
        const metrics = await metricsService.getMetrics(month || null);
        ctx.body = {
            success: true,
            data: metrics
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: (error as Error).message
        };
    }
};

export const getBasicMetrics = async (ctx: Context) => {
    try {
        const month = ctx.query.month as string | undefined;
        const metrics = await metricsService.getBasicMetrics(month || null);
        ctx.body = {
            success: true,
            data: metrics
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: (error as Error).message
        };
    }
};

export const getAdvancedMetrics = async (ctx: Context) => {
    try {
        const forceRefresh = ctx.query.forceRefresh === 'true';
        const month = ctx.query.month as string | undefined;
        const result = await metricsService.getAdvancedMetrics(forceRefresh, month || null);
        ctx.body = {
            success: true,
            data: {
                metrics: result.metrics,
                categorizedClients: result.categorizedClients
            }
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: (error as Error).message
        };
    }
};
