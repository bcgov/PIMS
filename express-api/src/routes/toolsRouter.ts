import controllers from '@/controllers';
import express from 'express';

const router = express.Router();

router.route(`/ches`).post(controllers.sendChesMessage);
router.route(`/ches/status/`).get(controllers.getChesMessageStatuses);
router.route(`/ches/status/:messageId`).get(controllers.getChesMessageStatusById);
router.route(`/ches/cancel/:messageId`).delete(controllers.cancelChesMessageById);
router.route(`/ches/cancel/`).delete(controllers.cancelChesMessages);

router.route(`/geocoder/addresses`).get(controllers.searchGeocoderAddresses);
router.route(`/geocoder/parcels/pids/:siteId`).get(controllers.searchGeocoderSiteId);

router.route(`/import/properties`).post(controllers.bulkImportProperties);
router.route(`/import/properties`).delete(controllers.bulkDeleteProperties);

//This is originally implemented as POST, but that doesn't really make sense since the documentation
//implies that the resource must already exist for this one to work. So it's really more of a partial update.
router.route(`/import/properties/financials`).patch(controllers.bulkUpdatePropertyFinancials);

router.route(`/import/projects`).post(controllers.bulkImportProjects);

export default router;
