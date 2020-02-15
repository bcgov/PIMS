import { IAddress } from "actions/parcelsActions";

class Address implements IAddress {
    line1: string;
    line2: string;
    city: string;
    province: string;
    postal: string;
    
    constructor (address:IAddress) {
        this.line1 = address.line1;
        this.line2 = address.line2;
        this.city = address.city;
        this.province = address.province;
        this.postal = address.postal;
    }
}