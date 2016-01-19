using System;
using System.Collections.Generic;
using System.Linq;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.ContentBroker.Models;
using Kasbah.Core.ContentTree;

namespace Kasbah.Web.Models
{
    public class NodeDefinition
    {
        #region Public Properties

        public string Alias { get; set; }

        public NodeDefinition Parent { get; set; }
        public IDictionary<string, object> StaticValues { get; set; }
        public Type Type { get; set; }

        #endregion
    }

    public class Site : ItemBase
    {
        #region Public Constructors

        public Site()
        {
            _staticStructure = null;
        }

        public Site(IEnumerable<NodeDefinition> staticStructure)
        {
            _staticStructure = staticStructure;
        }

        #endregion

        #region Public Methods

        public void EnsureStaticStructure(Guid siteNode, ContentBroker contentBroker)
        {
            if (_staticStructure == null) { return; }

            CreateChildren(contentBroker, _staticStructure, siteNode, null);
        }

        #endregion

        #region Private Fields

        readonly IEnumerable<NodeDefinition> _staticStructure;

        #endregion

        #region Public Properties

        public string Alias { get; set; }

        public string DisplayName { get; set; }

        public IEnumerable<SiteDomain> Domains { get; set; }

        #endregion

        #region Private Methods

        void CreateChildren(ContentBroker contentBroker, IEnumerable<NodeDefinition> structure, Guid node, NodeDefinition nodeDefinition)
        {
            foreach (var childNodeDefinition in _staticStructure.Where(ent => ent.Parent == nodeDefinition))
            {
                var childNode = contentBroker.GetOrCreate(node, childNodeDefinition.Alias, childNodeDefinition.Type);

                CreateChildren(contentBroker, structure, childNode, childNodeDefinition);
            }
        }

        #endregion
    }

    public class SiteDomain
    {
        #region Public Properties

        public string Domain { get; set; }

        #endregion
    }

    public class SiteList : List<Site> { }
}