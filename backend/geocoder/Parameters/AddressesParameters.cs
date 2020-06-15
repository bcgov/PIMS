namespace Pims.Geocoder.Parameters
{
    /// <summary>
    /// AddressesParameters class, provides a way to pass parametesr to the addresses endpoint.
    /// </summary>
    public class AddressesParameters
    {
        #region Properties
        /// <summary>
        /// get/set - The API version.
        /// </summary>
        public string Ver { get; set; } = "1.2";

        /// <summary>
        /// get/set - Civic address or intersection address as a single string in Single-line Address Format. If not present in an address request, individual address elements, such as streetName, localityName, and provinceCode must be provided.
        /// In an occupant/addresses resource, addressString represents an Occupant name followed by a frontGate delimiter('--') followed by an optional address.
        /// </summary>
        public string AddressString { get; set; }

        /// <summary>
        /// get/set - Describes the nature of the address location. Values include accessPoint, frontDoorPoint, parcelPoint, rooftopPoint, and routingPoint. As an input parameter, a value of any is allowed. When any is specified, a point type other than accessPoint will be returned if one is defined; otherwise, an accessPoint will be returned.
        /// </summary>
        public string LocationDescriptor { get; set; } = "any";

        /// <summary>
        /// get/set - The maximum number of search results to return.
        /// </summary>
        public int MaxResults { get; set; } = 5;

        /// <summary>
        /// get/set - In the case of a block level match, the method of interpolation to determine how far down the block the accessPoint should be. The geocoder supports linear and adaptive interpolation.
        /// </summary>
        public string Interpolation { get; set; } = "adaptive";

        /// <summary>
        /// get/set - If true, include unmatched address details such as site name in results.
        /// </summary>
        public bool Echo { get; set; }

        /// <summary>
        /// get/set - If true, include only basic match and address details in results. Not supported for shp, csv, and gml formats.
        /// </summary>
        public bool Brief { get; set; }

        /// <summary>
        /// get/set - If true, addressString is expected to contain a partial address that requires completion. Not supported for shp, csv, gml formats.
        /// </summary>
        public bool AutoComplete { get; set; }

        /// <summary>
        /// get/set - The distance to move the accessPoint away from the curb and towards the inside of the parcel (in metres). Ignored if locationDescriptor not set to accessPoint.
        /// </summary>
        public int SetBack { get; set; }

        /// <summary>
        /// get/set - The EPSG code of the spatial reference system used to state the coordination location of a named feature. It is ignored if KML output is specified since KML only supports 4326 (WGS84). Allowed values are:
        /// 3005: BC Albers
        /// 4326: WGS 84 (default)
        /// 26907-26911: NAD83/UTM Zones 7N through 11N
        /// 32607-32611: WGS84/UTM Zones 7N through 11N
        /// 26707-26711: NAD27/UTM Zones 7N through 11N
        /// </summary>
        public int OutputSRS { get; set; } = 4326;

        /// <summary>
        /// get/set - The minimum score required for a match to be returned.
        /// </summary>
        public int MinScore { get; set; }

        /// <summary>
        /// get/set - The level of precision of an address match. Here are the nine levels from the most precise to least precise:
        /// OCCUPANT – the site occupant name matched
        /// SITE – the site name matched
        /// UNIT – the unit number, unit number suffix, and unit designator matched
        /// CIVIC_NUMBER – the civic number matched
        /// INTERSECTION – the intersection matched
        /// BLOCK – the civic number falls within a known block range
        /// STREET – the street name, street direction, and street type matched
        /// LOCALITY – the locality matched
        /// PROVINCE - no match
        /// When used as an input parameter, matchPrecision is a comma-separated list of matchPrecision levels.Only matches with a matchPrecision in this list will be included in the request results.For example, matchPrecision = STREET will only include street-level matches.
        /// </summary>
        public string MatchPrecision { get; set; }

        /// <summary>
        /// get/set - A comma-separated list of matchPrecision levels to exclude from request results. For example, &matchPrecisionNot=UNIT,SITE will exclude matches at the unit and site levels.
        /// </summary>
        public string MatchPrecisionNot { get; set; }

        /// <summary>
        /// get/set - A string containing the name of a site (e.g., Duck Building, Casa Del Mar, Crystal Garden, Bluebird House). A business name should only be used if it is permanently affixed to the site and the site has no other, more generic name. If a site is a unit within a complex, it may have a sitename in addition to a unitNumber and unitNumberSuffix.
        /// </summary>
        public string SiteName { get; set; }

        /// <summary>
        /// get/set - The type of unit. Examples include APT, BLDG, BSMT, FLR, LOBBY, LWR, PAD, PH, REAR, RM, SIDE, SITE, SUITE, TH, UNIT, UPPR.
        /// </summary>
        public string UnitDesignator { get; set; }

        /// <summary>
        /// get/set - The number of the unit, suite, or apartment within a house or building.
        /// </summary>
        public string UnitNumber { get; set; }

        /// <summary>
        /// get/set - A letter that follows the unit number as in Unit 1A or Suite 302B.
        /// </summary>
        public string UnitNumberSuffix { get; set; }

        /// <summary>
        /// get/set - The official number assigned to a site by an address authority.
        /// </summary>
        public string CivicNumber { get; set; }

        /// <summary>
        /// get/set - A letter or fraction that follows the civic number (e.g., the A in 1039A Bledsoe St).
        /// </summary>
        public string CivicNumberSuffix { get; set; }

        /// <summary>
        /// get/set - The official name of the street as assigned by an address authority (e.g., the Douglas in 1175 Douglas Street).
        /// </summary>
        public string StreetName { get; set; }

        /// <summary>
        /// get/set - The type of street as assigned by a municipality (e.g., the ST in 1175 DOUGLAS St).
        /// </summary>
        public string StreetType { get; set; }

        /// <summary>
        /// get/set - The abbreviated compass direction as defined by Canada Post and B.C. civic addressing authorities.
        /// </summary>
        public string StreetDirection { get; set; }

        /// <summary>
        /// get/set - Example: the Bridge in Johnson St Bridge. The qualifier of a street name.
        /// </summary>
        public string StreetQualifier { get; set; }

        /// <summary>
        /// get/set - The name of the locality assigned to a given site by an address authority.
        /// </summary>
        public string LocalityName { get; set; }

        /// <summary>
        /// get/set - The ISO 3166-2 Sub-Country Code. The code for British Columbia is BC.
        /// </summary>
        public string ProvinceCode { get; set; }

        /// <summary>
        /// get/set - A comma separated list of locality names that matched addresses must belong to. For example, setting localities to Nanaimo only returns addresses in Nanaimo
        /// </summary>
        public string Localities { get; set; }

        /// <summary>
        /// get/set - A comma-separated list of localities to exclude from the search.
        /// </summary>
        public string NotLocalities { get; set; }

        /// <summary>
        /// get/set - Example: -126.07929,49.7628,-126.0163,49.7907. A bounding box (xmin,ymin,xmax,ymax) that limits the search area.
        /// </summary>
        public string Bbox { get; set; }

        /// <summary>
        /// get/set - Example: -124.0165926,49.2296251 . The coordinates of a centre point (x,y) used to define a bounding circle that will limit the search area. This parameter must be specified together with 'maxDistance'. 
        /// </summary>
        public string Center { get; set; }

        /// <summary>
        /// get/set - The maximum distance (in metres) to search from the given point. If not specified, the search distance is unlimited.
        /// </summary>
        public double MaxDistance { get; set; }

        /// <summary>
        /// get/set - If true, uses supplied parcelPoint to derive an appropriate accessPoint. 
        /// </summary>
        public bool Extrapolate { get; set; }

        /// <summary>
        /// get/set - The coordinates of a point (x,y) known to be inside the parcel containing a given address.
        /// </summary>
        public string ParcelPoint { get; set; }
        #endregion
    }
}
