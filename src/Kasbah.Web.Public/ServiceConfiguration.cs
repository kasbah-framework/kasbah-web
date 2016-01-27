using System;
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

            services.AddMvc();

            return services;
        }

        #endregion
    }
}
