using System;
using System.Collections.Generic;
using Kasbah.Core;
using Kasbah.Core.ContentTree.Models;
using Kasbah.Core.Models;
using Microsoft.AspNet.Mvc;

namespace Kasbah.Web.Admin
{
    public class CreateNodeRequest
    {
        #region Public Properties

        public string Alias { get; set; }
        public Guid? Parent { get; set; }
        public string Type { get; set; }

        #endregion
    }

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
            return _contentBroker.Save<ItemBase>(Guid.NewGuid(), id, null);
        }

        [Route("api/children")]
        public IEnumerable<Node> GetChildren(Guid? id = null)
        {
            return _contentBroker.GetChildren(id);
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
            _contentBroker.Save(version, node, (object)values);
        }

        [HttpPost, Route("api/node/{id}/set-active/{version}")]
        public void SetActiveVersion(Guid id, Guid version)
        {
            _contentBroker.SetActiveNodeVersion(id, version);
        }

        #endregion

        #region Private Fields

        readonly ContentBroker _contentBroker;

        #endregion
    }
}