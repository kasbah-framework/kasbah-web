namespace Kasbah.Web.Admin.Models
{
    public class BaseApiResponse
    {
        #region Public Properties

        public int? ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public bool Success { get { return !ErrorCode.HasValue; } }

        #endregion
    }
}