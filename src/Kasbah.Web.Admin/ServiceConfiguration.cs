using System;
using System.Linq;
using Microsoft.AspNet.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;
using Kasbah.Identity.Models;
using Kasbah.Identity;
using Microsoft.AspNet.Identity;

namespace Kasbah.Web.Admin
{
    public static class ServiceConfiguration
    {
        #region Public Methods

        public static IServiceCollection AddKasbahWebAdmin(this IServiceCollection services, Func<IApplicationContext> config)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("default", builder => {
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                    builder.AllowAnyOrigin();
                });

                options.DefaultPolicyName = "default";
            });

            services.AddSingleton<IApplicationContext>(svc => config());

            // Services
            services.AddSingleton<Kasbah.Core.ContentTree.ContentTreeService>();
            services.AddSingleton<Kasbah.Core.Index.IndexService>();

            services.AddScoped<IUserStore<KasbahUser>, UserStore>();
            services.AddScoped<IRoleStore<KasbahIdentityRole>, UserStore>();


            services.AddIdentity<KasbahUser, KasbahIdentityRole>().AddUserStore<UserStore>();

            services.AddMvc((options) =>
            {
                var formatter = options.OutputFormatters.SingleOrDefault(f => f is JsonOutputFormatter) as JsonOutputFormatter;

                formatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });

            return services;
        }

        #endregion
    }
}