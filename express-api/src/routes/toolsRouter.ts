import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { searchGeocoderAddresses, searchGeocoderSiteId } = controllers;

router.route(`/geocoder/addresses`).get(activeUserCheck, catchErrors(searchGeocoderAddresses));
router
  .route(`/geocoder/parcels/pids/:siteId`)
  .get(activeUserCheck, catchErrors(searchGeocoderSiteId));

export default router;
