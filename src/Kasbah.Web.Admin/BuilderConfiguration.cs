using System;
using System.IdentityModel.Tokens;
using Microsoft.AspNet.Authentication.JwtBearer;
using Microsoft.AspNet.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Kasbah.Web.Admin
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWebAdmin(this IApplicationBuilder app)
        {
            var tokenAuthOptions = app.ApplicationServices.GetRequiredService<TokenAuthOptions>();
            app.UseCors("defaultCorsPolicy");

            app.UseIdentity();

            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = tokenAuthOptions.SigningCredentials.Key,
                    ValidAudience = tokenAuthOptions.Audience,
                    ValidIssuer = tokenAuthOptions.Issuer,
                    ValidateSignature = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }
            });

            app.UseMvc();

            app.UseKasbahWeb();

            return app;
        }

        #endregion
    }
}