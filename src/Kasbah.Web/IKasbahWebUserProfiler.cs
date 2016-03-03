namespace Kasbah.Web
{
    public interface IKasbahWebUserProfiler
    {
        #region Public Methods

        KasbahWebUserProfile GetProfile(KasbahWebContext context);

        void ProfileUser(KasbahWebContext context);

        #endregion
    }
}