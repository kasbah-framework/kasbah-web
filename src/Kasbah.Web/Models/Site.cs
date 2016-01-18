using System;
using System.Collections.Generic;
using System.Linq;
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

        public void EnsureStaticStructure(Guid siteNode, ContentTreeService contentTreeService)
        {
            if (_staticStructure == null) { return; }

            CreateChildren(contentTreeService, _staticStructure, siteNode, null);
        }

        #endregion

        #region Private Fields

        readonly IEnumerable<NodeDefinition> _staticStructure;

        #endregion

        #region Public Properties

        public string Alias { get; set; }

        public IEnumerable<SiteDomain> Domains { get; set; }

        #endregion

        #region Private Methods

        void CreateChildren(ContentTreeService contentTreeService, IEnumerable<NodeDefinition> structure, Guid node, NodeDefinition nodeDefinition)
        {
            foreach (var childNodeDefinition in _staticStructure.Where(ent => ent.Parent == nodeDefinition))
            {
                var childNode = contentTreeService.GetOrCreate(node, childNodeDefinition.Alias, childNodeDefinition.Type);

                CreateChildren(contentTreeService, structure, childNode, childNodeDefinition);
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