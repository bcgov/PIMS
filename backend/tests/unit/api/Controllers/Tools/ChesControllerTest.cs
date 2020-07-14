using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Tools.Controllers;
using Pims.Ches;
using Pims.Core.Test;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Ches.Models;

namespace Pims.Api.Test.Controllers.Tools
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "tools")]
    [Trait("group", "geocoder")]
    [ExcludeFromCodeCoverage]
    public class ChesControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public ChesControllerTest() { }
        #endregion

        #region Tests
        #region GetStatusAsync
        [Fact]
        public async void GetStatusAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ChesController>(Permissions.PropertyEdit);

            var response = new Model.StatusResponseModel()
            {
                TransactionId = Guid.NewGuid(),
                MessageId = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                Status = "pending",
                SendOn = DateTime.UtcNow
            };

            var service = helper.GetService<Mock<IChesService>>();
            service.Setup(m => m.GetStatusAsync(It.IsAny<Guid>())).ReturnsAsync(response);

            // Act
            var result = await controller.GetStatusAsync(response.MessageId);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var results = Assert.IsAssignableFrom<Model.StatusResponseModel>(actionResult.Value);
        }

        [Fact]
        public async void GetStatusAsync_Post_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ChesController>(Permissions.PropertyEdit);

            var filter = new Model.StatusModel();
            var response = new[] {
                new Model.StatusResponseModel()
                {
                    TransactionId = Guid.NewGuid(),
                    MessageId = Guid.NewGuid(),
                    CreatedOn = DateTime.UtcNow,
                    Status = "pending",
                    SendOn = DateTime.UtcNow
                }
            };

            var service = helper.GetService<Mock<IChesService>>();
            service.Setup(m => m.GetStatusAsync(It.IsAny<Model.StatusModel>())).ReturnsAsync(response);

            // Act
            var result = await controller.GetStatusAsync(filter);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var results = Assert.IsAssignableFrom<IEnumerable<Model.StatusResponseModel>>(actionResult.Value);
        }
        #endregion

        #region CancelEmailAsync
        [Fact]
        public async void CancelEmailAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ChesController>(Permissions.PropertyEdit);

            var response = new Model.StatusResponseModel()
            {
                TransactionId = Guid.NewGuid(),
                MessageId = Guid.NewGuid(),
                Status = "cancelled"
            };

            var service = helper.GetService<Mock<IChesService>>();
            service.Setup(m => m.CancelEmailAsync(It.IsAny<Guid>())).ReturnsAsync(response);

            // Act
            var result = await controller.CancelEmailAsync(response.MessageId);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var results = Assert.IsAssignableFrom<Model.StatusResponseModel>(actionResult.Value);
        }

        [Fact]
        public async void CancelEmailAsync_Post_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ChesController>(Permissions.PropertyEdit);

            var filter = new Model.StatusModel();
            var response = new[] {
                new Model.StatusResponseModel()
                {
                    TransactionId = Guid.NewGuid(),
                    MessageId = Guid.NewGuid(),
                    Status = "cancelled"
                }
            };

            var service = helper.GetService<Mock<IChesService>>();
            service.Setup(m => m.CancelEmailAsync(It.IsAny<Model.StatusModel>())).ReturnsAsync(response);

            // Act
            var result = await controller.CancelEmailAsync(filter);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var results = Assert.IsAssignableFrom<IEnumerable<Model.StatusResponseModel>>(actionResult.Value);
        }
        #endregion
        #endregion
    }
}
