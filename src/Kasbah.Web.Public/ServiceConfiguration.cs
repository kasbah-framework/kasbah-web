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

            // Services
            services.AddScoped<Services.UrlService>();
            services.AddScoped<Core.ContentTree.ContentTreeService>();
            services.AddScoped<Core.Index.IndexService>();
            services.AddScoped<Core.Events.EventService>();
            services.AddScoped<Core.ContentBroker.ContentBroker>();

            services.AddMvc();

            return services;
        }

        #endregion
    }
}