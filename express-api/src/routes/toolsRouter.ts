import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { searchGeocoderAddresses } = controllers;

router.route(`/geocoder/addresses`).get(activeUserCheck, catchErrors(searchGeocoderAddresses));

export default router;
