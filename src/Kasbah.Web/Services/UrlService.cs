using System.Collections.Generic;
using System.Linq;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.Models;
using Kasbah.Web.Models;

namespace Kasbah.Web.Services
{
    public class UrlService
    {
        #region Public Constructors

        public UrlService(ContentBroker contentBroker)
        {
            _contentBroker = contentBroker;
        }

        #endregion

        #region Public Methods

        public string GetUrl(Node node)
        {
            if (node.Parent.HasValue)
            {
                var path = new List<string>
                {
                    node.Alias
                };

                var parent = _contentBroker.GetNode(node.Parent.Value);
                while (parent != null)
                {
                    if (parent.Type == typeof(Site).AssemblyQualifiedName) { break; }

                    path.Add(parent.Alias);
                    parent = _contentBroker.GetNode(parent.Parent.Value);
                }

                path.Reverse();

                return "/" + string.Join("/", path.Skip(1));
            }

            return null;
        }

        #endregion

        #region Private Fields

        readonly ContentBroker _contentBroker;

        #endregion
    }
}