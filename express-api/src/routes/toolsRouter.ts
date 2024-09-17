import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { searchGeocoderAddresses, searchGeocoderSiteId } = controllers;

router.route(`/geocoder/addresses`).get(catchErrors(searchGeocoderAddresses));
router.route(`/geocoder/parcels/pids/:siteId`).get(catchErrors(searchGeocoderSiteId));

export default router;
