using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Tools.Controllers;
using Pims.Core.Http.Models;
using Pims.Ltsa;
using LtsaModel = Pims.Core.Http.Models;
using Xunit;
using Pims.Dal.Security;
using Pims.Core.Test;
using System.Collections.Generic;
using System;

namespace Pims.Api.Test.Controllers.Tools
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "tools")]
    [Trait("group", "ltsa")]
    public class LtsaControllerTest
    {

        public LtsaControllerTest() { }

        [Fact]
        public async Task GetLandTitleInfo_WithValidPid_ReturnsOkResultWithLandTitle()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<LtsaController>(Permissions.PropertyEdit);
            // Arrange

            var pid = "005-666-767";
            var response = new LtsaOrderModel
            {
                Order = new LtsaOrder
                {
                    ProductType = "title",
                    FileReference = "test",
                    ProductOrderParameters = new LtsaProductOrderParameters
                    {
                        TitleNumber = "CA2998256",
                        LandTitleDistrictCode = "NW",
                        IncludeCancelledInfo = false
                    },
                    OrderId = Guid.NewGuid(),
                    Status = "Processing",
                    BillingInfo = new LtsaBillingInfo
                    {
                        BillingModel = "PROV",
                        ProductName = "Searches",
                        ProductCode = "Search",
                        FeeExempted = true,
                        ProductFee = 0,
                        ServiceCharge = 0.0,
                        SubtotalFee = 0.0,
                        ProductFeeTax = 0,
                        ServiceChargeTax = 0.0,
                        TotalTax = 0.0,
                        TotalFee = 0.0
                    },
                    OrderedProduct = new LtsaOrderedProduct
                    {
                        FieldedData = new LtsaFieldedData
                        {
                            TitleStatus = "REGISTERED",
                            TitleIdentifier = new LtsaTitleIdentifier
                            {
                                TitleNumber = "CA2998256",
                                LandTitleDistrict = "NEW WESTMINSTER"
                            },
                            Tombstone = new LtsaTombstone
                            {
                                ApplicationReceivedDate = DateTime.Parse("2013-02-19T00:31:57Z"),
                                EnteredDate = DateTime.Parse("2013-03-12T17:43:20Z"),
                                TitleRemarks = "",
                                RootOfTitle = "ROAD",
                                MarketValueAmount = "834750",
                                FromTitles = new List<object>(),
                                NatureOfTransfers = new List<LtsaNatureOfTransfer>
                    {
                        new LtsaNatureOfTransfer
                        {
                            TransferReason = "SEE DOCUMENTATION"
                        }
                    }
                            },
                            OwnershipGroups = new List<LtsaOwnershipGroup>
                {
                    new LtsaOwnershipGroup
                    {
                        JointTenancyIndication = false,
                        InterestFractionNumerator = "1",
                        InterestFractionDenominator = "1",
                        OwnershipRemarks = "",
                        TitleOwners = new List<LtsaTitleOwner>
                        {
                            new LtsaTitleOwner
                            {
                                LastNameOrCorpName1 = "BC TRANSPORTATION FINANCING AUTHORITY",
                                GivenName = "",
                                IncorporationNumber = "",
                                OccupationDescription = "",
                                Address = new LtsaAddress
                                {
                                    AddressLine1 = "P.O. BOX 9580, STN PROV GOVT",
                                    AddressLine2 = "",
                                    City = "VICTORIA",
                                    Province = "BC",
                                    ProvinceName = "BC",
                                    Country = "CANADA",
                                    PostalCode = "V8W 9T5"
                                }
                            }
                        }
                    }
                },
                            TaxAuthorities = new List<LtsaTaxAuthority>
                {
                    new LtsaTaxAuthority
                    {
                        AuthorityName = "Delta, City of"
                    }
                },
                            DescriptionsOfLand = new List<LtsaDescriptionOfLand>
                {
                    new LtsaDescriptionOfLand
                    {
                        ParcelIdentifier = "029-020-174",
                        FullLegalDescription = "THAT PART OF THE NORTHWEST 1/4 OF  SECTION 25  TOWNSHIP 5  \nNEW WESTMINSTER DISTRICT  SHOWN ON PLAN EPP67641  \n",
                        ParcelStatus = "ACTIVE"
                    }
                },
                            LegalNotationsOnTitle = new List<object>(),
                            DuplicateCertificatesOfTitle = new List<object>(),
                            TitleTransfersOrDispositions = new List<object>()
                        }
                    }
                }
            };


            var service = helper.GetService<Mock<ILtsaService>>();
            service.Setup(m => m.ProcessLTSARequest(pid)).ReturnsAsync(response);

            // Act
            var result = await controller.GetLandTitleInfo(pid);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var ltsaOrder = Assert.IsAssignableFrom<LtsaOrderModel>(actionResult.Value);
        }
    }
}
