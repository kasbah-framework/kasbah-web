using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Kasbah.Core;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.Models;
using Kasbah.Core.Utils;
using Kasbah.Web.Admin.Models;
using Kasbah.Web.Annotations;
using Kasbah.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Kasbah.Web.Admin.Controllers
{
    // [Authorize()]
    public class ContentController : Controller
    {
        #region Public Constructors

        public ContentController(IApplicationContext applicationContext, ILoggerFactory loggerFactory, ContentBroker contentBroker, ModelDefinitionService modelDefinitionService)
        {
            _applicationContext = applicationContext;
            _log = loggerFactory.CreateLogger<ContentController>();
            _contentBroker = contentBroker;
            _modelDefinitionService = modelDefinitionService;
        }

        #endregion

        #region Public Methods

        [Route("/api/types"), HttpGet]
        public GetTypesResponse GetTypes()
        {
            return new GetTypesResponse
            {
                Types = _applicationContext.ModelList.RegisteredModels.Select(ent => new Models.TypeInfo
                {
                    Id = ent.AssemblyQualifiedName,
                    DisplayName = ent.GetTypeInfo().GetAttributeValue<DisplayNameAttribute, string>(attr => attr?.DisplayName) ?? ent.Name
                })
            };
        }

        [Route("/api/sites"), HttpGet]
        public GetSitesResponse GetSites()
        {
            return new GetSitesResponse
            {
                Sites = _applicationContext.Sites.Select(site => new SiteInfo
                {
                    Alias = site.Alias,
                    DisplayName = site.DisplayName,
                    Domains = site.Domains.Select(dom => dom.Domain),
                    Id = _applicationContext.SiteNodeMap.ToDictionary(e => e.Value, e => e.Key)[site]
                })
            };
        }

        [Route("/api/content/{id}"), HttpGet]
        public GetContentResponse GetContent(Guid id)
        {
            var node = _contentBroker.GetNode(id);
            var type = TypeUtil.TypeFromName(node.Type);
            var data = default(object);

            var latestVersion = _contentBroker.GetAllNodeVersions(node.Id)
                    .OrderByDescending(version => version.Created)
                    .FirstOrDefault();

            if (latestVersion != null)
            {
                data = _contentBroker.GetNodeVersion(node.Id, latestVersion.Id);
            }
            var hierarchy = new List<Node>();
            var current = node.Parent;
            while (current.HasValue)
            {
                var parent = _contentBroker.GetNode(current.Value);
                hierarchy.Add(parent);
                current = parent.Parent;
            }

            return new GetContentResponse
            {
                Model = _modelDefinitionService.GetModelDefinition(type),
                Values = data,
                Node = node
            };
        }

        [Route("/api/content"), HttpPost]
        public SaveContentResponse SaveContent([FromBody] SaveContentRequest request)
        {
            var node = _contentBroker.GetNode(request.Node);
            var nodeVersions = _contentBroker.GetAllNodeVersions(request.Node);
            var latest = nodeVersions.OrderByDescending(ent => ent.Modified).FirstOrDefault();
            var versionId = default(Guid);

            if ((latest == null) || (latest.Id == node.ActiveVersion))
            {
                // new node with no versions
                // or latest is active version, create a new version
                versionId = Guid.NewGuid();
            }
            else
            {
                // latest is not active, update latest version
                versionId = latest.Id;
            }

            _contentBroker.SaveAnonymous(request.Node, versionId, request.Data);

            if (request.SetActive)
            {
                _contentBroker.SetActiveNodeVersion(request.Node, versionId);
            }

            return new SaveContentResponse { };
        }

        [Route("/api/modules"), AllowAnonymous]
        public IEnumerable<string> GetAdditionalModules()
        {
            return _applicationContext.AdditionalModules;
        }

        #endregion

        #region Private Fields

        readonly ContentBroker _contentBroker;
        readonly ILogger _log;
        readonly IApplicationContext _applicationContext;
        readonly ModelDefinitionService _modelDefinitionService;

        #endregion
    }
}