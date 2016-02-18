using System;

namespace Kasbah.Web.Admin.Models
{
    public class SaveContentRequest
    {
        #region Public Properties

        public object Data { get; set; }
        public Guid Node { get; set; }
        public bool SetActive { get; set; }

        #endregion
    }
}