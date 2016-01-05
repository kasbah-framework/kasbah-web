using System;
using System.Linq;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.Utils;
using Kasbah.Web.Annotations;
using Kasbah.Web.Admin.Models;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Reflection;

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
                    DisplayName = ent.Name
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

            _contentBroker.Save(request.Node, versionId, request.Data);

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
            return new ModelDefinition
            {
                Fields = GetAllProperties(type).Select(prop =>
                {
                    return new FieldDef
                    {
                        Alias = prop.Name,
                        DisplayName = prop.Name,
                        Type = GetAttributeValue<EditorAttribute, string>(prop, attr => attr?.Editor)
                    };
                }).Where(ent => ent.Type != null)
            };
        }

        // TODO: figure out why these methods can't be found from Kasbah.Core
        static IEnumerable<PropertyInfo> GetAllProperties(Type type)
        {
            if (type == null) { return Enumerable.Empty<PropertyInfo>(); }

            var info = type.GetTypeInfo();

            return info.DeclaredProperties.Concat(GetAllProperties(info.BaseType));
        }

        public static TRet GetAttributeValue<TAttr, TRet>(MemberInfo info, Func<TAttr, TRet> selector)
            where TAttr : Attribute
        {
            var attribute = info.GetCustomAttribute<TAttr>();

            return selector(attribute);
        }

        #endregion

        #region Private Fields

        readonly ContentBroker _contentBroker;
        readonly ILogger _log;
        readonly IApplicationContext _applicationContext;

        #endregion
    }
}
