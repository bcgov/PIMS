import { healthCheck } from '@/controllers/healthController';
import * as ltsa from '@/controllers/ltsa/ltsaController';
import * as buildings from '@/controllers/buildings/buildingsController';
import * as parcels from '@/controllers/parcels/parcelsController';
import * as lookup from '@/controllers/lookup/lookupController';
import * as users from '@/controllers/users/usersController';
import * as properties from '@/controllers/properties/propertiesController';
import * as projects from '@/controllers/projects/projectsController';
import * as notifications from '@/controllers/notifications/notificationsController';
import * as reports from '@/controllers/reports/reportsController';
import * as tools from '@/controllers/tools/toolsController';
import * as agencies from '@/controllers/agencies/agenciesController';
import * as roles from '@/controllers/roles/rolesController';

export default {
  healthCheck,
  ...roles,
  ...ltsa,
  ...buildings,
  ...parcels,
  ...lookup,
  ...users,
  ...properties,
  ...projects,
  ...notifications,
  ...reports,
  ...tools,
  ...agencies,
};
