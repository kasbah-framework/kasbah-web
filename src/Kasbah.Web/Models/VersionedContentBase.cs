using System;
using System.Collections.Generic;

namespace Kasbah.Web.Models
{
    public abstract class VersionedContentBase : ContentBase
    {
        #region Public Properties

        public IEnumerable<object> Versions { get; set; }
        public abstract Type VersionType { get; set; }

        #endregion

        #region Public Methods

        public ContentBase SelectVersion(object context)
        {
            return null;
        }

        #endregion
    }
}