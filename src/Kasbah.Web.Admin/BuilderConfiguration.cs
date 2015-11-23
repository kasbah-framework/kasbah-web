using System;
using System.Linq;
using Kasbah.Identity.Models;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Kasbah.Web.Admin
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWebAdmin(this IApplicationBuilder app)
        {
            app.UseMvc();

            app.UseCors("default");

            EnsureStructure(app.ApplicationServices);

            return app;
        }

        #endregion

        static void EnsureStructure(IServiceProvider applicationServices)
        {
            // TODO: this can stay in kasbah-web
            // var userManager = applicationServices.GetService<UserManager<KasbahUser>>();
            // var admin = userManager.FindByNameAsync("admin").Result;
            // if (admin == null)
            // {
            //     var result = userManager.CreateAsync(new KasbahUser
            //     {
            //         UserName = "admin",
            //         Email = "email@changeme.org"
            //     }, "password").Result;

            //     if (!result.Succeeded)
            //     {
            //         throw new Exception($"Failed to create admin user: {result.Errors.FirstOrDefault()}");
            //     }
            // }
        }
    }
}