import admin from '@/controllers/admin';
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

export default {
  healthCheck,
  ...ltsa,
  ...buildings,
  ...parcels,
  ...lookup,
  admin,
  ...users,
  ...properties,
  ...projects,
  ...notifications,
  ...reports,
};
