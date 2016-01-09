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
            services.AddScoped<Kasbah.Core.ContentTree.ContentTreeService>();
            services.AddScoped<Kasbah.Core.Index.IndexService>();
            services.AddScoped<Kasbah.Core.Events.EventService>();
            services.AddScoped<Kasbah.Core.ContentBroker.ContentBroker>();

            services.AddMvc((options) =>
            {
            //     var formatter = options.OutputFormatters.SingleOrDefault(f => f is JsonOutputFormatter) as JsonOutputFormatter;

            //     formatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });

            return services;
        }

        #endregion
    }
}
