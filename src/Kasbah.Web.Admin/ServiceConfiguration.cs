using System;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Kasbah.Identity;
using Kasbah.Identity.Models;

namespace Kasbah.Web.Admin
{
    public static class ServiceConfiguration
    {
        const string TokenAudience = "Admin";
        const string TokenIssuer = "KasbahWeb";

        #region Public Methods

        public static IServiceCollection AddKasbahWebAdmin(this IServiceCollection services, Func<IApplicationContext> config)
        {
            services.AddKasbahWeb();

            services.AddCors(options =>
            {
                options.AddPolicy("defaultCorsPolicy", builder =>
                {
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                    builder.AllowCredentials();

                    builder.WithOrigins("http://localhost:3004", "http://127.0.0.1:3004");
                });

                options.DefaultPolicyName = "defaultCorsPolicy";
            });

            services.AddSingleton(config());

            services.AddAuthorization(auth => {
                var bearerPolicy = new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes("Bearer")
                    .RequireAuthenticatedUser().Build();
                auth.AddPolicy("Bearer", bearerPolicy);

                auth.DefaultPolicy = bearerPolicy;
            });

            services.AddScoped<IUserStore<KasbahUser>, UserStore>();
            services.AddScoped<IRoleStore<KasbahIdentityRole>, RoleStore>();

            services.AddIdentity<KasbahUser, KasbahIdentityRole>()
                .AddUserStore<UserStore>()
                .AddDefaultTokenProviders();

            // var key = new RsaSecurityKey(RSAKeyUtils.GetOrGenerate());
            // var tokenAuthOptions = new TokenAuthOptions
            // {
            //     Audience = TokenAudience,
            //     Issuer = TokenIssuer,
            //     SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.Sha256)
            // };

            // services.AddSingleton(tokenAuthOptions);

            services.AddMvc((options) =>
            {
                var formatter = options.OutputFormatters.SingleOrDefault(f => f is JsonOutputFormatter) as JsonOutputFormatter;

                formatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            }).AddApplicationPart(typeof(ServiceConfiguration).GetTypeInfo().Assembly);

            return services;
        }

        #endregion
    }
}