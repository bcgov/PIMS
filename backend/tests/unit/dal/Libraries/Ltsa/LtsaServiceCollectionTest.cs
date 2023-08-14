using FluentAssertions;
using Pims.Core.Http;
using Pims.Core.Test;
using Moq;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Microsoft.Extensions.Options;
using Pims.Ltsa.Configuration;
using Pims.Ltsa;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Text;

namespace Pims.Dal.Test.Libraries.Ltsa
{
    [Trait("category", "unit")]
    [Trait("category", "ltsa")]
    [Trait("group", "notification")]
    [ExcludeFromCodeCoverage]
    public class LtsaServiceCollectionTest
    {
        public IConfiguration Configuration { get; }

        #region Tests
        #region LtsaServiceCollection
        [Fact]
        public void LtsaServiceCollection_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            helper.AddSingleton(user);

            var builder = new ConfigurationBuilder();
            var options = new LtsaOptions()
            {
                AuthUrl = "https://test.com",
                HostUri = "https://host.com",
                IntegratorPassword = "password",
                IntegratorUsername = "username",
                UserName = "user",
                UserPassword = "password"
            };
            var ltsaJson = JsonSerializer.Serialize(new { Ltsa = options });
            IConfigurationRoot ltsaConfig;
            using (var io = new MemoryStream(Encoding.UTF8.GetBytes(ltsaJson)))
            {
                builder.AddJsonStream(io);
                ltsaConfig = builder.Build();
            }

            var mockClientFactory = new Mock<IHttpClientFactory>();
            var mockIOptionsMonitor = new Mock<IOptionsMonitor<JsonSerializerOptions>>();
            var mockIlogger = new Mock<ILogger<HttpRequestClient>>();
            var mockILtsaService = new Mock<ILogger<ILtsaService>>();

            helper.AddSingleton(mockClientFactory.Object);
            helper.AddSingleton(mockIOptionsMonitor.Object);
            helper.AddSingleton(mockIlogger.Object);
            helper.AddSingleton(mockILtsaService.Object);

            // Act
            _ = helper.Services.AddLtsaService(section: ltsaConfig.GetSection("Ltsa"));

            var ltsaOptions = helper.GetService<IOptions<LtsaOptions>>();
            var ltsaService = helper.GetService<ILtsaService>();
            var httpRequestClient = helper.GetService<IHttpRequestClient>();
            var jwtSecurityTokenHandler = helper.GetService<JwtSecurityTokenHandler>();

            // Assert
            Assert.NotNull(ltsaService);
            Assert.NotNull(httpRequestClient);
            Assert.NotNull(jwtSecurityTokenHandler);
            Assert.NotNull(ltsaOptions);

            ltsaOptions.Value.AuthUrl.Should().Be(options.AuthUrl);
            ltsaOptions.Value.HostUri.Should().Be(options.HostUri);
            ltsaOptions.Value.IntegratorPassword.Should().Be(options.IntegratorPassword);
            ltsaOptions.Value.IntegratorUsername.Should().Be(options.IntegratorUsername);
            ltsaOptions.Value.UserName.Should().Be(options.UserName);
            ltsaOptions.Value.UserPassword.Should().Be(options.UserPassword);

        }
        #endregion
        #endregion
    }
}
