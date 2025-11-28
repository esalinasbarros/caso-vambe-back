import Router from '@koa/router';
import clientRoutes from './clientRoutes';
import metricsRoutes from './metricsRoutes';
import recommendationRoutes from './recommendationRoutes';

const router = new Router();

router.get('/api/health', async (ctx) => {
    ctx.body = {
        status: 'ok',
        message: 'Funcionando correctamente',
        timestamp: new Date().toISOString()
    };
});

router.use(clientRoutes.routes());
router.use(clientRoutes.allowedMethods());
router.use(metricsRoutes.routes());
router.use(metricsRoutes.allowedMethods());
router.use(recommendationRoutes.routes());
router.use(recommendationRoutes.allowedMethods());

export default router;
