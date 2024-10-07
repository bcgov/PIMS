import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { searchGeocoderAddresses } = controllers;

router.route(`/geocoder/addresses`).get(catchErrors(searchGeocoderAddresses));

export default router;
