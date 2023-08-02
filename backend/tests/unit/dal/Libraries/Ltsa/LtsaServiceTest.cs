using FluentAssertions;
using Microsoft.Extensions.Options;
using Moq;
using Pims.Ltsa;
using Pims.Ltsa.Configuration;
using Pims.Core.Exceptions;
using Pims.Core.Http;
using Pims.Core.Http.Models;
using Pims.Core.Test;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Xunit;
using Pims.Ches.Models;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Areas.Tools.Controllers;
using Pims.Dal.Security;
using System.Text.Json;
using static Pims.Ltsa.LtsaService;

namespace Pims.Dal.Test.Libraries.Ltsa
{
    [Trait("category", "unit")]
    [Trait("category", "ltsa")]
    [Trait("group", "notification")]
    [ExcludeFromCodeCoverage]
    public class LtsaServiceTest
    {

        #region Tests
        #region GetTokenAsync
        [Fact]
        public async void GetLtsaTokenAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new LtsaOptions()
            {
                AuthUrl = "https://test.com",
                HostUri = "https://host.com",
                IntegratorPassword = "password",
                IntegratorUsername = "username",
                UserName = "user",
                UserPassword = "password"
            });
            var service = helper.Create<LtsaService>(options, user);

            var token = new LtsaTokenModel();
            token.AccessToken = "abc123";
            token.RefreshToken = "12345";
            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<LtsaTokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);

            var pid = "123123123";

            // Act
            var result = await service.GetTokenAsync(pid);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.AccessToken);
            Assert.NotNull(result.RefreshToken);
            Assert.IsAssignableFrom<LtsaTokenModel>(result);
            //client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
            //    It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
            //    It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
        }
        #endregion



        [Fact]
        public async void GetTokenAsync_LtsaExeption()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new LtsaOptions()
            {
                AuthUrl = "https://test.com",
                HostUri = "https://host.com",
                IntegratorPassword = "password",
                IntegratorUsername = "username",
                UserName = "user",
                UserPassword = "password"
            });
            var service = helper.Create<LtsaService>(options, user);

            var response = new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Post, "https://test")
            };
            var client = helper.GetService<Mock<IHttpRequestClient>>();

            var token = new LtsaTokenModel();
            token.AccessToken = "abc123";
            token.RefreshToken = "12345";
            client.Setup(m => m.SendAsync<LtsaTokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ThrowsAsync(new HttpClientRequestException(response));
            client.Setup(m => m.DeserializeAsync<ErrorResponseModel>(It.IsAny<HttpResponseMessage>())).ReturnsAsync(new ErrorResponseModel());

            var pid = "123123123";
            // Act
            // Assert
            var result = await Assert.ThrowsAsync<LTSAApiException>(async () => await service.GetTokenAsync(pid));

            Assert.NotNull(result);
            Assert.IsAssignableFrom<LTSAApiException>(result);
            client.Verify(m => m.SendAsync<LtsaTokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.IsAny<HttpContent>(), null), Times.Once);
        }
        #endregion

        [Fact]
        public async void GetTitleSummary_ReturnsTitleSummaryResponse()
        {
            // Arrange
            var accessToken = "testAccessToken";
            var parcelIdentifier = "testParcelIdentifier";
            var expectedResponse = new LtsaTitleSummaryResponse
            {
                TitleSummaries = new List<LtsaTitleSummaryModel>
                {
                    new LtsaTitleSummaryModel
                    {
                        TitleNumber = "123",
                        LandTitleDistrictCode = "ABC",
                        ParcelIdentifier = "TEST",
                        Status = "Active",
                        FirstOwner = "John Doe"
                    }
                }
            };

            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new LtsaOptions()
            {
                AuthUrl = "https://test.com",
                HostUri = "https://host.com",
                IntegratorPassword = "password",
                IntegratorUsername = "username",
                UserName = "user",
                UserPassword = "password"
            });
            var service = helper.Create<LtsaService>(options, user);

            var token = new LtsaTokenModel();
            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<LtsaTitleSummaryResponse>(It.IsAny<string>(), HttpMethod.Get, It.IsAny<HttpRequestHeaders>(), null, null)).ReturnsAsync(expectedResponse);

            // Act
            var result = await service.GetTitleSummary(accessToken, parcelIdentifier);

            // Assert
            result.Should().BeEquivalentTo(expectedResponse);
        }

        #region FindPidsAsync
        [Fact]
        public async void FindLTSATitleAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<LtsaController>(Permissions.PropertyView);

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
            //ltsaOrder.Order.BillingInfo
        }
        #endregion


        #region
        [Fact]
        public async void ProcessLTSARequest_Success()
        {
            // Arrange
            var helper = new TestHelper();
            // var controller = helper.CreateController<LtsaController>(Permissions.PropertyEdit);

            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new LtsaOptions()
            {
                AuthUrl = "https://test.com",
                HostUri = "https://host.com/",
                IntegratorPassword = "password",
                IntegratorUsername = "username",
                UserName = "user",
                UserPassword = "password"
            });
            // Arrange

            var apiUrl = "https://host.com/orders";
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

            var token = new LtsaTokenModel();
            token.AccessToken = "abc123";
            token.RefreshToken = "12345";
            var titleSummaryResponse = new LtsaTitleSummaryResponse
            {
                TitleSummaries = new List<LtsaTitleSummaryModel>
                {
                    new LtsaTitleSummaryModel
                    {
                        TitleNumber = "123",
                        LandTitleDistrictCode = "ABC",
                        ParcelIdentifier = "TEST",
                        Status = "Active",
                        FirstOwner = "John Doe"
                    }
                }
            };

            // var service = helper.GetService<Mock<ILtsaService>>();
            // service.Setup(m => m.ProcessLTSARequest(pid)).ReturnsAsync(response);

            var service = helper.Create<LtsaService>(options, user);
            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<LtsaTokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);


            client.Setup(m => m.SendAsync<LtsaTitleSummaryResponse>(It.IsAny<string>(), HttpMethod.Get, It.IsAny<HttpRequestHeaders>(), null, null)).ReturnsAsync(titleSummaryResponse);

            client.Setup(m => m.SendAsync<LtsaOrderModel>(It.IsAny<string>(), HttpMethod.Get, It.IsAny<HttpRequestHeaders>(), null, null)).ReturnsAsync(response);


            client.Setup(m => m.SendAsync<LtsaOrderModel>(apiUrl, HttpMethod.Post, It.IsAny<HttpRequestHeaders>(), It.IsAny<StringContent>(), null)).ReturnsAsync(response);

            // Act
            var result = await service.ProcessLTSARequest(pid);   //controller.GetLandTitleInfo(pid);

            // Assert
            LtsaOrderModel actionResult = Assert.IsType<LtsaOrderModel>(result);
            var ltsaOrder = Assert.IsAssignableFrom<LtsaOrderModel>(actionResult);

            // Assert
            result.Should().NotBeNull();
            //  result.Should().BeEquivalentTo(expectedOrder);
        }
        #endregion
        #region
        [Fact]
        public async void CreateOrderAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new LtsaOptions()
            {
                AuthUrl = "https://test.com",
                HostUri = "https://host.com/",
                IntegratorPassword = "password",
                IntegratorUsername = "username",
                UserName = "user",
                UserPassword = "password"
            });
            var service = helper.Create<LtsaService>(options, user);

            var accessToken = "testAccessToken";
            var titleNumber = "testTitleNumber";
            var landTitleDistrictCode = "testDistrictCode";

            var apiUrl = "https://host.com/orders";
            var expectedOrder = new LtsaOrderModel
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

            var headers = new HttpRequestMessage().Headers;
            headers.Add("Accept", "application/vnd.ltsa.astra.orders+json");
            headers.Add("X-Authorization", $"Bearer {accessToken}");

            var order = new
            {
                productType = "title",
                fileReference = "Test",
                productOrderParameters = new
                {
                    titleNumber,
                    landTitleDistrictCode,
                    includeCancelledInfo = false
                }
            };

            var requestBody = new
            {
                order
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<LtsaOrderModel>(apiUrl, HttpMethod.Post, It.IsAny<HttpRequestHeaders>(), It.IsAny<StringContent>(), null)).ReturnsAsync(expectedOrder);


            // Act
            var result = await service.CreateOrderAsync(accessToken, titleNumber, landTitleDistrictCode);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedOrder);
            var mock = Mock.Get(client.Object);
            var invocations = mock.Invocations;

            client.Verify(m => m.SendAsync<LtsaOrderModel>(apiUrl, HttpMethod.Post, It.IsAny<HttpRequestHeaders>(), It.IsAny<StringContent>(), null), Times.Once);
        }
        #endregion
        #region
        [Fact]
        public async void CreateOrderAsync_ExceptionThrown()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new LtsaOptions()
            {
                AuthUrl = "https://test.com",
                HostUri = "https://host.com/",
                IntegratorPassword = "password",
                IntegratorUsername = "username",
                UserName = "user",
                UserPassword = "password"
            });
            var service = helper.Create<LtsaService>(options, user);

            var accessToken = "testAccessToken";
            var titleNumber = "testTitleNumber";
            var landTitleDistrictCode = "testDistrictCode";

            var apiUrl = "https://host.com/orders";
            var headers = new HttpRequestMessage().Headers;
            headers.Add("Accept", "application/vnd.ltsa.astra.orders+json");
            headers.Add("X-Authorization", $"Bearer {accessToken}");

            var order = new
            {
                productType = "title",
                fileReference = "Test",
                productOrderParameters = new
                {
                    titleNumber,
                    landTitleDistrictCode,
                    includeCancelledInfo = false
                }
            };

            var requestBody = new
            {
                order
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Post, "https://host.com/orders")
            };

            var client = helper.GetService<Mock<IHttpRequestClient>>();

            // Set up the SendAsync method to throw a HttpRequestException
            client.Setup(m => m.SendAsync<LtsaOrderModel>(apiUrl, HttpMethod.Post, It.IsAny<HttpRequestHeaders>(), It.IsAny<StringContent>(), null))
                .ThrowsAsync(new HttpClientRequestException(response));
            client.Setup(m => m.DeserializeAsync<ErrorResponseModel>(It.IsAny<HttpResponseMessage>())).ReturnsAsync(new ErrorResponseModel());

            // Act

            // Assert
            var result = await Assert.ThrowsAsync<LTSAApiException>(async () => await service.CreateOrderAsync(accessToken, titleNumber, landTitleDistrictCode));
            // Verify that an LTSAApiException is thrown
            Assert.IsAssignableFrom<LTSAApiException>(result);

            // Verify that the SendAsync method was called once with the expected parameters
            client.Verify(m => m.SendAsync<LtsaOrderModel>(apiUrl, HttpMethod.Post, It.IsAny<HttpRequestHeaders>(), It.IsAny<StringContent>(), null), Times.Once);
        }
        #endregion
    }
}
