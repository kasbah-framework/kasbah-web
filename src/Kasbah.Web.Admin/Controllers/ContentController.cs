using System;
using System.Collections.Generic;
using System.Linq;
using Kasbah.Core;
using Kasbah.Core.Utils;
using Kasbah.Web.Admin.Models;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using System.Reflection;
using Kasbah.Web.Annotations;

namespace Kasbah.Web.Admin.Controllers
{
    public class ContentController : Controller
    {
        #region Public Constructors

        public ContentController(ILoggerFactory loggerFactory, ContentBroker contentBroker)
        {
            _log = loggerFactory.CreateLogger<ContentController>();
            _contentBroker = contentBroker;
        }

        #endregion

        #region Public Methods

        [Route("/api/content/{id}"), HttpGet, HttpPost]
        public GetContentResponse GetContent(Guid id)
        {
            var node = _contentBroker.GetNode(id);
            var type = TypeUtil.TypeFromName(node.Type);

            return new GetContentResponse
            {
                ModelDefinition = GetModelDefinition(type),
                Versions = _contentBroker.GetAllNodeVersions(node.Id).Select(version =>
                {
                    return new Version
                    {
                        Id = version.Id,
                        NodeId = node.Id,
                        IsActive = version.Id == node.ActiveVersion,
                        Values = _contentBroker.GetNodeVersion(node.Id, version.Id)
                    };
                })
            };
        }

        [Route("/api/content"), HttpPost]
        public SaveContentResponse SaveContent([FromBody] SaveContentRequest request)
        {
            _contentBroker.Save(request.Version.Id ?? Guid.NewGuid(), request.Version.NodeId, (object)request.Version.Values);

            return new SaveContentResponse { };
        }

        [Route("/api/content/set-active"), HttpPost]

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
                        Alias = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver().GetResolvedPropertyName(prop.Name),
                        DisplayName = prop.Name,
                        Type = GetEditor(prop)
                    };
                })
            };
        }

        static IEnumerable<PropertyInfo> GetAllProperties(Type type)
        {
            if (type == null) { return Enumerable.Empty<PropertyInfo>(); }

            var info = type.GetTypeInfo();

            return info.DeclaredProperties.Concat(GetAllProperties(info.BaseType));

        }

        static string GetEditor(PropertyInfo property)
        {
            var attribute = property.GetCustomAttribute<EditorAttribute>();
            if (attribute != null)
            {
                return attribute.Editor;
            }
            return "text";
        }

        #endregion

        #region Private Fields

        readonly ContentBroker _contentBroker;
        readonly ILogger _log;

        #endregion
    }

    public class FieldDef
    {
        #region Public Properties

        public string Alias { get; set; }

        public string DisplayName { get; set; }

        public string Type { get; set; }

        #endregion
    }

    public class GetContentResponse : BaseApiResponse
    {
        #region Public Properties

        public ModelDefinition ModelDefinition { get; set; }

        public IEnumerable<Version> Versions { get; set; }

        #endregion
    }

    public class ModelDefinition
    {
        #region Public Properties

        public IEnumerable<FieldDef> Fields { get; set; }

        #endregion
    }

    public class Version
    {
        #region Public Properties

        public Guid? Id { get; set; }

        public Guid NodeId { get; set; }

        public bool IsActive { get; set; }

        public IDictionary<string, object> Values { get; set; }

        #endregion
    }

    public class SaveContentRequest
    {
        public Version Version { get; set; }
    }

    public class SaveContentResponse : BaseApiResponse
    {
    }
}