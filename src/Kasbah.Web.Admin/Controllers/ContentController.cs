using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kasbah.Core.ContentTree;
using Kasbah.Core.Utils;
using Kasbah.Identity.Models;
using Kasbah.Web.Admin.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using System.Reflection;

namespace Kasbah.Web.Admin.Controllers
{
    public class ContentController : Controller
    {
        #region Public Constructors

        public ContentController(ILoggerFactory loggerFactory, ContentTreeService contentTreeService)
        {
            _log = loggerFactory.CreateLogger<ContentController>();
            _contentTreeService = contentTreeService;
        }

        #endregion

        #region Public Methods

        [Route("/api/content/{id}"), HttpGet, HttpPost]
        public GetContentResponse GetContent(Guid id)
        {
            var node = _contentTreeService.GetNode(id);
            var type = TypeUtil.TypeFromName(node.Type);

            return new GetContentResponse
            {
                ModelDefinition = GetModelDefinition(type),
                Versions = _contentTreeService.GetAllNodeVersions(node.Id).Select(version =>
                {
                    return new Version
                    {
                        Id = version.Id,
                        Values = _contentTreeService.GetNodeVersion(node.Id, version.Id)
                    };
                })
            };
        }

        #endregion

        static ModelDefinition GetModelDefinition(Type type)
        {
            
            return new ModelDefinition
            {
                Fields = type.GetProperties().Select(prop =>
                {
                    return new FieldDef
                    {
                        Alias = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver().GetResolvedPropertyName(prop.Name),
                        DisplayName = prop.Name,
                        Type = "text"
                    };
                })
            };
        }

        #region Private Fields

        readonly ILogger _log;
        readonly ContentTreeService _contentTreeService;

        #endregion
    }

    public class GetContentResponse : BaseApiResponse
    {
        public ModelDefinition ModelDefinition { get; set; }

        public IEnumerable<Version> Versions { get; set; }
    }

    public class ModelDefinition
    {
        public IEnumerable<FieldDef> Fields { get; set; }
    }

    public class FieldDef
    {
        public string Alias { get; set; }

        public string DisplayName { get; set; }

        public string Type { get; set; }
    }

    public class Version
    {
        public Guid Id { get; set; }

        public IDictionary<string, object> Values { get; set; }
    }
}
