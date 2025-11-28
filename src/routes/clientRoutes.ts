import Router from '@koa/router';
import ratelimit from 'koa-ratelimit';
import * as clientController from '../controllers/clientController';

const router = new Router({
    prefix: '/api/clients'
});

router.get('/', clientController.getClients);
router.get('/categorized', clientController.getCategorizedClients);
router.get('/cache/status', clientController.getCacheStatus);
router.post('/cache/clear', clientController.clearCache);
router.get('/:id', clientController.getClientById);

export default router;
