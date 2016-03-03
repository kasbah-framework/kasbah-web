using System;
using Kasbah.Core.ContentBroker;
using Microsoft.AspNet.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Kasbah.Web.Public
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWebPublic(this IApplicationBuilder app)
        {
            // TODO: Dan wouldn't like this.  I don't really either.
            ServiceLocator.ApplicationServices = app.ApplicationServices;

            app.UseCors("allowAnyOrigin");

            app.UseMvc(routes =>
            {
                var routers = app.ApplicationServices.GetServices<IKasbahRouter>();
                foreach (var router in routers)
                {
                    routes.Routes.Add(router);
                }

                // Service locator again...
                routes.Routes.Add(new KasbahRouter(routes.DefaultHandler,
                    app.ApplicationServices.GetRequiredService<ILoggerFactory>(),
                    app.ApplicationServices.GetRequiredService<IApplicationContext>(),
                    app.ApplicationServices.GetRequiredService<ContentBroker>(), 
                    app.ApplicationServices.GetRequiredService<IKasbahWebUserProfiler>()));

                routes.MapRoute(
                    name: "default",
                    template: "{*path}");
            });

            app.UseKasbahWeb();

            return app;
        }

        #endregion
    }

    public static class ServiceLocator
    {
        #region Public Properties

        public static IServiceProvider ApplicationServices { get; set; }

        #endregion
    }
}