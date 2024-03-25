import ltsaRouter from '@/routes/ltsaRouter';
import healthRouter from '@/routes/healthRouter';
import buildingsRouter from '@/routes/buildingsRouter';
import parcelsRouter from '@/routes/parcelsRouter';
import lookupRouter from '@/routes/lookupRouter';
import usersRouter from '@/routes/usersRouter';
import propertiesRouter from '@/routes/propertiesRouter';
import projectsRouter from '@/routes/projectsRouter';
import notificationsRouter from '@/routes/notificationsRouter';
import reportsRouter from '@/routes/reportsRouter';
import toolsRouter from '@/routes/toolsRouter';
import agenciesRouter from '@/routes/agenciesRouter';
import administrativeAreasRouter from '@/routes/administrativeAreasRouter';
import rolesRouter from '@/routes/rolesRouter';

const router = {
  administrativeAreasRouter,
  healthRouter,
  ltsaRouter,
  buildingsRouter,
  parcelsRouter,
  lookupRouter,
  usersRouter,
  propertiesRouter,
  projectsRouter,
  notificationsRouter,
  reportsRouter,
  toolsRouter,
  agenciesRouter,
  rolesRouter,
};

export default router;
