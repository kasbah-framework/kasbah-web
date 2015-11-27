using System;
using System.Linq;
using Microsoft.AspNet.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;

namespace Kasbah.Web.Public
{
    public static class ServiceConfiguration
    {
        #region Public Methods

        public static IServiceCollection AddKasbahWebPublic(this IServiceCollection services, Func<IApplicationContext> config)
        {
            services = services.AddCors(options =>
            {
                options.AddPolicy("allowAnyOrigin", builder =>
                {
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                    builder.AllowAnyOrigin();
                });
            });

            services.AddSingleton<IApplicationContext>(svc => config());

            // Services
            services.AddScoped<Kasbah.Core.ContentTree.ContentTreeService>();
            services.AddScoped<Kasbah.Core.Index.IndexService>();

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