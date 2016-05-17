using Microsoft.AspNetCore.Builder;

namespace Kasbah.Web.Admin
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWebAdmin(this IApplicationBuilder app)
        {
            app.UseCors("defaultCorsPolicy");

            app.UseMvc();

            app.UseKasbahWeb();

            return app;
        }

        #endregion
    }
}