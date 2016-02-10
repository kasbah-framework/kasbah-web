
using System;

namespace Kasbah.Web.Admin.Models
{
    public class CreateNodeRequest
    {
        #region Public Properties

        public string Alias { get; set; }
        public Guid? Parent { get; set; }
        public string Type { get; set; }

        #endregion
    }
}