using HealthChecks.UI.Client;
using Mapster;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Pims.Api.Helpers.Authorization;
using Pims.Api.Helpers.Mapping;
using Pims.Api.Helpers.Middleware;
using Pims.Api.Helpers.Routes.Constraints;
using Pims.Ches;
using Pims.Core.Converters;
using Pims.Core.Http;
using Pims.Dal;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Keycloak;
using Pims.Geocoder;
using Pims.Notifications;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Pims.Api.Helpers.Logging;
using Prometheus;
using Pims.Api.Helpers.Exceptions;

namespace Pims.Api
{
    /// <summary>
    /// Startup class, provides a way to startup the .netcore RESTful API and configure it.
    /// </summary>
    public class Startup
    {
        #region Properties
        /// <summary>
        /// get - The application configuration settings.
        /// </summary>
        /// <value></value>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// get/set - The environment settings for the application.
        /// </summary>
        /// <value></value>
        public IWebHostEnvironment Environment { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instances of a Startup class.
        /// </summary>
        /// <param name="configuration"></param>
        /// <param name="env"></param>
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            this.Configuration = configuration;
            this.Environment = env;
        }
        #endregion

        #region Methods
        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSerilogging(this.Configuration);
            var jsonSerializerOptions = new JsonSerializerOptions()
            {
                IgnoreNullValues = !String.IsNullOrWhiteSpace(this.Configuration["Serialization:Json:IgnoreNullValues"]) ? Boolean.Parse(this.Configuration["Serialization:Json:IgnoreNullValues"]) : false,
                PropertyNameCaseInsensitive = !String.IsNullOrWhiteSpace(this.Configuration["Serialization:Json:PropertyNameCaseInsensitive"]) ? Boolean.Parse(this.Configuration["Serialization:Json:PropertyNameCaseInsensitive"]) : false,
                PropertyNamingPolicy = this.Configuration["Serialization:Json:PropertyNamingPolicy"] == "CamelCase" ? JsonNamingPolicy.CamelCase : null,
                WriteIndented = !String.IsNullOrWhiteSpace(this.Configuration["Serialization:Json:WriteIndented"]) ? Boolean.Parse(this.Configuration["Serialization:Json:WriteIndented"]) : false
            };
            services.AddMapster(jsonSerializerOptions, options =>
            {
                options.Default.IgnoreNonMapped(true);
                options.Default.IgnoreNullValues(true);
                options.AllowImplicitDestinationInheritance = true;
                options.AllowImplicitSourceInheritance = true;
                options.Default.UseDestinationValue(member =>
                    member.SetterModifier == AccessModifier.None &&
                    member.Type.IsGenericType &&
                    member.Type.GetGenericTypeDefinition() == typeof(ICollection<>));
            });
            services.Configure<JsonSerializerOptions>(options =>
            {
                options.IgnoreNullValues = jsonSerializerOptions.IgnoreNullValues;
                options.PropertyNameCaseInsensitive = jsonSerializerOptions.PropertyNameCaseInsensitive;
                options.PropertyNamingPolicy = jsonSerializerOptions.PropertyNamingPolicy;
                options.WriteIndented = jsonSerializerOptions.WriteIndented;
                options.Converters.Add(new JsonStringEnumConverter());
                options.Converters.Add(new Int32ToStringJsonConverter());
            });
            services.Configure<Core.Http.Configuration.AuthClientOptions>(this.Configuration.GetSection("Keycloak"));
            services.Configure<Core.Http.Configuration.OpenIdConnectOptions>(this.Configuration.GetSection("Keycloak:OpenIdConnect"));
            services.Configure<Keycloak.Configuration.KeycloakOptions>(this.Configuration.GetSection("Keycloak"));
            services.Configure<Pims.Dal.PimsOptions>(this.Configuration.GetSection("Pims"));
            services.AddOptions();

            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.IgnoreNullValues = jsonSerializerOptions.IgnoreNullValues;
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = jsonSerializerOptions.PropertyNameCaseInsensitive;
                    options.JsonSerializerOptions.PropertyNamingPolicy = jsonSerializerOptions.PropertyNamingPolicy;
                    options.JsonSerializerOptions.WriteIndented = jsonSerializerOptions.WriteIndented;
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.Converters.Add(new Int32ToStringJsonConverter());
                    options.JsonSerializerOptions.Converters.Add(new GeometryJsonConverter());
                });

            services.AddMvcCore()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.IgnoreNullValues = jsonSerializerOptions.IgnoreNullValues;
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = jsonSerializerOptions.PropertyNameCaseInsensitive;
                    options.JsonSerializerOptions.PropertyNamingPolicy = jsonSerializerOptions.PropertyNamingPolicy;
                    options.JsonSerializerOptions.WriteIndented = jsonSerializerOptions.WriteIndented;
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.Converters.Add(new Int32ToStringJsonConverter());
                    options.JsonSerializerOptions.Converters.Add(new GeometryJsonConverter());
                });

            services.AddRouting(options =>
            {
                options.ConstraintMap.Add("pid", typeof(PidConstraint));
            });

            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    var key = Encoding.ASCII.GetBytes(Configuration["Keycloak:Secret"]);
                    options.RequireHttpsMetadata = false;
                    options.Authority = Configuration["Keycloak:Authority"];
                    options.Audience = Configuration["Keycloak:Audience"];
                    options.SaveToken = true;
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
                    {
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                    if (key.Length > 0) options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(key);
                    options.Events = new JwtBearerEvents()
                    {
                        OnTokenValidated = context =>
                        {
                            return Task.CompletedTask;
                        },
                        OnAuthenticationFailed = context =>
                        {
                            context.NoResult();
                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            throw new AuthenticationException("Failed to authenticate", context.Exception);
                        },
                        OnForbidden = context =>
                        {
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("Administrator", policy => policy.Requirements.Add(new RealmAccessRoleRequirement("administrator")));
            });

            // Generate the database connection string.
            var csBuilder = new SqlConnectionStringBuilder(this.Configuration.GetConnectionString("PIMS"));
            var pwd = this.Configuration["DB_PASSWORD"];
            if (!String.IsNullOrEmpty(pwd))
            {
                csBuilder.Password = pwd;
            }

            services.AddHttpClient();
            services.AddPimsContext(this.Environment, csBuilder.ConnectionString);
            services.AddPimsServices();
            services.AddPimsKeycloakService();
            services.AddGeocoderService(this.Configuration.GetSection("Geocoder")); // TODO: Determine if a default value could be used instead.
            services.AddChesService(this.Configuration.GetSection("Ches"));
            services.AddNotificationsService();
            services.AddSingleton<IAuthorizationHandler, RealmAccessRoleHandler>();
            services.AddTransient<IClaimsTransformation, KeycloakClaimTransformer>();
            services.AddHttpContextAccessor();
            services.AddTransient<ClaimsPrincipal>(s => s.GetService<IHttpContextAccessor>().HttpContext.User);
            services.AddScoped<IProxyRequestClient, ProxyRequestClient>();
            services.AddScoped<IOpenIdConnectRequestClient, OpenIdConnectRequestClient>();

            services.AddHealthChecks()
                .AddCheck("liveliness", () => HealthCheckResult.Healthy())
                .AddSqlServer(csBuilder.ConnectionString, tags: new[] { "services" });

            services.AddApiVersioning(options =>
            {
                options.ReportApiVersions = true;
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ApiVersionReader = new HeaderApiVersionReader("api-version");
                // options.DefaultApiVersion = new ApiVersion(1, 0);
            });
            services.AddVersionedApiExplorer(options =>
            {
                // add the versioned api explorer, which also adds IApiVersionDescriptionProvider service
                // note: the specified format code will format the version as "'v'major[.minor][-status]"
                options.GroupNameFormat = "'v'VVV";

                // note: this option is only necessary when versioning by url segment. the SubstitutionFormat
                // can also be used to control the format of the API version in route templates
                options.SubstituteApiVersionInUrl = true;

            });
            services.AddTransient<IConfigureOptions<SwaggerGenOptions>, Helpers.Swagger.ConfigureSwaggerOptions>();

            services.AddSwaggerGen(options =>
            {
                options.EnableAnnotations(false, true);
                options.CustomSchemaIds(o => o.FullName);
                options.OperationFilter<Helpers.Swagger.SwaggerDefaultValues>();
                options.DocumentFilter<Helpers.Swagger.SwaggerDocumentFilter>();
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Description = "Please enter into field the word 'Bearer' following by space and JWT",
                    Type = SecuritySchemeType.ApiKey
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,

                        },
                        new List<string>()
                    }
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);
            });

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.All;
                options.AllowedHosts = this.Configuration.GetValue<string>("AllowedHosts")?.Split(';').ToList<string>();
            });
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        /// <param name="provider"></param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            app.UseMetricServer();
            app.UseHttpMetrics();

            if (!env.IsProduction())
            {
                app.UseDatabaseErrorPage();
            }

            app.UpdateDatabase<Startup>();

            var baseUrl = this.Configuration.GetValue<string>("BaseUrl");
            app.UsePathBase(baseUrl);
            app.UseForwardedHeaders();

            app.UseSwagger(options =>
            {
                options.RouteTemplate = this.Configuration.GetValue<string>("Swagger:RouteTemplate");
            });
            app.UseSwaggerUI(options =>
            {
                foreach (var description in provider.ApiVersionDescriptions)
                {
                    options.SwaggerEndpoint(String.Format(this.Configuration.GetValue<string>("Swagger:EndpointPath"), description.GroupName), description.GroupName);
                }
                options.RoutePrefix = this.Configuration.GetValue<string>("Swagger:RoutePrefix");
            });

            app.UseMiddleware(typeof(ErrorHandlingMiddleware));
            app.UseMiddleware(typeof(ResponseTimeMiddleware));

            //app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors();

            app.UseMiddleware(typeof(LogRequestMiddleware));

            app.UseAuthentication();
            app.UseAuthorization();

            var healthPort = this.Configuration.GetValue<int>("HealthChecks:Port");
            app.UseHealthChecks(this.Configuration.GetValue<string>("HealthChecks:LivePath"), healthPort, new HealthCheckOptions
            {
                Predicate = r => r.Name.Contains("liveliness"),
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });
            app.UseHealthChecks(this.Configuration.GetValue<string>("HealthChecks:ReadyPath"), healthPort, new HealthCheckOptions
            {
                Predicate = r => r.Tags.Contains("services"),
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });

            app.UseEndpoints(config =>
            {
                config.MapControllers();
            });
        }
        #endregion
    }
}
