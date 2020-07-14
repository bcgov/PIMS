using Pims.Api.Areas.Admin.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Api.Areas.Admin.Models.Claim;

namespace Pims.Api.Test.Routes.Admin
{
    /// <summary>
    /// ClaimControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "admin")]
    [Trait("group", "claim")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class ClaimControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public ClaimControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Claim_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(ClaimController);
            type.HasPermissions(Permissions.SystemAdmin);
            type.HasArea("admin");
            type.HasRoute("[area]/claims");
            type.HasRoute("v{version:apiVersion}/[area]/claims");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void GetClaims_Route()
        {
            // Arrange
            var endpoint = typeof(ClaimController).FindMethod(nameof(ClaimController.GetClaims), typeof(int), typeof(int), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet();
        }

        [Fact]
        public void GetClaim_Route()
        {
            // Arrange
            var endpoint = typeof(ClaimController).FindMethod(nameof(ClaimController.GetClaim), typeof(Guid));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{id}");
        }

        [Fact]
        public void AddClaim_Route()
        {
            // Arrange
            var endpoint = typeof(ClaimController).FindMethod(nameof(ClaimController.AddClaim), typeof(Model.ClaimModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost();
        }

        [Fact]
        public void UpdateClaim_Route()
        {
            // Arrange
            var endpoint = typeof(ClaimController).FindMethod(nameof(ClaimController.UpdateClaim), typeof(Guid), typeof(Model.ClaimModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("{id}");
        }

        [Fact]
        public void DeleteClaim_Route()
        {
            // Arrange
            var endpoint = typeof(ClaimController).FindMethod(nameof(ClaimController.DeleteClaim), typeof(Guid), typeof(Model.ClaimModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasDelete("{id}");
        }
        #endregion
    }
}
