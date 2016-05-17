using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;

namespace Kasbah.Web.Admin
{
    public static class ServiceConfiguration
    {
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