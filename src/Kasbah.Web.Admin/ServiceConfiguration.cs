using System;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using Kasbah.Identity;
using Kasbah.Identity.Models;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;

namespace Kasbah.Web.Admin
{
    public static class ServiceConfiguration
    {
        #region Public Fields

        public const string TokenAudience = "Myself";
        public const string TokenIssuer = "MyProject";

        public static RsaSecurityKey Key = new RsaSecurityKey(RSAKeyUtils.GetOrGenerate());

        public static TokenAuthOptions TokenOptions = new TokenAuthOptions
        {
            Audience = TokenAudience,
            Issuer = TokenIssuer,
            SigningCredentials = new SigningCredentials(Key, SecurityAlgorithms.SHA256)
        };

        #endregion

        #region Public Methods

        public static IServiceCollection AddKasbahWebAdmin(this IServiceCollection services, Func<IApplicationContext> config)
        {
            services.AddKasbahWeb();

            services.AddCors(options =>
            {
                options.AddPolicy("allowAnyOrigin", builder =>
                {
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                    builder.AllowCredentials();
                    // builder.AllowAnyOrigin();
                    builder.WithOrigins("http://localhost:3004", "http://127.0.0.1:3004");
                });

                options.DefaultPolicyName = "allowAnyOrigin";
            });

            services.AddInstance<TokenAuthOptions>(TokenOptions);

            // Enable the use of an [Authorize("Bearer")] attribute on methods and
            // classes to protect.
            services.AddAuthorization(auth =>
            {
                var bearerPolicy = new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes("Bearer")
                    .RequireAuthenticatedUser().Build();
                auth.AddPolicy("Bearer", bearerPolicy);

                auth.DefaultPolicy = bearerPolicy;
            });

            services.AddSingleton<IApplicationContext>(svc => config());

            services.AddScoped<IUserStore<KasbahUser>, UserStore>();
            services.AddScoped<IRoleStore<KasbahIdentityRole>, RoleStore>();

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
