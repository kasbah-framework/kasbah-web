using System;
using System.Collections.Generic;
using System.Linq;
using Kasbah.Core;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.Utils;
using Kasbah.Web.Admin.Models;
using Kasbah.Web.Annotations;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;

namespace Kasbah.Web.Admin.Controllers
{
    public class ContentController : Controller
    {
        #region Public Constructors

        public ContentController(IApplicationContext applicationContext, ILoggerFactory loggerFactory, ContentBroker contentBroker)
        {
            _applicationContext = applicationContext;
            _log = loggerFactory.CreateLogger<ContentController>();
            _contentBroker = contentBroker;
        }

        #endregion

        #region Public Methods

        [Route("/api/types"), HttpGet]
        public GetTypesResponse GetTypes()
        {
            return new GetTypesResponse
            {
                Types = _applicationContext.ModelList.RegisteredModels.Select(ent => new TypeInfo
                {
                    Id = ent.AssemblyQualifiedName,
                    DisplayName = ent.GetAttributeValue<DisplayNameAttribute, string>(attr => attr?.DisplayName) ?? ent.Name
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
                    DisplayName = site.Alias,
                    Domains = site.Domains.Select(dom => dom.Domain)
                })
            };
        }

        [RouteAttribute("/api/controllers")]
        public GetControllersResponse GetControllers()
        {
            const string ControllerNameSuffix = "Controller";
            return new GetControllersResponse
            {
                Controllers = AppDomain.CurrentDomain.GetAssemblies()
                    .SelectMany(asm => asm.GetTypes())
                    .Where(typ => typ.Name.EndsWith(ControllerNameSuffix))
                    .Select(typ => new ControllerInfo
                    {
                        Alias = typ.Name.Substring(0, typ.Name.Length - ControllerNameSuffix.Length),
                        DisplayName = typ.Name.Substring(0, typ.Name.Length - ControllerNameSuffix.Length),
                        Actions = typ.GetMethods()
                            .Where(meth => meth.IsPublic)
                            .Select(meth => meth.Name)
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

            return new GetContentResponse
            {
                ModelDefinition = GetModelDefinition(type),
                Data = data
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

        #endregion

        #region Private Methods

        static ModelDefinition GetModelDefinition(Type type)
        {
            var nameResolver = new CamelCasePropertyNamesContractResolver();

            return new ModelDefinition
            {
                Sections = type.GetAllProperties()
                    .Select(prop => prop.GetAttributeValue<SectionAttribute, SectionAttribute>(attr => attr))
                    .OrderBy(ent => ent?.SortOrder ?? 0)
                    .Select(ent => ent?.Section ?? "General")
                    .Distinct(),
                Fields = type.GetAllProperties()
                    .OrderBy(ent => ent.GetAttributeValue<EditorAttribute, int>(attr => attr?.SortOrder ?? 0))
                    .Select(prop =>
                    {
                        return new FieldDef
                        {
                            Alias = nameResolver.GetResolvedPropertyName(prop.Name),
                            DisplayName = prop.GetAttributeValue<DisplayNameAttribute, string>(attr => attr?.DisplayName) ?? prop.Name,
                            HelpText = prop.GetAttributeValue<DisplayNameAttribute, string>(attr => attr?.HelpText),
                            Section = prop.GetAttributeValue<SectionAttribute, string>(attr => attr?.Section) ?? "General",
                            Type = prop.GetAttributeValue<EditorAttribute, string>(attr => attr?.Editor)
                        };
                    })
                    .Where(ent => ent.Type != null)
            };
        }

        #endregion

        #region Private Fields

        readonly ContentBroker _contentBroker;
        readonly ILogger _log;
        readonly IApplicationContext _applicationContext;

        #endregion
    }
}
