import ltsaRouter from '@/routes/ltsaRouter';
import healthRouter from '@/routes/healthRouter';
import parcelsRouter from '@/routes/parcelsRouter';
import lookupRouter from '@/routes/lookupRouter';
import adminRouter from '@/routes/adminRouter';
import usersRouter from '@/routes/usersRouter';
import projectRouter from '@/routes/projectRouter';
import notificationsRouter from '@/routes/notificationsRouter';

const router = {
  healthRouter,
  ltsaRouter,
  parcelsRouter,
  lookupRouter,
  adminRouter,
  usersRouter,
  projectRouter,
  notificationsRouter,
};

export default router;
