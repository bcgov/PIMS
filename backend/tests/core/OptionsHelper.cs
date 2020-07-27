using Microsoft.Extensions.Options;
using Moq;
using Pims.Keycloak.Configuration;

namespace Pims.Core.Test
{
    /// <summary>
    /// OptionsHelper static class, provides helpers to generate default options.
    /// </summary>
    public static class OptionsHelper
    {
        /// <summary>
        /// Creates default CreateDefaultKeycloakOptions options.
        /// </summary>
        /// <returns></returns>
        public static KeycloakOptions CreateDefaultKeycloakOptions()
        {
            return new KeycloakOptions()
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
                    Login = "/protocol/openid-connect/auth",
                    Logout = "/protocol/openid-connect/logout",
                    Register = "/protocol/openid-connect/registrations",
                    Token = "/protocol/openid-connect/token",
                    TokenIntrospect = "/protocol/openid-connect/token/introspect",
                    UserInfo = "/protocol/openid-connect/userinfo"
                },
                ServiceAccount = new KeycloakServiceAccountOptions()
                {
                    Audience = "pims-service-account",
                    Secret = "[USE SECRETS]",
                    Client = "pims-service-account"
                }
            };
        }

        /// <summary>
        /// Creates default CreateDefaultKeycloakOptions options and adds them to the helper service.
        /// </summary>
        /// <param name="helper"></param>
        /// <returns></returns>
        public static IOptions<KeycloakOptions> CreateDefaultKeycloakOptions(this TestHelper helper)
        {
            var options = Options.Create(CreateDefaultKeycloakOptions());
            helper.AddSingleton(options);
            return options;
        }

        /// <summary>
        /// Creates default CreateDefaultKeycloakOptions options and adds them to the helper service.
        /// </summary>
        /// <param name="helper"></param>
        /// <returns></returns>
        public static IOptionsMonitor<KeycloakOptions> CreateDefaultKeycloakOptionsMonitor(this TestHelper helper)
        {
            var monitor = new Mock<IOptionsMonitor<KeycloakOptions>>();
            monitor.Setup(m => m.CurrentValue).Returns(CreateDefaultKeycloakOptions());
            helper.AddSingleton(monitor);
            helper.AddSingleton(monitor.Object);
            return monitor.Object;
        }
    }
}
