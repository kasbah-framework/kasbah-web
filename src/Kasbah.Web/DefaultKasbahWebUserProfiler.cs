using System;
using System.Text;
using Kasbah.Core.Cache;
using Microsoft.AspNetCore.Http.Features;
using Newtonsoft.Json;

namespace Kasbah.Web
{
    public class DefaultKasbahWebUserProfiler : IKasbahWebUserProfiler
    {
        #region Private Fields

        const string CookieKey = "kasbah:user_profile";
        readonly CacheService _cacheService;

        #endregion

        #region Public Constructors

        public DefaultKasbahWebUserProfiler(CacheService cacheService)
        {
            _cacheService = cacheService;
        }

        #endregion

        #region Public Methods

        public KasbahWebUserProfile GetProfile(KasbahWebContext context)
        {
            if (context.HttpContext.Request.Cookies.ContainsKey(CookieKey))
            {
                var cookieValue = context.HttpContext.Request.Cookies[CookieKey].ToString();
                cookieValue = Encoding.UTF8.GetString(Convert.FromBase64String(cookieValue));

                return JsonConvert.DeserializeObject<KasbahWebUserProfile>(cookieValue);
            }

            return KasbahWebUserProfile.Empty;
        }

        public void ProfileUser(KasbahWebContext context)
        {
            if (context.UserProfile == KasbahWebUserProfile.Empty)
            {
                context.UserProfile = new KasbahWebUserProfile
                {
                    FirstVisit = DateTime.UtcNow
                };
            }

            context.UserProfile.LastActive = DateTime.UtcNow;
            context.UserProfile.RemoteAddr = context.HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString();

            StoreValue(context, context.UserProfile);
        }

        #endregion

        #region Private Methods

        void StoreValue(KasbahWebContext context, KasbahWebUserProfile profile)
        {
            // TODO: keep track of users in the cache, or a db, or somewhere...
            var cookieValue = JsonConvert.SerializeObject(profile);
            cookieValue = Convert.ToBase64String(Encoding.UTF8.GetBytes(cookieValue));

            context.HttpContext.Response.Cookies.Append(CookieKey, cookieValue);
        }

        #endregion
    }
}