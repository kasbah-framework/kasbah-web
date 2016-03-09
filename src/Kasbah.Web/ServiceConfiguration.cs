using Microsoft.Extensions.DependencyInjection;

namespace Kasbah.Web
{
    public static class ServiceConfiguration
    {
        #region Public Methods

        public static IServiceCollection AddKasbahWeb(this IServiceCollection services)
        {
            // Services
            services.AddScoped<Kasbah.Core.ContentTree.ContentTreeService>();
            services.AddScoped<Kasbah.Core.Index.IndexService>();
            services.AddScoped<Kasbah.Core.Events.EventService>();
            services.AddScoped<Kasbah.Core.Cache.CacheService>();
            services.AddScoped<Kasbah.Core.ContentBroker.ContentBroker>();

            services.AddScoped<Kasbah.Web.Services.UrlService>();
            services.AddScoped<Kasbah.Web.Services.ModelDefinitionService>();

            services.AddScoped<IKasbahWebUserProfiler, DefaultKasbahWebUserProfiler>();

            return services;
        }

        #endregion
    }
}