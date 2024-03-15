import KeycloakService from '@/services/keycloak/keycloakService';
import logger from '@/utilities/winstonLogger';
import cron from 'node-cron';

const cronSyncKeycloakRoles = () => {
  // minute, hour, day of month, month, day of week
  const cronSchedule = '*/10 * * * *'; // Every 10 minutes
  cron.schedule(cronSchedule, async () => {
    logger.info(`Starting Sync Keycloak Roles routine at ${new Date().toISOString()}.`);
    await KeycloakService.syncKeycloakRoles();
    logger.info(`Sync Keycloak Roles routine complete at ${new Date().toISOString()}.`);
  });
};

export default cronSyncKeycloakRoles;
