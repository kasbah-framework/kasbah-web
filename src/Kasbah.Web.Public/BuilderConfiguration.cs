using Microsoft.AspNet.Builder;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Kasbah.Core;

namespace Kasbah.Web.Public
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWebPublic(this IApplicationBuilder app)
        {
            app.UseCors("allowAnyOrigin");

            app.UseMvc(routes =>
            {
                var defaultHandler = new KasbahRouter(routes.DefaultHandler,
                    app.ApplicationServices.GetService<ILoggerFactory>(),
                    app.ApplicationServices.GetService<IApplicationContext>(),
                    app.ApplicationServices.GetService<ContentBroker>());

                routes.DefaultHandler = defaultHandler;

                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            app.UseKasbahWeb();

            return app;
        }

        #endregion
    }
}