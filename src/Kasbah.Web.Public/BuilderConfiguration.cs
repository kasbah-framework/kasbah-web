using Microsoft.AspNet.Builder;

namespace Kasbah.Web.Public
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWebPublic(this IApplicationBuilder app)
        {
            app.UseCors("allowAnyOrigin");

            app.UseMvc();

            return app;
        }

        #endregion
    }
}