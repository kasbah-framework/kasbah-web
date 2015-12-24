using System;
using System.Linq;
using Kasbah.Identity;
using Kasbah.Identity.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;

namespace Kasbah.Web.Admin
{
    public static class ServiceConfiguration
    {
        #region Public Methods

        public static IServiceCollection AddKasbahWebAdmin(this IServiceCollection services, Func<IApplicationContext> config)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("allowAnyOrigin", builder =>
                {
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                    builder.AllowCredentials();
                    // builder.AllowAnyOrigin();
                    builder.WithOrigins("http://localhost:3004");
                });

                options.DefaultPolicyName = "allowAnyOrigin";
            });

            services.AddSingleton<IApplicationContext>(svc => config());

            // Services
            services.AddScoped<Kasbah.Core.ContentTree.ContentTreeService>();
            services.AddScoped<Kasbah.Core.Index.IndexService>();
            services.AddScoped<Kasbah.Core.Events.EventService>();

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

            services.Configure<IdentityOptions>(options =>
            {
                options.Cookies.ApplicationCookie.CookieName = "kasbah-web";
            });

            return services;
        }

        #endregion
    }
}
