using System;

namespace Kasbah.Web.Admin.Models
{
    public class SaveContentRequest
    {
        #region Public Properties

        public Guid Node { get; set; }

        public object Data { get; set; }

        public bool SetActive { get; set; }

        #endregion
    }
}