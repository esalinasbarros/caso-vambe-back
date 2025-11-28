import { Context } from 'koa';
import { getRecommendation } from '../services/recommendationsService';

export const getRecommendationController = async (ctx: Context) => {
    try {
        const body = ctx.request.body as { clientDescription?: string } | undefined;
        const clientDescription = body?.clientDescription;

        if (!clientDescription || typeof clientDescription !== 'string' || !clientDescription.trim()) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                error: 'clientDescription es requerido y debe ser un string no vacío'
            };
            return;
        }

        const recommendation = await getRecommendation(clientDescription.trim());
        ctx.body = {
            success: true,
            data: recommendation
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: 'Error al generar la recomendación'
        };
    }
};