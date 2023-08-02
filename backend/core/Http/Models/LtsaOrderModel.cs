using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Pims.Core.Http.Models
{
    public class LtsaOrderModel
    {
        [JsonPropertyName("order")]
        public LtsaOrder Order { get; set; }
    }

    public class LtsaOrder
    {
        [JsonPropertyName("productType")]
        public string ProductType { get; set; }

        [JsonPropertyName("fileReference")]
        public string FileReference { get; set; }

        [JsonPropertyName("productOrderParameters")]
        public LtsaProductOrderParameters ProductOrderParameters { get; set; }

        [JsonPropertyName("orderId")]
        public Guid OrderId { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("billingInfo")]
        public LtsaBillingInfo BillingInfo { get; set; }

        [JsonPropertyName("orderedProduct")]
        public LtsaOrderedProduct OrderedProduct { get; set; }
    }

    public class LtsaProductOrderParameters
    {
        [JsonPropertyName("titleNumber")]
        public string TitleNumber { get; set; }

        [JsonPropertyName("landTitleDistrictCode")]
        public string LandTitleDistrictCode { get; set; }

        [JsonPropertyName("includeCancelledInfo")]
        public bool IncludeCancelledInfo { get; set; }
    }

    public class LtsaBillingInfo
    {
        [JsonPropertyName("billingModel")]
        public string BillingModel { get; set; }

        [JsonPropertyName("productName")]
        public string ProductName { get; set; }

        [JsonPropertyName("productCode")]
        public string ProductCode { get; set; }

        [JsonPropertyName("feeExempted")]
        public bool FeeExempted { get; set; }

        [JsonPropertyName("productFee")]
        public decimal ProductFee { get; set; }

        [JsonPropertyName("serviceCharge")]
        public double ServiceCharge { get; set; }

        [JsonPropertyName("subtotalFee")]
        public double SubtotalFee { get; set; }

        [JsonPropertyName("productFeeTax")]
        public int ProductFeeTax { get; set; }

        [JsonPropertyName("serviceChargeTax")]
        public double ServiceChargeTax { get; set; }

        [JsonPropertyName("totalTax")]
        public double TotalTax { get; set; }

        [JsonPropertyName("totalFee")]
        public double TotalFee { get; set; }
    }

    public class LtsaOrderedProduct
    {
        [JsonPropertyName("fieldedData")]
        public LtsaFieldedData FieldedData { get; set; }
    }

    public class LtsaFieldedData
    {
        [JsonPropertyName("titleStatus")]
        public string TitleStatus { get; set; }

        [JsonPropertyName("titleIdentifier")]
        public LtsaTitleIdentifier TitleIdentifier { get; set; }

        [JsonPropertyName("tombstone")]
        public LtsaTombstone Tombstone { get; set; }

        [JsonPropertyName("ownershipGroups")]
        public List<LtsaOwnershipGroup> OwnershipGroups { get; set; }

        [JsonPropertyName("taxAuthorities")]
        public List<LtsaTaxAuthority> TaxAuthorities { get; set; }

        [JsonPropertyName("descriptionsOfLand")]
        public List<LtsaDescriptionOfLand> DescriptionsOfLand { get; set; }

        [JsonPropertyName("legalNotationsOnTitle")]
        public List<object> LegalNotationsOnTitle { get; set; }

        [JsonPropertyName("duplicateCertificatesOfTitle")]
        public List<object> DuplicateCertificatesOfTitle { get; set; }

        [JsonPropertyName("titleTransfersOrDispositions")]
        public List<object> TitleTransfersOrDispositions { get; set; }
    }

    public class LtsaTitleIdentifier
    {
        [JsonPropertyName("titleNumber")]
        public string TitleNumber { get; set; }

        [JsonPropertyName("landTitleDistrict")]
        public string LandTitleDistrict { get; set; }
    }

    public class LtsaTombstone
    {
        [JsonPropertyName("applicationReceivedDate")]
        public DateTime ApplicationReceivedDate { get; set; }

        [JsonPropertyName("enteredDate")]
        public DateTime EnteredDate { get; set; }

        [JsonPropertyName("titleRemarks")]
        public string TitleRemarks { get; set; }

        [JsonPropertyName("rootOfTitle")]
        public string RootOfTitle { get; set; }

        [JsonPropertyName("marketValueAmount")]
        public string MarketValueAmount { get; set; }

        [JsonPropertyName("fromTitles")]
        public List<object> FromTitles { get; set; }

        [JsonPropertyName("natureOfTransfers")]
        public List<LtsaNatureOfTransfer> NatureOfTransfers { get; set; }
    }

    public class LtsaNatureOfTransfer
    {
        [JsonPropertyName("transferReason")]
        public string TransferReason { get; set; }
    }

    public class LtsaOwnershipGroup
    {
        [JsonPropertyName("jointTenancyIndication")]
        public bool JointTenancyIndication { get; set; }

        [JsonPropertyName("interestFractionNumerator")]
        public string InterestFractionNumerator { get; set; }

        [JsonPropertyName("interestFractionDenominator")]
        public string InterestFractionDenominator { get; set; }

        [JsonPropertyName("ownershipRemarks")]
        public string OwnershipRemarks { get; set; }

        [JsonPropertyName("titleOwners")]
        public List<LtsaTitleOwner> TitleOwners { get; set; }
    }

    public class LtsaTitleOwner
    {
        [JsonPropertyName("lastNameOrCorpName1")]
        public string LastNameOrCorpName1 { get; set; }

        [JsonPropertyName("givenName")]
        public string GivenName { get; set; }

        [JsonPropertyName("incorporationNumber")]
        public string IncorporationNumber { get; set; }

        [JsonPropertyName("occupationDescription")]
        public string OccupationDescription { get; set; }

        [JsonPropertyName("address")]
        public LtsaAddress Address { get; set; }
    }

    public class LtsaAddress
    {
        [JsonPropertyName("addressLine1")]
        public string AddressLine1 { get; set; }

        [JsonPropertyName("addressLine2")]
        public string AddressLine2 { get; set; }

        [JsonPropertyName("city")]
        public string City { get; set; }

        [JsonPropertyName("province")]
        public string Province { get; set; }

        [JsonPropertyName("provinceName")]
        public string ProvinceName { get; set; }

        [JsonPropertyName("country")]
        public string Country { get; set; }

        [JsonPropertyName("postalCode")]
        public string PostalCode { get; set; }
    }

    public class LtsaTaxAuthority
    {
        [JsonPropertyName("authorityName")]
        public string AuthorityName { get; set; }
    }

    public class LtsaDescriptionOfLand
    {
        [JsonPropertyName("parcelIdentifier")]
        public string ParcelIdentifier { get; set; }

        [JsonPropertyName("fullLegalDescription")]
        public string FullLegalDescription { get; set; }

        [JsonPropertyName("parcelStatus")]
        public string ParcelStatus { get; set; }
    }
}
