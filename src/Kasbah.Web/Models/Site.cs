using System;
using System.Collections.Generic;
using System.Linq;
using Kasbah.Core.Models;

namespace Kasbah.Web.Models
{
    public class Site : ItemBase
    {
        readonly IEnumerable<NodeDefinition> _staticStructure;

        #region Public Properties

        public string Alias { get; set; }

        public IEnumerable<Domain> Domains { get; set; }


        #endregion

        public Site()
        {
            _staticStructure = null;
        }

        public Site(IEnumerable<NodeDefinition> staticStructure)
        {
            _staticStructure = structure;
        }

        public void EnsureStaticStructure(Guid siteNode, ContentTreeService contentTreeService)
        {
            if (_staticStructure == null) { return; }

            CreateChildren(contentTreeService, _staticStructure, siteNode, null);
        }

        void CreateChildren(ContentTreeService contentTreeService, IEnumerable<NodeDefinition> structure, Guid node, NodeDefinition nodeDefinition)
        {
            foreach (var childNodeDefinition in _staticStructure.Where(ent => ent.Parent == nodeDefinition))
            {
                var childNode = contentTreeService.GetOrCreate(node, childNodeDefinition.Alias, childNodeDefinition.Type);

                CreateChildren(contentTreeService, structure, childNode, childNodeDefinition);
            }
        }
    }

    public class SiteDomain
    {
        public string Domain { get; set; }
    }

    public class SiteList : List<Site> { }

    public class NodeDefinition
    {
        public string Alias { get; set; }

        public Type Type { get; set; }

        public NodeDefinition Parent { get; set; }

        public IDictionary<string, object> StaticValues { get; set; }
    }
}