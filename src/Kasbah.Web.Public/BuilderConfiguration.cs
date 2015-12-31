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
            app.UseCors("allowAnyOrigin");

            app.UseMvc(routes =>
            {
                var defaultHandler = new KasbahRouter(routes.DefaultHandler,
                    app.ApplicationServices.GetRequiredService<ILoggerFactory>(),
                    app.ApplicationServices.GetRequiredService<IApplicationContext>(),
                    app.ApplicationServices.GetRequiredService<ContentBroker>());

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
