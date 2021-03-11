using FluentAssertions;
using Moq;
using Pims.Core.Exceptions;
using Pims.Core.Http;
using Pims.Core.Test;
using Pims.Keycloak;
using Pims.Keycloak.Models;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using Xunit;

namespace Pims.Dal.Test.Libraries.Keycloak
{
    [Trait("category", "unit")]
    [Trait("category", "keycloak")]
    [Trait("group", "keycloak")]
    public partial class KeycloakServiceGroupsTest
    {
        #region Tests
        #region GetGroupCountAsync
        [Fact]
        public async void GetGroupCountAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{\"Count\":1}")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            var result = await service.GetGroupCountAsync();

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/groups/count"), Times.Once());
            result.Should().Be(1);
        }

        [Fact]
        public async void GetGroupCountAsync_Failed()
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
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetGroupCountAsync());

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/groups/count"), Times.Once());
        }
        #endregion

        #region GetGroupsAsync
        [Fact]
        public async void GetGroupsAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var groups = new[] {
                new GroupModel()
                {
                    Id = Guid.NewGuid(),
                    Name = "name",
                    Path = "path",
                    Attributes = new System.Collections.Generic.Dictionary<string, string[]>()
                    {
                        { "attr1", new [] { "attribute" } }
                    },
                    ClientRoles = new System.Collections.Generic.Dictionary<string, string[]>()
                    {
                        { "attr1", new [] { "clientRole" } }
                    },
                    RealmRoles = new[] { "role" }
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(groups))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var first = 1;
            var max = 10;
            var search = "search";

            // Act
            var result = await service.GetGroupsAsync(first, max, search);

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/groups?first={first}&max={max}&search={search}"), Times.Once());
            result.Should().HaveCount(1);
            result.First().Id.Should().Be(groups.First().Id);
            result.First().Name.Should().Be(groups.First().Name);
            result.First().Path.Should().Be(groups.First().Path);
        }

        [Fact]
        public async void GetGroupsAsync_Failed()
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
            var first = 1;
            var max = 10;
            var search = "search";

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetGroupsAsync(first, max, search));

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/groups?first={first}&max={max}&search={search}"), Times.Once());
        }
        #endregion

        #region GetGroupAsync
        [Fact]
        public async void GetGroupAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var group = new GroupModel()
            {
                Id = Guid.NewGuid(),
                Name = "name",
                Path = "path",
                Attributes = new System.Collections.Generic.Dictionary<string, string[]>()
                {
                    { "attr1", new [] { "attribute" } }
                },
                ClientRoles = new System.Collections.Generic.Dictionary<string, string[]>()
                {
                    { "attr1", new [] { "clientRole" } }
                },
                RealmRoles = new[] { "role" }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(group))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            var result = await service.GetGroupAsync(group.Id);

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/groups/{group.Id}"), Times.Once());
            result.Id.Should().Be(group.Id);
            result.Name.Should().Be(group.Name);
            result.Path.Should().Be(group.Path);
        }

        [Fact]
        public async void GetGroupAsync_Failed()
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
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetGroupAsync(id));

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/groups/{id}"), Times.Once());
        }
        #endregion

        #region CreateGroupAsync
        [Fact]
        public async void CreateGroupAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var group = new GroupModel()
            {
                Id = Guid.NewGuid(),
                Name = "name",
                Path = "path",
                Attributes = new System.Collections.Generic.Dictionary<string, string[]>()
                {
                    { "attr1", new [] { "attribute" } }
                },
                ClientRoles = new System.Collections.Generic.Dictionary<string, string[]>()
                {
                    { "attr1", new [] { "clientRole" } }
                },
                RealmRoles = new[] { "role" }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PostAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(group))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            var result = await service.CreateGroupAsync(group);

            // Assert
            openIdConnect.Verify(m => m.PostAsync($"{options.Value.Admin.Authority}/groups", It.IsAny<HttpContent>()), Times.Once());
            result.Id.Should().Be(group.Id);
            result.Name.Should().Be(group.Name);
            result.Path.Should().Be(group.Path);
        }

        [Fact]
        public async void CreateGroupAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PostAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.CreateGroupAsync(new GroupModel()));

            // Assert
            openIdConnect.Verify(m => m.PostAsync($"{options.Value.Admin.Authority}/groups", It.IsAny<HttpContent>()), Times.Once());
        }
        #endregion

        #region CreateSubGroupAsync
        [Fact]
        public async void CreateSubGroupAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var group = new GroupModel()
            {
                Id = Guid.NewGuid(),
                Name = "name",
                Path = "path",
                Attributes = new System.Collections.Generic.Dictionary<string, string[]>()
                {
                    { "attr1", new [] { "attribute" } }
                },
                ClientRoles = new System.Collections.Generic.Dictionary<string, string[]>()
                {
                    { "attr1", new [] { "clientRole" } }
                },
                RealmRoles = new[] { "role" }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PostAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(group))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            var result = await service.CreateSubGroupAsync(parentId, group);

            // Assert
            openIdConnect.Verify(m => m.PostAsync($"{options.Value.Admin.Authority}/groups/{parentId}/children", It.IsAny<HttpContent>()), Times.Once());
            result.Id.Should().Be(group.Id);
            result.Name.Should().Be(group.Name);
            result.Path.Should().Be(group.Path);
        }

        [Fact]
        public async void CreateSubGroupAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PostAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var parentId = Guid.NewGuid();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.CreateSubGroupAsync(parentId, new GroupModel()));

            // Assert
            openIdConnect.Verify(m => m.PostAsync($"{options.Value.Admin.Authority}/groups/{parentId}/children", It.IsAny<HttpContent>()), Times.Once());
        }
        #endregion

        #region UpdateGroupAsync
        [Fact]
        public async void UpdateGroupAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var group = new GroupModel()
            {
                Id = Guid.NewGuid(),
                Name = "name",
                Path = "path",
                Attributes = new System.Collections.Generic.Dictionary<string, string[]>()
                {
                    { "attr1", new [] { "attribute" } }
                },
                ClientRoles = new System.Collections.Generic.Dictionary<string, string[]>()
                {
                    { "attr1", new [] { "clientRole" } }
                },
                RealmRoles = new[] { "role" }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PutAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(group))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            var result = await service.UpdateGroupAsync(group);

            // Assert
            openIdConnect.Verify(m => m.PutAsync($"{options.Value.Admin.Authority}/groups/{group.Id}", It.IsAny<HttpContent>()), Times.Once());
            result.Id.Should().Be(group.Id);
            result.Name.Should().Be(group.Name);
            result.Path.Should().Be(group.Path);
        }

        [Fact]
        public async void UpdateGroupAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.PutAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var group = new GroupModel()
            {
                Id = Guid.NewGuid()
            };

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.UpdateGroupAsync(group));

            // Assert
            openIdConnect.Verify(m => m.PutAsync($"{options.Value.Admin.Authority}/groups/{group.Id}", It.IsAny<HttpContent>()), Times.Once());
        }
        #endregion

        #region DeleteGroupAsync
        [Fact]
        public async void DeleteGroupAsync_Success()
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
            var result = await service.DeleteGroupAsync(id);

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/groups/{id}", null), Times.Once());
            result.Should().Be(id);
        }

        [Fact]
        public async void DeleteGroupAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Get, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var id = Guid.NewGuid();

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.DeleteGroupAsync(id));

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/groups/{id}", null), Times.Once());
        }
        #endregion

        #region GetGroupMembersAsync
        [Fact]
        public async void GetGroupMembersAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var users = new[] {
                new UserModel()
                {
                    Id = Guid.NewGuid(),
                    Email = "email",
                    EmailVerified = false,
                    Enabled = true,
                    FirstName = "first",
                    LastName = "last",
                    Username = "user",
                    Attributes = new System.Collections.Generic.Dictionary<string, string[]>()
                    {
                        { "attr1", new [] { "attribute" } }
                    },
                    RealmRoles = new[] { "role" },
                    Groups = new[] { "group" },
                }
            };

            var options = helper.CreateDefaultKeycloakOptions();
            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.GetAsync(It.IsAny<string>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(users))
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();
            var id = Guid.NewGuid();
            var first = 1;
            var max = 10;

            // Act
            var result = await service.GetGroupMembersAsync(id, first, max);

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/groups/{id}/members?first={first}&max={max}"), Times.Once());
            result.Should().HaveCount(1);
            result.First().Id.Should().Be(users.First().Id);
            result.First().Email.Should().Be(users.First().Email);
            result.First().EmailVerified.Should().Be(users.First().EmailVerified);
            result.First().Enabled.Should().Be(users.First().Enabled);
            result.First().FirstName.Should().Be(users.First().FirstName);
            result.First().LastName.Should().Be(users.First().LastName);
            result.First().Username.Should().Be(users.First().Username);
        }

        [Fact]
        public async void GetGroupMembersAsync_Failed()
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
            var first = 1;
            var max = 10;

            // Act
            await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.GetGroupMembersAsync(id, first, max));

            // Assert
            openIdConnect.Verify(m => m.GetAsync($"{options.Value.Admin.Authority}/groups/{id}/members?first={first}&max={max}"), Times.Once());
        }
        #endregion
        #endregion
    }
}
