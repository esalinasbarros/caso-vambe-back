import Router from '@koa/router';
import * as recommendationsController from '../controllers/recommendationsController';

const router = new Router({
    prefix: '/api/recommendations'
});

router.post('/', recommendationsController.getRecommendationController);

export default router;