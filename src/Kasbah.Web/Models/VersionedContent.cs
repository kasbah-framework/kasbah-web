using System;
using System.Collections.Generic;
using Kasbah.Core.ContentBroker.Models;

namespace Kasbah.Web.Models
{
    public abstract class VersionedContentContainer<TContent> : ItemBase
        where TContent : VersionedContent
    {
        public Type ContentType { get; } = typeof(TContent);

        public IEnumerable<TContent> Versions { get; set; }

        public abstract TContent SelectVersion(KasbahWebContext context);
    }

    public abstract class VersionedContent : ContentBase
    {
        public string VersionAlias { get; set; }
    }
}