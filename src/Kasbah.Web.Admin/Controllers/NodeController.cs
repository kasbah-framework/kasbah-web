using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Kasbah.Core;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.ContentBroker.Models;
using Kasbah.Core.Models;
using Kasbah.Core.Utils;
using Kasbah.Web.Admin.Models;
using Kasbah.Web.Annotations;
using Microsoft.AspNetCore.Mvc;

namespace Kasbah.Web.Admin
{
    // [Authorize()]
    public class NodeController
    {
        #region Public Constructors

        public NodeController(ContentBroker contentBroker)
        {
            _contentBroker = contentBroker;
        }

        #endregion

        #region Public Methods

        [HttpPost, Route("api/node")]
        public Guid CreateNode([FromBody]CreateNodeRequest request)
        {
            return _contentBroker.CreateNode(request.Parent, request.Alias, request.Type);
        }

        [HttpPost, Route("api/node/{id}/version")]
        public NodeVersion CreateNodeVersion(Guid id)
        {
            return _contentBroker.Save<ItemBase>(id, Guid.NewGuid(), null);
        }

        [HttpDelete, Route("api/node")]
        public void DeleteNode([FromBody]DeleteNodeRequest request)
        {
            _contentBroker.Delete(request.Id);
        }

        [Route("api/children")]
        public IEnumerable<Node> GetChildren(Guid? id = null)
        {
            return _contentBroker.GetChildren(id).Select(ent => new NodeWithIcon
            {
                ActiveVersion = ent.ActiveVersion,
                HasChildren = ent.HasChildren,
                Alias = ent.Alias,
                Id = ent.Id,
                Parent = ent.Parent,
                Type = ent.Type,
                Icon = TypeUtil.TypeFromName(ent.Type)?.GetTypeInfo().GetAttributeValue<IconAttribute, string>(attr => attr?.Icon)
            }).OrderBy(ent => ent.Alias);
        }

        [Route("api/version/{id}/{version}")]
        public IDictionary<string, object> GetVersion(Guid id, Guid version)
        {
            return _contentBroker.GetNodeVersion(id, version) ?? new Dictionary<string, object>();
        }

        [Route("api/versions/{id}")]
        public IEnumerable<NodeVersion> GetVersions(Guid id)
        {
            return _contentBroker.GetAllNodeVersions(id);
        }

        [HttpPost, Route("api/save/{node}/{version}")]
        public void Save(Guid node, Guid version, [FromBody]IDictionary<string, object> values)
        {
            _contentBroker.SaveAnonymous(version, node, values);
        }

        [HttpPost, Route("api/node/{id}/set-active")]
        public void SetActiveVersion(Guid id, Guid? version)
        {
            _contentBroker.SetActiveNodeVersion(id, version);
        }

        #endregion

        #region Private Fields

        readonly ContentBroker _contentBroker;

        #endregion
    }
}