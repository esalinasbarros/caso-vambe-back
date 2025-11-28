import Router from '@koa/router';
import * as metricsController from '../controllers/metricsController';

const router = new Router({
    prefix: '/api/metrics'
});

router.get('/', metricsController.getMetrics);
router.get('/basic', metricsController.getBasicMetrics);
router.get('/advanced', metricsController.getAdvancedMetrics);

export default router;
