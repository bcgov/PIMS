import ltsaRouter from '@/routes/ltsaRouter';
import healthRouter from '@/routes/healthRouter';
import buildingsRouter from '@/routes/buildingsRouter';
import parcelsRouter from '@/routes/parcelsRouter';
import lookupRouter from '@/routes/lookupRouter';
import adminRouter from '@/routes/adminRouter';
import usersRouter from '@/routes/usersRouter';
import propertiesRouter from '@/routes/propertiesRouter';
import projectsRouter from '@/routes/projectsRouter';
import notificationsRouter from '@/routes/notificationsRouter';
import reportsRouter from '@/routes/reportsRouter';
import toolsRouter from '@/routes/toolsRouter';
import agenciesRouter from '@/routes/agenciesRouter';

const router = {
  healthRouter,
  ltsaRouter,
  buildingsRouter,
  parcelsRouter,
  lookupRouter,
  adminRouter,
  usersRouter,
  propertiesRouter,
  projectsRouter,
  notificationsRouter,
  reportsRouter,
  toolsRouter,
  agenciesRouter,
};

export default router;
