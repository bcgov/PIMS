using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.IdentityModel.Tokens;
using Moq;
using System;
using System.Diagnostics.CodeAnalysis;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Security.Claims;

namespace Pims.Core.Test
{
    /// <summary>
    /// HttpContextHelper static class, provides helper functions for the TestHelper when interacting with HttpContext.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public static class HttpContextHelper
    {
        #region Variables
        private static readonly string _issuer = Guid.NewGuid().ToString();
        private static readonly SecurityKey _securityKey;
        private static readonly SigningCredentials _signingCredentials;
        private static readonly byte[] _key = new byte[32];
        #endregion

        #region constructors
        static HttpContextHelper()
        {
            _securityKey = new SymmetricSecurityKey(_key) { KeyId = Guid.NewGuid().ToString() };
            _signingCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256);
        }
        #endregion

        /// <summary>
        /// Provides a quick way to create a new HttpContext and initialize it with the specified properties.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="uri"></param>
        /// <returns></returns>
        public static HttpContext CreateHttpContext(this TestHelper helper, ClaimsPrincipal user, Uri uri = null)
        {
            var request = new Mock<HttpRequest>();
            helper.AddSingleton(request);
            request.Setup(m => m.Scheme).Returns(uri?.Scheme ?? "http");
            request.Setup(m => m.Host).Returns(String.IsNullOrWhiteSpace(uri?.Host) ? new HostString("localhost") : new HostString(uri.Host));
            request.Setup(m => m.Path).Returns(String.IsNullOrWhiteSpace(uri?.AbsolutePath) ? new PathString("/test") : new PathString(uri.AbsolutePath));
            request.Setup(m => m.PathBase).Returns(new PathString("/"));
            request.Setup(m => m.Body).Returns(new MemoryStream());
            request.Setup(m => m.QueryString).Returns(String.IsNullOrWhiteSpace(uri?.Query) ? new QueryString("?") : new QueryString(uri.Query));

            var header = new Mock<IHeaderDictionary>();
            helper.AddSingleton(header);
            header.Setup(m => m["device-id"]).Returns("20317");
            header.Setup(m => m["X-RequestedWith"]).Returns("XMLHttpRequest");
            request.Setup(m => m.Headers).Returns(header.Object);

            var features = new Mock<IFeatureCollection>();
            helper.AddSingleton(features);
            features.Setup(m => m.Get<HttpRequest>()).Returns(request.Object);
            features.Setup(m => m.Get<ClaimsPrincipal>()).Returns(user);

            var context = new Mock<HttpContext>();
            context.Setup(m => m.Features).Returns(features.Object);
            context.Setup(m => m.Request).Returns(request.Object);
            context.Setup(m => m.RequestServices).Returns(helper.Provider);

            var contextAccess = new Mock<IHttpContextAccessor>();
            helper.AddSingleton(contextAccess);
            contextAccess.Setup(m => m.HttpContext).Returns(context.Object);

            return context.Object;
        }

        /// <summary>
        /// Generate a JWT access token for the specified 'identity'.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="identity"></param>
        /// <returns></returns>
        public static string GenerateAccessToken(this TestHelper helper, ClaimsIdentity identity)
        {
            var tokenHandler = helper.GetService<JwtSecurityTokenHandler>();
            var token = helper.GenerateJwtToken(identity);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// Generate a JWT access token for the current user.
        /// </summary>
        /// <param name="helper"></param>
        /// <returns></returns>
        public static string GenerateAccessToken(this TestHelper helper)
        {
            var user = helper.GetService<ClaimsPrincipal>();
            return helper.GenerateAccessToken(user.Identity as ClaimsIdentity);
        }

        /// <summary>
        /// Generate a JWT token for the specified 'identity'.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="identity"></param>
        /// <param name="issuer"></param>
        /// <param name="audience"></param>
        /// <param name="notBefore"></param>
        /// <param name="expires"></param>
        /// <param name="issuedAt"></param>
        /// <param name="signingCredentials"></param>
        /// <returns></returns>
        public static JwtSecurityToken GenerateJwtToken(this TestHelper helper, ClaimsIdentity identity, string issuer = null, string audience = null, DateTime? notBefore = null, DateTime? expires = null, DateTime? issuedAt = null, SigningCredentials signingCredentials = null)
        {
            var tokenHandler = helper.GetService<JwtSecurityTokenHandler>();
            return tokenHandler.CreateJwtSecurityToken(issuer: issuer ?? _issuer, audience: audience ?? _issuer, subject: identity, notBefore: notBefore ?? DateTime.UtcNow, expires: expires ?? DateTime.UtcNow.AddMinutes(20), issuedAt: issuedAt, signingCredentials: signingCredentials ?? _signingCredentials);
        }

        /// <summary>
        /// Generate a JWT token for the specified 'user'.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public static JwtSecurityToken GenerateJwtToken(this TestHelper helper, ClaimsPrincipal user)
        {
            return helper.GenerateJwtToken(user.Identity as ClaimsIdentity);
        }

        /// <summary>
        /// Generate a JWT token for the current user.
        /// </summary>
        /// <param name="helper"></param>
        /// <returns></returns>
        public static JwtSecurityToken GenerateJwtToken(this TestHelper helper)
        {
            var user = helper.GetService<ClaimsPrincipal>();
            return helper.GenerateJwtToken(user);
        }
    }
}
