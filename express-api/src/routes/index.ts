import ltsaRouter from '@/routes/ltsaRouter';
import healthRouter from '@/routes/healthRouter';
import parcelsRouter from '@/routes/parcelsRouter';
import lookupRouter from '@/routes/lookupRouter';
import adminRouter from '@/routes/adminRouter';
import usersRouter from '@/routes/usersRouter';
import propertiesRouter from '@/routes/propertiesRouter';

const router = {
  healthRouter,
  ltsaRouter,
  parcelsRouter,
  lookupRouter,
  adminRouter,
  usersRouter,
  propertiesRouter,
};

export default router;
