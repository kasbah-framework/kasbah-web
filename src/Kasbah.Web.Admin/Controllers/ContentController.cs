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
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;

namespace Kasbah.Web.Admin.Controllers
{
    [Authorize()]
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

        [Route("/api/controllers")]
        public GetControllersResponse GetControllers()
        {
            const string ControllerNameSuffix = "Controller";
#if DNXCORE50
            var types = Assembly.GetEntryAssembly().GetTypes();
#else
            var types = AppDomain.CurrentDomain.GetAssemblies().SelectMany(asm => asm.GetTypes());
#endif
            return new GetControllersResponse
            {
                Controllers = types
                    .Where(typ => typ.Name.EndsWith(ControllerNameSuffix) && typ.Name != ControllerNameSuffix)
                    .Select(typ => new ControllerInfo
                    {
                        Alias = typ.Name.Substring(0, typ.Name.Length - ControllerNameSuffix.Length),
                        DisplayName = typ.Name.Substring(0, typ.Name.Length - ControllerNameSuffix.Length),
                        Actions = typ.GetMethods()
                            .Where(meth => meth.IsPublic && meth.DeclaringType == typ && !meth.IsSpecialName && !meth.IsStatic)
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
                ModelDefinition = GetModelDefinition(type),
                Data = data,
                Node = node,
                Hierarchy = hierarchy
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

            var editableFields = type.GetRuntimeProperties()
                .Select(ent => new {
                    Alias = nameResolver.GetResolvedPropertyName(ent.Name),
                    Field = ent,
                    Type = ent.GetAttributeValue<EditorAttribute, string>(attr => attr?.Editor),
                    Section = ent.GetAttributeValue<SectionAttribute, SectionAttribute>(attr => attr),
                    Editor = ent.GetAttributeValue<EditorAttribute, EditorAttribute>(attr => attr),
                    DisplayName = ent.GetAttributeValue<DisplayNameAttribute, DisplayNameAttribute>(attr => attr),
                    Name = ent.Name
                })
                .Where(ent => ent.Type != null);

            return new ModelDefinition
            {
                Sections = editableFields
                    .Select(ent => ent.Section)
                    .OrderBy(ent => ent?.SortOrder ?? int.MaxValue - 1)
                    .Select(ent => ent?.Section ?? "General")
                    .Distinct(),
                Fields = editableFields
                    .OrderBy(ent => ent.Editor?.SortOrder ?? int.MaxValue)
                    .Select(prop =>
                    {
                        return new FieldDef
                        {
                            Alias = prop.Alias,
                            DisplayName = prop.DisplayName?.DisplayName ?? prop.Name,
                            HelpText = prop.DisplayName?.HelpText,
                            Section = prop.Section?.Section ?? "General",
                            Type = prop.Type
                        };
                    })
            };
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

        #endregion
    }
}