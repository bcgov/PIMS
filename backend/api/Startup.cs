using System;
using System.Data.SqlClient;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Pims.Api.Helpers;
using Pims.Api.Helpers.Authorization;
using Pims.Api.Helpers.Middleware;
using Pims.Dal;

namespace Pims.Api
{
    /// <summary>
    /// Startup class, provides a way to startup the .netcore RESTful API and configure it.
    /// </summary>
    public class Startup
    {
        #region Properties
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
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<Pims.Api.Configuration.KeycloakOptions>(this.Configuration);

            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.WriteIndented = true;
                    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                });

            services.AddOptions();

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
                                context.Response.StatusCode = 500;
                                context.Response.ContentType = "text/plain";
                                if (Environment.IsDevelopment())
                                {
                                    return context.Response.WriteAsync(context.Exception.ToString());
                                }
                                return context.Response.WriteAsync("An error occurred processing your authentication.");
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

            services.AddDbContext<PimsContext>(options =>
            {
                var cs = Configuration.GetConnectionString("PIMS");
                var builder = new SqlConnectionStringBuilder(cs);
                var pwd = Configuration["DB_PASSWORD"];
                if (!String.IsNullOrEmpty(pwd))
                {
                    builder.Password = pwd;
                }
                options.UseSqlServer(builder.ConnectionString);
            });

            services.AddHttpClient();

            services.AddPimsService();
            services.AddPimsAdminService();
            services.AddSingleton<IAuthorizationHandler, RealmAccessRoleHandler>();
            services.AddTransient<IClaimsTransformation, KeycloakClaimTransformer>();
            services.AddHttpContextAccessor();
            services.AddTransient<ClaimsPrincipal>(s => s.GetService<IHttpContextAccessor>().HttpContext.User);
            services.AddScoped<IKeycloakRequestClient, KeycloakRequestClient>();

            services.AddAutoMapper(typeof(Startup));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (!env.IsProduction())
            {
                app.UseDatabaseErrorPage();
                //app.UseDeveloperExceptionPage();

                UpdateDatabase(app);
            }
            else
            {
                // app.UseExceptionHandler("/Error");
            }

            app.UseMiddleware(typeof(ErrorHandlingMiddleware));

            //app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseMiddleware(typeof(LogRequestMiddleware));

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        /// <summary>
        /// Initialize the database when the application starts.
        /// This isn't an ideal way to do this, but will work for our purposes.
        /// </summary>
        /// <param name="app"></param>
        private static void UpdateDatabase(IApplicationBuilder app)
        {
            using(var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                var logger = serviceScope.ServiceProvider.GetService<ILogger<Startup>>();

                try
                {
                    using(var context = serviceScope.ServiceProvider.GetService<PimsContext>())
                    {
                        context.Database.Migrate();
                    }
                }
                catch (Exception ex)
                {
                    logger.LogCritical(ex, "Database migration failed on startup.");
                }
            }
        }
        #endregion
    }
}
