using FluentAssertions;
using Microsoft.Extensions.Options;
using Moq;
using Pims.Core.Exceptions;
using Pims.Core.Http;
using Pims.Core.Test;
using Pims.Keycloak;
using Pims.Keycloak.Configuration;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Net.Http;
using Xunit;

namespace Pims.Dal.Test.Libraries.Ches
{
    [Trait("category", "unit")]
    [Trait("category", "keycloak")]
    [Trait("group", "keycloak")]
    [ExcludeFromCodeCoverage]
    public partial class KeycloakServiceTest
    {
        #region Tests
        #region CreateKeycloakService
        [Fact]
        public void CreateKeycloakService_NoAuthority()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new KeycloakOptions());

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            // Act
            // Assert
            var result = Assert.Throws<ConfigurationException>(() => helper.Create<KeycloakService>(options, user));
            result.Message.Should().Be("The configuration for Keycloak:Authority is invalid or missing.");
        }

        [Fact]
        public void CreateKeycloakService_NoAudience()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new KeycloakOptions()
            {
                Authority = "https://keycloak",
            });

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            // Act
            // Assert
            var result = Assert.Throws<ConfigurationException>(() => helper.Create<KeycloakService>(options, user));
            result.Message.Should().Be("The configuration for Keycloak:Audience is invalid or missing.");
        }

        [Fact]
        public void CreateKeycloakService_NoClient()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new KeycloakOptions()
            {
                Authority = "https://keycloak",
                Audience = "pims",
            });

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            // Act
            // Assert
            var result = Assert.Throws<ConfigurationException>(() => helper.Create<KeycloakService>(options, user));
            result.Message.Should().Be("The configuration for Keycloak:Client is invalid or missing.");
        }

        [Fact]
        public void CreateKeycloakService_NoAdminAuthority()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new KeycloakOptions()
            {
                Authority = "https://keycloak",
                Audience = "pims",
                Client = "pims",
                Admin = new KeycloakAdminOptions()
            });

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            // Act
            // Assert
            var result = Assert.Throws<ConfigurationException>(() => helper.Create<KeycloakService>(options, user));
            result.Message.Should().Be("The configuration for Keycloak:Admin:Authority is invalid or missing.");
        }

        [Fact]
        public void CreateKeycloakService_NoAdminUsers()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new KeycloakOptions()
            {
                Authority = "https://keycloak",
                Audience = "pims",
                Client = "pims",
                Admin = new KeycloakAdminOptions()
                {
                    Authority = "https://keycloak/admin"
                }
            });

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            // Act
            // Assert
            var result = Assert.Throws<ConfigurationException>(() => helper.Create<KeycloakService>(options, user));
            result.Message.Should().Be("The configuration for Keycloak:Admin:Users is invalid or missing.");
        }

        [Fact]
        public void CreateKeycloakService_NoOpenIdConnectToken()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new KeycloakOptions()
            {
                Authority = "https://keycloak",
                Audience = "pims",
                Client = "pims",
                Admin = new KeycloakAdminOptions()
                {
                    Authority = "https://keycloak/admin",
                    Users = "/users"
                },
                OpenIdConnect = new Pims.Core.Http.Configuration.OpenIdConnectOptions(),
            });

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            // Act
            // Assert
            var result = Assert.Throws<ConfigurationException>(() => helper.Create<KeycloakService>(options, user));
            result.Message.Should().Be("The configuration for Keycloak:OpenIdConnect:Token is invalid or missing.");
        }

        [Fact]
        public void CreateKeycloakService_NoOpenIdConnectUserInfo()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new KeycloakOptions()
            {
                Authority = "https://keycloak",
                Audience = "pims",
                Client = "pims",
                Admin = new KeycloakAdminOptions()
                {
                    Authority = "https://keycloak/admin",
                    Users = "/users"
                },
                OpenIdConnect = new Pims.Core.Http.Configuration.OpenIdConnectOptions()
                {
                    Token = "/protocol/openid-connect/token",
                },
            });

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            // Act
            // Assert
            var result = Assert.Throws<ConfigurationException>(() => helper.Create<KeycloakService>(options, user));
            result.Message.Should().Be("The configuration for Keycloak:OpenIdConnect:UserInfo is invalid or missing.");
        }

        [Fact]
        public void CreateKeycloakService_NoServiceAccountClient()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new KeycloakOptions()
            {
                Authority = "https://keycloak",
                Audience = "pims",
                Client = "pims",
                Admin = new KeycloakAdminOptions()
                {
                    Authority = "https://keycloak/admin",
                    Users = "/users"
                },
                OpenIdConnect = new Pims.Core.Http.Configuration.OpenIdConnectOptions()
                {
                    Token = "/protocol/openid-connect/token",
                    UserInfo = "/protocol/openid-connect/userinfo"
                },
                ServiceAccount = new KeycloakServiceAccountOptions()
            });

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            // Act
            // Assert
            var result = Assert.Throws<ConfigurationException>(() => helper.Create<KeycloakService>(options, user));
            result.Message.Should().Be("The configuration for Keycloak:ServiceAccount:Client is invalid or missing.");
        }

        [Fact]
        public void CreateKeycloakService_NoServiceAccountSecret()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new KeycloakOptions()
            {
                Authority = "https://keycloak",
                Audience = "pims",
                Client = "pims",
                Admin = new KeycloakAdminOptions()
                {
                    Authority = "https://keycloak/admin",
                    Users = "/users"
                },
                OpenIdConnect = new Pims.Core.Http.Configuration.OpenIdConnectOptions()
                {
                    Token = "/protocol/openid-connect/token",
                    UserInfo = "/protocol/openid-connect/userinfo"
                },
                ServiceAccount = new KeycloakServiceAccountOptions()
                {
                    Client = "pims-service-account"
                }
            });

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            // Act
            // Assert
            var result = Assert.Throws<ConfigurationException>(() => helper.Create<KeycloakService>(options, user));
            result.Message.Should().Be("The configuration for Keycloak:ServiceAccount:Secret is invalid or missing.");
        }

        [Fact]
        public void CreateKeycloakService()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new KeycloakOptions()
            {
                Authority = "https://keycloak",
                Audience = "pims",
                Client = "pims",
                Admin = new KeycloakAdminOptions()
                {
                    Authority = "https://keycloak/admin",
                    Users = "/users"
                },
                OpenIdConnect = new Pims.Core.Http.Configuration.OpenIdConnectOptions()
                {
                    Token = "/protocol/openid-connect/token",
                    UserInfo = "/protocol/openid-connect/userinfo"
                },
                ServiceAccount = new KeycloakServiceAccountOptions()
                {
                    Client = "pims-service-account",
                    Secret = "[USE SECRETS]",
                }
            });

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            // Act
            var service = helper.Create<KeycloakService>(options, user);

            // Assert
            openIdConnect.Object.AuthClientOptions.Audience.Should().Be(options.Value.Audience);
            openIdConnect.Object.AuthClientOptions.Authority.Should().Be(options.Value.Authority);
            openIdConnect.Object.AuthClientOptions.Client.Should().Be(options.Value.ServiceAccount.Client);
            openIdConnect.Object.AuthClientOptions.Secret.Should().Be(options.Value.ServiceAccount.Secret);
        }

        [Fact]
        public void CreateKeycloakService_ServiceAccount()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new KeycloakOptions()
            {
                Authority = "https://keycloak",
                Audience = "pims",
                Client = "pims",
                Admin = new KeycloakAdminOptions()
                {
                    Authority = "https://keycloak/admin",
                    Users = "/users"
                },
                OpenIdConnect = new Pims.Core.Http.Configuration.OpenIdConnectOptions()
                {
                    Token = "/protocol/openid-connect/token",
                    UserInfo = "/protocol/openid-connect/userinfo"
                },
                ServiceAccount = new KeycloakServiceAccountOptions()
                {
                    Authority = "https://serviceaccount",
                    Audience = "serviceaccount",
                    Client = "pims-service-account",
                    Secret = "[USE SECRETS]",
                }
            });

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));
            helper.AddSingleton(openIdConnect.Object);

            // Act
            var service = helper.Create<KeycloakService>(options, user);

            // Assert
            openIdConnect.Object.AuthClientOptions.Audience.Should().Be(options.Value.ServiceAccount.Audience);
            openIdConnect.Object.AuthClientOptions.Authority.Should().Be(options.Value.ServiceAccount.Authority);
            openIdConnect.Object.AuthClientOptions.Client.Should().Be(options.Value.ServiceAccount.Client);
            openIdConnect.Object.AuthClientOptions.Secret.Should().Be(options.Value.ServiceAccount.Secret);
        }
        #endregion

        #region DeleteAttackDetectionAsync
        [Fact]
        public async void DeleteAttackDetectionAsync_Success()
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

            // Act
            await service.DeleteAttackDetectionAsync();

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/attack-detection/brute-force/users", null), Times.Once());
        }

        [Fact]
        public async void DeleteAttackDetectionAsync_Failed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = helper.CreateDefaultKeycloakOptions();

            var openIdConnect = new Mock<IOpenIdConnectRequestClient>();
            openIdConnect.Setup(m => m.AuthClientOptions).Returns(new Pims.Core.Http.Configuration.AuthClientOptions());
            openIdConnect.Setup(m => m.DeleteAsync(It.IsAny<string>(), It.IsAny<HttpContent>())).ReturnsAsync(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Delete, "http://keycloak")
            });
            helper.AddSingleton(openIdConnect.Object);

            var service = helper.Create<KeycloakService>();

            // Act
            var result = await Assert.ThrowsAsync<HttpClientRequestException>(async () => await service.DeleteAttackDetectionAsync());

            // Assert
            openIdConnect.Verify(m => m.DeleteAsync($"{options.Value.Admin.Authority}/attack-detection/brute-force/users", null), Times.Once());
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        #endregion
        #endregion
    }
}
