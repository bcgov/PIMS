using FluentAssertions;
using Moq;
using Pims.Core.Exceptions;
using Pims.Core.Http;
using Pims.Core.Test;
using Pims.Keycloak;
using Pims.Keycloak.Models;
using System;
using System.Net;
using System.Net.Http;
using Xunit;

namespace Pims.Dal.Test.Libraries.Ches
{
    [Trait("category", "unit")]
    [Trait("category", "keycloak")]
    [Trait("group", "keycloak")]
    public partial class KeycloakServiceTest
    {
        #region Tests
        #region ById
        #region GetRoleAsync
        [Fact]
        public async void GetRoleAsync_ById_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var role = new RoleModel()
            {
                Id = Guid.NewGuid()
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(role))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var id = Guid.NewGuid();

            // Act
            var result = await service.GetRoleAsync(id);

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles-by-id/{id}"), Times.Once());
            result.Id.Should().Be(role.Id);
        }

        [Fact]
        public async void GetRoleAsync_ById_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var id = Guid.NewGuid();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetRoleAsync(id));

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles-by-id/{id}"), Times.Once());
        }
        #endregion

        #region UpdateRoleAsync
        [Fact]
        public async void UpdateRoleAsync_ById_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var role = new RoleModel()
            {
                Id = Guid.NewGuid()
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PutAsync(It.IsAny<string>(), It.IsAny<StringContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(role))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            var result = await service.UpdateRoleAsync(role);

            // Assert
            openIdConnect.Verify(m => m.PutAsync($"{options.Value.Admin.Authority}/roles-by-id/{role.Id}", It.IsAny<StringContent>()), Times.Once());
            result.Id.Should().Be(role.Id);
        }

        [Fact]
        public async void UpdateRoleAsync_ById_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var role = new RoleModel()
            {
                Id = Guid.NewGuid()
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PutAsync(It.IsAny<string>(), It.IsAny<StringContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.UpdateRoleAsync(role));

            // Assert
            openIdConnect.Verify(m => m.PutAsync($"{options.Value.Admin.Authority}/roles-by-id/{role.Id}", It.IsAny<StringContent>()), Times.Once());
        }
        #endregion

        #region DeleteRoleAsync
        [Fact]
        public async void DeleteRoleAsync_ById_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var id = Guid.NewGuid();

            // Act
            var result = await service.DeleteRoleAsync(id);

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/roles-by-id/{id}", null), Times.Once());
        }

        [Fact]
        public async void DeleteRoleAsync_ById_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<StringContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var id = Guid.NewGuid();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.DeleteRoleAsync(id));

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/roles-by-id/{id}", null), Times.Once());
        }
        #endregion

        #region CreateCompositeRolesAsync
        [Fact]
        public async void CreateCompositeRolesAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PostAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(roles))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            var result = await service.CreateCompositeRolesAsync(parentId, roles);

            // Assert
            openIdConnect.Verify(m => m.PostAsync($"{options.Value.Admin.Authority}/roles-by-id/{parentId}/composites", It.IsAny<HttpContent>()), Times.Once());
        }

        [Fact]
        public async void CreateCompositeRolesAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PostAsync(It.IsAny<string>(), It.IsAny<StringContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.CreateCompositeRolesAsync(parentId, roles));

            // Assert
            openIdConnect.Verify(m => m.PostAsync($"{options.Value.Admin.Authority}/roles-by-id/{parentId}/composites", It.IsAny<HttpContent>()), Times.Once());
        }
        #endregion

        #region GetCompositeRolesAsync
        [Fact]
        public async void GetCompositeRolesAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(roles))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            var result = await service.GetCompositeRolesAsync(parentId);

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles-by-id/{parentId}/composites"), Times.Once());
        }

        [Fact]
        public async void GetCompositeRolesAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetCompositeRolesAsync(parentId));

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles-by-id/{parentId}/composites"), Times.Once());
        }
        #endregion

        #region DeleteCompositeRolesAsync
        [Fact]
        public async void DeleteCompositeRolesAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(roles))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            var result = await service.DeleteCompositeRolesAsync(parentId, roles);

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/roles-by-id/{parentId}/composites", It.IsAny<HttpContent>()), Times.Once());
        }

        [Fact]
        public async void DeleteCompositeRolesAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<StringContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.DeleteCompositeRolesAsync(parentId, roles));

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/roles-by-id/{parentId}/composites", It.IsAny<HttpContent>()), Times.Once());
        }
        #endregion

        #region GetClientCompositeRolesAsync
        [Fact]
        public async void GetClientCompositeRolesAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(roles))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();
            var clientName = "client";

            // Act
            var result = await service.GetClientCompositeRolesAsync(parentId, clientName);

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles-by-id/{parentId}/composites/clients/{clientName}"), Times.Once());
        }

        [Fact]
        public async void GetClientCompositeRolesAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();
            var clientName = "client";

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetClientCompositeRolesAsync(parentId, clientName));

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles-by-id/{parentId}/composites/clients/{clientName}"), Times.Once());
        }
        #endregion

        #region GetRealmCompositeRolesAsync
        [Fact]
        public async void GetRealmCompositeRolesAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(roles))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            var result = await service.GetRealmCompositeRolesAsync(parentId);

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles-by-id/{parentId}/composites/realm"), Times.Once());
        }

        [Fact]
        public async void GetRealmCompositeRolesAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetRealmCompositeRolesAsync(parentId));

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles-by-id/{parentId}/composites/realm"), Times.Once());
        }
        #endregion
        #endregion

        #region Realm
        #region GetRolesAsync
        [Fact]
        public async void GetRolesAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(roles))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            var result = await service.GetRolesAsync();

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles"), Times.Once());
        }

        [Fact]
        public async void GetRolesAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetRolesAsync());

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles"), Times.Once());
        }
        #endregion

        #region GetRoleAsync
        [Fact]
        public async void GetRoleAsync_ByName_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var role = new RoleModel()
            {
                Id = Guid.NewGuid(),
                Name = "name",
                Description = "description",
                Composite = false,
                ContainerId = "container"
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(role))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            var result = await service.GetRoleAsync(role.Name);

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles/{role.Name}"), Times.Once());
        }

        [Fact]
        public async void GetRoleAsync_ByName_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var name = "name";

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetRoleAsync(name));

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles/{name}"), Times.Once());
        }
        #endregion

        #region CreateRoleAsync
        [Fact]
        public async void CreateRoleAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var role = new RoleModel()
            {
                Id = Guid.NewGuid()
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PostAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(role))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            var result = await service.CreateRoleAsync(role);

            // Assert
            openIdConnect.Verify(m => m.PostAsync($"{options.Value.Admin.Authority}/roles", It.IsAny<HttpContent>()), Times.Once());
        }

        [Fact]
        public async void CreateRoleAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var role = new RoleModel()
            {
                Id = Guid.NewGuid()
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PostAsync(It.IsAny<string>(), It.IsAny<StringContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.CreateRoleAsync(role));

            // Assert
            openIdConnect.Verify(m => m.PostAsync($"{options.Value.Admin.Authority}/roles", It.IsAny<HttpContent>()), Times.Once());
        }
        #endregion

        #region UpdateRoleAsync
        [Fact]
        public async void UpdateRoleAsync_ByName_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var role = new RoleModel()
            {
                Id = Guid.NewGuid(),
                Name = "name"
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PutAsync(It.IsAny<string>(), It.IsAny<StringContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(role))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            var result = await service.UpdateRoleAsync(role.Name, role);

            // Assert
            openIdConnect.Verify(m => m.PutAsync($"{options.Value.Admin.Authority}/roles/{role.Name}", It.IsAny<StringContent>()), Times.Once());
            result.Id.Should().Be(role.Id);
        }

        [Fact]
        public async void UpdateRoleAsync_ByName_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var role = new RoleModel()
            {
                Id = Guid.NewGuid(),
                Name = "name"
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PutAsync(It.IsAny<string>(), It.IsAny<StringContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.UpdateRoleAsync(role.Name, role));

            // Assert
            openIdConnect.Verify(m => m.PutAsync($"{options.Value.Admin.Authority}/roles/{role.Name}", It.IsAny<StringContent>()), Times.Once());
        }
        #endregion

        #region DeleteRoleAsync
        [Fact]
        public async void DeleteRoleAsync_ByName_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var name = "name";

            // Act
            var result = await service.DeleteRoleAsync(name);

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/roles/{name}", null), Times.Once());
        }

        [Fact]
        public async void DeleteRoleAsync_ByName_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<StringContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var name = "name";

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.DeleteRoleAsync(name));

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/roles/{name}", null), Times.Once());
        }
        #endregion

        #region CreateCompositeRoleAsync
        [Fact]
        public async void CreateCompositeRoleAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var role = new RoleModel()
            {
                Id = Guid.NewGuid()
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PostAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(role))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentName = "name";

            // Act
            var result = await service.CreateCompositeRoleAsync(parentName, role);

            // Assert
            openIdConnect.Verify(m => m.PostAsync($"{options.Value.Admin.Authority}/roles/{parentName}/composites", It.IsAny<HttpContent>()), Times.Once());
        }

        [Fact]
        public async void CreateCompositeRoleAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var role = new RoleModel()
            {
                Id = Guid.NewGuid()
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PostAsync(It.IsAny<string>(), It.IsAny<StringContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentName = "name";

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.CreateCompositeRoleAsync(parentName, role));

            // Assert
            openIdConnect.Verify(m => m.PostAsync($"{options.Value.Admin.Authority}/roles/{parentName}/composites", It.IsAny<HttpContent>()), Times.Once());
        }
        #endregion

        #region DeleteCompositeRolesAsync
        [Fact]
        public async void DeleteCompositeRolesAsync_ByName_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(roles))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentName = "name";

            // Act
            var result = await service.DeleteCompositeRolesAsync(parentName, roles);

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/roles/{parentName}/composites", It.IsAny<HttpContent>()), Times.Once());
        }

        [Fact]
        public async void DeleteCompositeRolesAsync_ByName_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<StringContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentName = "name";

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.DeleteCompositeRolesAsync(parentName, roles));

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/roles/{parentName}/composites", It.IsAny<HttpContent>()), Times.Once());
        }
        #endregion

        #region GetClientCompositeRolesAsync
        [Fact]
        public async void GetClientCompositeRolesAsync_ByName_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(roles))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentName = "name";
            var clientName = "client";

            // Act
            var result = await service.GetClientCompositeRolesAsync(parentName, clientName);

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles/{parentName}/composites/clients/{clientName}"), Times.Once());
        }

        [Fact]
        public async void GetClientCompositeRolesAsync_ByName_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentName = "name";
            var clientName = "client";

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetClientCompositeRolesAsync(parentName, clientName));

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles/{parentName}/composites/clients/{clientName}"), Times.Once());
        }
        #endregion

        #region GetRealmCompositeRolesAsync
        [Fact]
        public async void GetRealmCompositeRolesAsync_ByName_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(roles))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentName = "name";

            // Act
            var result = await service.GetRealmCompositeRolesAsync(parentName);

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles/{parentName}/composites/realm"), Times.Once());
        }

        [Fact]
        public async void GetRealmCompositeRolesAsync_ByName_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentName = "name";

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetRealmCompositeRolesAsync(parentName));

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles/{parentName}/composites/realm"), Times.Once());
        }
        #endregion

        #region GetRoleMembersAsync
        [Fact]
        public async void GetRoleMembersAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var roles = new[]
            {
                new RoleModel()
                {
                    Id = Guid.NewGuid()
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(roles))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var name = "name";
            var first = 1;
            var max = 10;

            // Act
            var result = await service.GetRoleMembersAsync(name, first, max);

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles/{name}/users?first={first}&max={max}"), Times.Once());
        }

        [Fact]
        public async void GetRoleMembersAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var name = "name";
            var first = 1;
            var max = 10;

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetRoleMembersAsync(name, first, max));

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/roles/{name}/users?first={first}&max={max}"), Times.Once());
        }
        #endregion
        #endregion
        #endregion
    }
}
