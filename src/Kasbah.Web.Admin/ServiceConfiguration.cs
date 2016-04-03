using System;
using System.IdentityModel.Tokens;
using System.Linq;
using Kasbah.Identity;
using Kasbah.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;

namespace Kasbah.Web.Admin
{
    public static class ServiceConfiguration
    {
        #region Private Fields

        const string TokenAudience = "Admin";
        const string TokenIssuer = "KasbahWeb";

        #endregion

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

            var key = new RsaSecurityKey(RSAKeyUtils.GetOrGenerate());
            // var tokenAuthOptions = new TokenAuthOptions
            // {
            //     Audience = TokenAudience,
            //     Issuer = TokenIssuer,
            //     SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.SHA256)
            // };

            // services.AddInstance(tokenAuthOptions);

            // Enable the use of an [Authorize("Bearer")] attribute on methods and
            // classes to protect.
            // services.AddAuthorization(auth =>
            // {
            //     var bearerPolicy = new AuthorizationPolicyBuilder()
            //         .AddAuthenticationSchemes("Bearer")
            //         .RequireAuthenticatedUser().Build();
            //     auth.AddPolicy("Bearer", bearerPolicy);

            //     auth.DefaultPolicy = bearerPolicy;
            // });

            services.AddSingleton(config());

            // services.AddScoped<IUserStore<KasbahUser>, UserStore>();
            // services.AddScoped<IRoleStore<KasbahIdentityRole>, RoleStore>();

            services.AddIdentity<KasbahUser, KasbahIdentityRole>()
                .AddUserStore<UserStore>()
                .AddDefaultTokenProviders();

            services.AddMvc((options) =>
            {
                var formatter = options.OutputFormatters.SingleOrDefault(f => f is JsonOutputFormatter) as JsonOutputFormatter;

                formatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });

            return services;
        }

        #endregion
    }

    public class TokenAuthOptions
    {
        #region Public Properties

        public string Audience { get; set; }
        public string Issuer { get; set; }
        public SigningCredentials SigningCredentials { get; set; }

        #endregion
    }
}