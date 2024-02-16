
import { AppDataSource } from "@/appDataSource";
import { GeocoderService } from "@/services/geocoder/geocoderService";

describe('UNIT - Geoserver services', () => {
    describe('getSiteAddresses', () => {
        it('should get an address from Geocoder service.', async () => {
            const address = await GeocoderService.getSiteAddresses('4000 Seymour pl BC');
            expect(typeof(address) === 'object' && 
                   !Array.isArray(address) &&
                   address !== null ).toBe(true);
            expect(address.siteId != '').toBe(true);
        });
    });

    describe('getPids', () => {
        it('should get a list of PIDs connected to the site address.', async () => {
            const pids = await GeocoderService.getPids("eccd759a-8476-46b0-af5d-e1c071f8e78e");
            expect(typeof(pids) === 'object' && !Array.isArray(pids) && pids !== null).toBe(true);
            expect(typeof(pids.pids) === 'string' && pids.pids === '000382345').toBe(true);
        });
    });
})
