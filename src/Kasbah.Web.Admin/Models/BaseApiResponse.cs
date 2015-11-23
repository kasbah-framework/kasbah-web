namespace Kasbah.Web.Admin.Models
{
    public class BaseApiResponse
    {
        public bool Success { get { return !ErrorCode.HasValue; } }

        public string ErrorMessage { get; set; }

        public int? ErrorCode { get; set; }
    }
}