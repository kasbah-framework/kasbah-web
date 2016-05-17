using System;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.DependencyInjection;

namespace Kasbah.Web.Public
{
    public static class ServiceConfiguration
    {
        #region Public Methods

        public static IServiceCollection AddKasbahWebPublic(this IServiceCollection services, Func<IApplicationContext> config)
        {
            services.AddSingleton(svc => config());

            services.AddKasbahWeb();

            services
                .AddMvc()
                .AddApplicationPart(typeof(ServiceConfiguration).GetTypeInfo().Assembly);

            services.Configure<RazorViewEngineOptions>(options =>
            {
                options.ViewLocationExpanders.Add(new KasbahViewLocationExpander());
            });

            return services;
        }

        #endregion
    }
}