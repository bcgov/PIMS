using FluentAssertions;
using Microsoft.Extensions.Options;
using Moq;
using Pims.Ches;
using Pims.Ches.Configuration;
using Pims.Ches.Models;
using Pims.Core.Exceptions;
using Pims.Core.Http;
using Pims.Core.Http.Models;
using Pims.Core.Test;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using Xunit;

namespace Pims.Dal.Test.Libraries.Ches
{
    [Trait("category", "unit")]
    [Trait("category", "ches")]
    [Trait("group", "notification")]
    [ExcludeFromCodeCoverage]
    public class ChesServiceTest
    {

        #region Tests
        #region GetTokenAsync
        [Fact]
        public async void GetTokenAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com"
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel();
            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);

            var username = "test";
            var password = "password";

            // Act
            var result = await service.GetTokenAsync(username, password);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<TokenModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
        }

        [Fact]
        public async void GetTokenAsync_ChesExeption()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com"
            });
            var service = helper.Create<ChesService>(options, user);

            var response = new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                RequestMessage = new HttpRequestMessage(HttpMethod.Post, "https://test")
            };
            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ThrowsAsync(new HttpClientRequestException(response));
            client.Setup(m => m.DeserializeAsync<ErrorResponseModel>(It.IsAny<HttpResponseMessage>())).ReturnsAsync(new ErrorResponseModel());

            var username = "test";
            var password = "password";

            // Act
            // Assert
            var result = await Assert.ThrowsAsync<ChesException>(async () => await service.GetTokenAsync(username, password));

            Assert.NotNull(result);
            Assert.IsAssignableFrom<ChesException>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.DeserializeAsync<ErrorResponseModel>(It.IsAny<HttpResponseMessage>()), Times.Once());
        }
        #endregion

        #region SendEmailAsync
        [Fact]
        public async void SendEmailAsync_EmailNotEnabled()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                From = "from@test.com"
            });
            var service = helper.Create<ChesService>(options, user);

            var email = new EmailModel()
            {
                To = new[] { "remove@test.com", null },
                Cc = new[] { "remove@test.com", null },
                Bcc = new[] { "remove@test.com", null }
            };

            var client = helper.GetService<Mock<IHttpRequestClient>>();

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>()), Times.Never);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmail>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmail>(), It.IsAny<Func<HttpResponseMessage, bool>>()), Times.Never());
            email.From.Should().Be(options.Value.From);
            email.To.Should().HaveCount(1);
            email.To.Should().Contain("test@test.com");
            email.Cc.Should().BeEmpty();
            email.Bcc.Should().BeEmpty();
        }

        [Fact]
        public async void SendEmailAsync_EmailAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                HostUri = "https://host",
                EmailEnabled = true,
                EmailAuthorized = true
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailModel()
            {
                To = new[] { "keep@test.com", null },
                Cc = new[] { "keep@test.com", null },
                Bcc = new[] { "keep@test.com", null }
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmail>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmail>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmail>($"{options.Value.HostUri}/email", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.To.Should().HaveCount(1);
            email.To.Should().Contain("keep@test.com");
            email.Cc.Should().HaveCount(1);
            email.Cc.Should().Contain("keep@test.com");
            email.Bcc.Should().HaveCount(1);
            email.Bcc.Should().Contain("keep@test.com");
        }

        [Fact]
        public async void SendEmailAsync_EmailNotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                EmailEnabled = true
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailModel()
            {
                To = new[] { "remove@test.com", null },
                Cc = new[] { "remove@test.com", null },
                Bcc = new[] { "remove@test.com", null }
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmail>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmail>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmail>("/email", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.To.Should().HaveCount(1);
            email.To.Should().Contain("test@test.com");
            email.Cc.Should().BeEmpty();
            email.Bcc.Should().BeEmpty();
        }

        [Fact]
        public async void SendEmailAsync_OverrideTo()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                EmailEnabled = true,
                OverrideTo = "test.1@test.com; test.2@test.com"
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailModel()
            {
                To = new[] { "remove@test.com", null },
                Cc = new[] { "remove@test.com", null },
                Bcc = new[] { "remove@test.com", null }
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmail>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmail>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmail>("/email", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.To.Should().HaveCount(2);
            email.To.Should().Contain("test.1@test.com").And.Contain("test.2@test.com");
            email.Cc.Should().BeEmpty();
            email.Bcc.Should().BeEmpty();
        }

        [Fact]
        public async void SendEmailAsync_BccUser()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                EmailEnabled = true,
                EmailAuthorized = true,
                BccUser = true
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailModel()
            {
                To = new[] { "keep@test.com", null },
                Cc = new[] { "keep@test.com", null },
                Bcc = new[] { "keep@test.com", null }
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmail>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmail>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmail>("/email", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.To.Should().HaveCount(1);
            email.To.Should().Contain("keep@test.com");
            email.Cc.Should().HaveCount(1);
            email.Cc.Should().Contain("keep@test.com");
            email.Bcc.Should().HaveCount(2);
            email.Bcc.Should().Contain("test@test.com").And.Contain("keep@test.com");
        }

        [Fact]
        public async void SendEmailAsync_BccUser_WithNoEmailBcc()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                EmailEnabled = true,
                EmailAuthorized = true,
                BccUser = true
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailModel()
            {
                To = new[] { "keep@test.com", null },
                Cc = new[] { "keep@test.com", null },
                Bcc = null
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmail>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmail>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmail>("/email", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.To.Should().HaveCount(1);
            email.To.Should().Contain("keep@test.com");
            email.Cc.Should().HaveCount(1);
            email.Cc.Should().Contain("keep@test.com");
            email.Bcc.Should().HaveCount(1);
            email.Bcc.Should().Contain("test@test.com");
        }

        [Fact]
        public async void SendEmailAsync_AlwaysBcc()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                EmailEnabled = true,
                EmailAuthorized = true,
                AlwaysBcc = "test.1@test.com ; test.2@test.com"
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailModel()
            {
                To = new[] { "keep@test.com", null },
                Cc = new[] { "keep@test.com", null },
                Bcc = new[] { "keep@test.com", null }
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmail>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmail>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmail>("/email", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.To.Should().HaveCount(1);
            email.To.Should().Contain("keep@test.com");
            email.Cc.Should().HaveCount(1);
            email.Cc.Should().Contain("keep@test.com");
            email.Bcc.Should().HaveCount(3);
            email.Bcc.Should().Contain("keep@test.com").And.Contain("test.1@test.com").And.Contain("test.2@test.com");
        }
        #endregion

        #region SendEmailAsync MailMerge
        [Fact]
        public async void SendEmailAsync_MailMerge_EmailNotEnabled()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                From = "from@test.com"
            });
            var service = helper.Create<ChesService>(options, user);

            var email = new EmailMergeModel()
            {
                Contexts = new[]
                {
                    new EmailContextModel()
                    {
                        To = new[] { "remove@test.com", null },
                        Cc = new[] { "remove@test.com", null },
                        Bcc = new[] { "remove@test.com", null }
                    }
                }
            };

            var client = helper.GetService<Mock<IHttpRequestClient>>();

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>()), Times.Never);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmailMerge>(), It.IsAny<Func<HttpResponseMessage, bool>>()), Times.Never());
            email.From.Should().Be(options.Value.From);
            email.Contexts.First().To.Should().HaveCount(1);
            email.Contexts.First().To.Should().Contain("test@test.com");
            email.Contexts.First().Cc.Should().BeEmpty();
            email.Contexts.First().Bcc.Should().BeEmpty();
        }

        [Fact]
        public async void SendEmailAsync_MailMerge_EmailAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                HostUri = "https://host",
                EmailEnabled = true,
                EmailAuthorized = true
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailMergeModel()
            {
                Contexts = new[]
                {
                    new EmailContextModel()
                    {
                        To = new[] { "keep@test.com", null },
                        Cc = new[] { "keep@test.com", null },
                        Bcc = new[] { "keep@test.com", null }
                    }
                }
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmailMerge>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>($"{options.Value.HostUri}/emailMerge", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.Contexts.First().To.Should().HaveCount(1);
            email.Contexts.First().To.Should().Contain("keep@test.com");
            email.Contexts.First().Cc.Should().HaveCount(1);
            email.Contexts.First().Cc.Should().Contain("keep@test.com");
            email.Contexts.First().Bcc.Should().HaveCount(1);
            email.Contexts.First().Bcc.Should().Contain("keep@test.com");
        }

        [Fact]
        public async void SendEmailAsync_MailMerge_EmailNotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                EmailEnabled = true
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailMergeModel()
            {
                Contexts = new[]
                {
                    new EmailContextModel()
                    {
                    To = new[] { "remove@test.com", null },
                    Cc = new[] { "remove@test.com", null },
                    Bcc = new[] { "remove@test.com", null }
                    }
                }
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmailMerge>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>("/emailMerge", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.Contexts.First().To.Should().HaveCount(1);
            email.Contexts.First().To.Should().Contain("test@test.com");
            email.Contexts.First().Cc.Should().BeEmpty();
            email.Contexts.First().Bcc.Should().BeEmpty();
        }

        [Fact]
        public async void SendEmailAsync_MailMerge_OverrideTo()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                EmailEnabled = true,
                OverrideTo = "test.1@test.com; test.2@test.com"
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailMergeModel()
            {
                Contexts = new[]
                {
                    new EmailContextModel()
                    {
                        To = new[] { "remove@test.com", null },
                        Cc = new[] { "remove@test.com", null },
                        Bcc = new[] { "remove@test.com", null }
                    }
                }
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmailMerge>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>("/emailMerge", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.Contexts.First().To.Should().HaveCount(2);
            email.Contexts.First().To.Should().Contain("test.1@test.com").And.Contain("test.2@test.com");
            email.Contexts.First().Cc.Should().BeEmpty();
            email.Contexts.First().Bcc.Should().BeEmpty();
        }

        [Fact]
        public async void SendEmailAsync_MailMerge_BccUser()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                EmailEnabled = true,
                EmailAuthorized = true,
                BccUser = true
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailMergeModel()
            {
                Contexts = new[]
                {
                    new EmailContextModel()
                    {
                        To = new[] { "keep@test.com", null },
                        Cc = new[] { "keep@test.com", null },
                        Bcc = new[] { "keep@test.com", null }
                    }
                }
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmailMerge>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>("/emailMerge", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.Contexts.First().To.Should().HaveCount(1);
            email.Contexts.First().To.Should().Contain("keep@test.com");
            email.Contexts.First().Cc.Should().HaveCount(1);
            email.Contexts.First().Cc.Should().Contain("keep@test.com");
            email.Contexts.First().Bcc.Should().HaveCount(2);
            email.Contexts.First().Bcc.Should().Contain("test@test.com").And.Contain("keep@test.com");
        }

        [Fact]
        public async void SendEmailAsync_MailMerge_BccUser_WithNoEmailBcc()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                EmailEnabled = true,
                EmailAuthorized = true,
                BccUser = true
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailMergeModel()
            {
                Contexts = new[]
                {
                    new EmailContextModel()
                    {
                        To = new[] { "keep@test.com", null },
                        Cc = new[] { "keep@test.com", null },
                        Bcc = null
                    }
                }
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmailMerge>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>("/emailMerge", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.Contexts.First().To.Should().HaveCount(1);
            email.Contexts.First().To.Should().Contain("keep@test.com");
            email.Contexts.First().Cc.Should().HaveCount(1);
            email.Contexts.First().Cc.Should().Contain("keep@test.com");
            email.Contexts.First().Bcc.Should().HaveCount(1);
            email.Contexts.First().Bcc.Should().Contain("test@test.com");
        }

        [Fact]
        public async void SendEmailAsync_MailMerge_AlwaysBcc()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                EmailEnabled = true,
                EmailAuthorized = true,
                AlwaysBcc = "test.1@test.com ; test.2@test.com"
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var email = new EmailMergeModel()
            {
                Contexts = new[]
                {
                    new EmailContextModel()
                    {
                        To = new[] { "keep@test.com", null },
                        Cc = new[] { "keep@test.com", null },
                        Bcc = new[] { "keep@test.com", null }
                    }
                }
            };
            var response = new EmailResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<IEmailMerge>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            // Act
            var result = await service.SendEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendJsonAsync<EmailResponseModel, IEmailMerge>("/emailMerge", HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken),
                email, null), Times.Once());
            email.Contexts.First().To.Should().HaveCount(1);
            email.Contexts.First().To.Should().Contain("keep@test.com");
            email.Contexts.First().Cc.Should().HaveCount(1);
            email.Contexts.First().Cc.Should().Contain("keep@test.com");
            email.Contexts.First().Bcc.Should().HaveCount(3);
            email.Contexts.First().Bcc.Should().Contain("keep@test.com").And.Contain("test.1@test.com").And.Contain("test.2@test.com");
        }
        #endregion

        #region GetStatusAsync
        [Fact]
        public async void GetStatusAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                HostUri = "https://host"
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var response = new StatusResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendAsync<StatusResponseModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            var messageId = Guid.NewGuid();

            // Act
            var result = await service.GetStatusAsync(messageId);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<StatusResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendAsync<StatusResponseModel>($"{options.Value.HostUri}/status/{messageId}", HttpMethod.Get,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken), null, null), Times.Once());
        }

        [Fact]
        public async void GetStatusAsync_WithFilter_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                HostUri = "https://host"
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var response = new[] { new StatusResponseModel() };

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendAsync<IEnumerable<StatusResponseModel>>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            var filter = new StatusModel()
            {
                MessageId = Guid.NewGuid(),
                Status = "Pending space",
                Tag = "tag space&",
                TransactionId = Guid.NewGuid()
            };

            // Act
            var result = await service.GetStatusAsync(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<StatusResponseModel>>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            var expectedResult = $"{options.Value.HostUri}/status?msgId={HttpUtility.UrlEncode($"{filter.MessageId}")}&status={HttpUtility.UrlEncode(filter.Status)}&tag={HttpUtility.UrlEncode(filter.Tag)}&txId={HttpUtility.UrlEncode($"{filter.TransactionId}")}";
            client.Verify(m => m.SendAsync<IEnumerable<StatusResponseModel>>(expectedResult, HttpMethod.Get,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken), null, null), Times.Once());
        }

        [Fact]
        public async void GetStatusAsync_NoFilter_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                HostUri = "https://host"
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var response = new[] { new StatusResponseModel() };

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendAsync<IEnumerable<StatusResponseModel>>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            var filter = new StatusModel()
            {
                Status = "Pending space",
            };

            // Act
            var result = await service.GetStatusAsync(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<StatusResponseModel>>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            var expectedResult = $"{options.Value.HostUri}/status?status={HttpUtility.UrlEncode(filter.Status)}";
            client.Verify(m => m.SendAsync<IEnumerable<StatusResponseModel>>(expectedResult, HttpMethod.Get,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken), null, null), Times.Once());
        }

        [Fact]
        public async void GetStatusAsync_NoFilter_ArgumentException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                HostUri = "https://host"
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var response = new[] { new StatusResponseModel() };

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendAsync<IEnumerable<StatusResponseModel>>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            var filter = new StatusModel();

            // Act
            // Assert
            var result = await Assert.ThrowsAsync<ArgumentException>(async () => await service.GetStatusAsync(filter));

            client.Verify(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<FormUrlEncodedContent>(), null), Times.Never);
            client.Verify(m => m.SendAsync<IEnumerable<StatusResponseModel>>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), null, null), Times.Never());
        }
        #endregion

        #region CancelEmailAsync
        [Fact]
        public async void CancelEmailAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                HostUri = "https://host"
            });
            var tokenHandler = new JwtSecurityTokenHandler();
            var service = helper.Create<ChesService>(options, user, tokenHandler);

            var token = new TokenModel()
            {
                AccessToken = helper.GenerateAccessToken()
            };
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{}", Encoding.UTF8, "application/json")
            };
            var status = new StatusResponseModel();

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendAsync(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>())).ReturnsAsync(response);
            client.Setup(m => m.SendAsync<StatusResponseModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(status);

            var messageId = Guid.NewGuid();

            // Act
            var result = await service.CancelEmailAsync(messageId);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<StatusResponseModel>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            client.Verify(m => m.SendAsync($"{options.Value.HostUri}/cancel/{messageId}", HttpMethod.Delete,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken), null), Times.Once());
            client.Verify(m => m.SendAsync<StatusResponseModel>($"{options.Value.HostUri}/status/{messageId}", HttpMethod.Get,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken), null, null), Times.Once());
        }

        [Fact]
        public async void CancelEmailAsync_WithFilter_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                HostUri = "https://host"
            });
            var tokenHandler = new JwtSecurityTokenHandler();
            var service = helper.Create<ChesService>(options, user, tokenHandler);

            var token = new TokenModel()
            {
                AccessToken = helper.GenerateAccessToken()
            };
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{}", Encoding.UTF8, "application/json")
            };
            var status = new[] { new StatusResponseModel() };

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendAsync(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>())).ReturnsAsync(response);
            client.Setup(m => m.SendAsync<IEnumerable<StatusResponseModel>>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(status);

            var filter = new StatusModel()
            {
                MessageId = Guid.NewGuid(),
                Status = "Pending space",
                Tag = "tag space&",
                TransactionId = Guid.NewGuid()
            };

            // Act
            var result = await service.CancelEmailAsync(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<StatusResponseModel>>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            var expectedQuery = $"msgId={HttpUtility.UrlEncode($"{filter.MessageId}")}&status={HttpUtility.UrlEncode(filter.Status)}&tag={HttpUtility.UrlEncode(filter.Tag)}&txId={HttpUtility.UrlEncode($"{filter.TransactionId}")}";
            client.Verify(m => m.SendAsync($"{options.Value.HostUri}/cancel?{expectedQuery}", HttpMethod.Delete,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken), null), Times.Once());
            client.Verify(m => m.SendAsync<IEnumerable<StatusResponseModel>>($"{options.Value.HostUri}/status?{expectedQuery}", HttpMethod.Get,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken), null, null), Times.Once());
        }

        [Fact]
        public async void CancelEmailAsync_NoFilter_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                HostUri = "https://host"
            });
            var tokenHandler = new JwtSecurityTokenHandler();
            var service = helper.Create<ChesService>(options, user, tokenHandler);

            var token = new TokenModel()
            {
                AccessToken = helper.GenerateAccessToken()
            };
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{}", Encoding.UTF8, "application/json")
            };
            var status = new[] { new StatusResponseModel() };

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendAsync(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>())).ReturnsAsync(response);
            client.Setup(m => m.SendAsync<IEnumerable<StatusResponseModel>>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(status);

            var filter = new StatusModel()
            {
                Status = "Pending space",
            };

            // Act
            var result = await service.CancelEmailAsync(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<StatusResponseModel>>(result);
            client.Verify(m => m.SendAsync<TokenModel>(options.Value.AuthUrl, HttpMethod.Post,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Basic" && a.GetValues("ContentType").First() == "application/x-www-form-urlencoded"),
                It.IsAny<FormUrlEncodedContent>(), null), Times.Once);
            var expectedQuery = $"status={HttpUtility.UrlEncode(filter.Status)}";
            client.Verify(m => m.SendAsync($"{options.Value.HostUri}/cancel?{expectedQuery}", HttpMethod.Delete,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken), null), Times.Once());
            client.Verify(m => m.SendAsync<IEnumerable<StatusResponseModel>>($"{options.Value.HostUri}/status?{expectedQuery}", HttpMethod.Get,
                It.Is<HttpRequestHeaders>(a => a.Authorization.Scheme == "Bearer" && a.Authorization.Parameter == token.AccessToken), null, null), Times.Once());
        }

        [Fact]
        public async void CancelEmailAsync_NoFilter_ArgumentException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var options = Options.Create(new ChesOptions()
            {
                AuthUrl = "https:/test.com",
                HostUri = "https://host"
            });
            var service = helper.Create<ChesService>(options, user);

            var token = new TokenModel()
            {
                AccessToken = "test"
            };
            var response = new[] { new StatusResponseModel() };

            var client = helper.GetService<Mock<IHttpRequestClient>>();
            client.Setup(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(token);
            client.Setup(m => m.SendAsync<IEnumerable<StatusResponseModel>>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<HttpContent>(), It.IsAny<Func<HttpResponseMessage, bool>>())).ReturnsAsync(response);

            var filter = new StatusModel();

            // Act
            // Assert
            var result = await Assert.ThrowsAsync<ArgumentException>(async () => await service.CancelEmailAsync(filter));

            client.Verify(m => m.SendAsync<TokenModel>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), It.IsAny<FormUrlEncodedContent>(), null), Times.Never);
            client.Verify(m => m.SendAsync<IEnumerable<StatusResponseModel>>(It.IsAny<string>(), It.IsAny<HttpMethod>(), It.IsAny<HttpRequestHeaders>(), null, null), Times.Never());
        }
        #endregion
        #endregion
    }
}
