import ltsaRouter from './ltsaRouter';
import healthRouter from './healthRouter';
import adminAccessRequestsRouter from './admin/accessRequestsRouter';

const router = {
  healthRouter,
  ltsaRouter,
  adminAccessRequestsRouter,
};

export default router;
