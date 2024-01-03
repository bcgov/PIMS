import ltsaRouter from '@/routes/ltsaRouter';
import healthRouter from '@/routes/healthRouter';
import buildingsRouter from '@/routes/buildingsRouter';
import parcelsRouter from '@/routes/parcelsRouter';
import lookupRouter from '@/routes/lookupRouter';
import adminRouter from '@/routes/adminRouter';
import usersRouter from '@/routes/usersRouter';

const router = {
  healthRouter,
  ltsaRouter,
  buildingsRouter,
  parcelsRouter,
  lookupRouter,
  adminRouter,
  usersRouter,
};

export default router;
