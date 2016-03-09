﻿using System;
using System.Collections.Generic;

namespace Kasbah.Web.Models
{
    public abstract class VersionedContentBase : ContentBase
    {
        #region Public Properties

        public IEnumerable<object> Versions { get; set; }

        public abstract Type VersionType { get; }

        #endregion

        #region Public Methods

        public abstract ContentBase SelectVersion(KasbahWebContext context);

        #endregion
    }

    public abstract class VersionedContentBase<T> : VersionedContentBase
    {
        #region Public Properties

        public new IEnumerable<T> Versions { get; set; }

        public override Type VersionType { get { return typeof(T); } }

        #endregion
    }
}