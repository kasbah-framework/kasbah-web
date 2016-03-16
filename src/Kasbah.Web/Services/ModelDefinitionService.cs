using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Kasbah.Core;
using Kasbah.Core.ContentBroker.Models;
using Kasbah.Web.Annotations;
using Kasbah.Web.Models;
using Newtonsoft.Json.Serialization;

namespace Kasbah.Web.Services
{
    public class ModelDefinitionService
    {
        public ModelDefinition GetModelDefinition(Type type)
        {
            var nameResolver = new CamelCasePropertyNamesContractResolver();
            var typeInfo = type.GetTypeInfo();

            var isVersioned = typeInfo.IsSubclassOf(typeof(VersionedContentContainer<>));


            if (isVersioned)
            {
                type = typeInfo.GetGenericArguments().First();
                typeInfo = type.GetTypeInfo();
            }

            var name = typeInfo.GetAttributeValue<DisplayNameAttribute, string>(attr => attr?.DisplayName) ?? type.Name;

            var properties = type.GetRuntimeProperties();
            var allFields = properties
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

            var sections = allFields
                    .Select(ent => ent.Section)
                    .OrderBy(ent => ent?.SortOrder ?? int.MaxValue - 1)
                    .Select(ent => new ModelSection
                    {
                        DisplayName = ent.Section,
                        SortOrder = ent.SortOrder
                    })
                    .Distinct();

            var fields = allFields
                .OrderBy(ent => ent.Editor?.SortOrder ?? int.MaxValue)
                .Select(ent =>
                    new ModelField
                    {
                        Alias = ent.Alias,
                        DisplayName = ent.DisplayName?.DisplayName ?? ent.Name,
                        HelpText = ent.DisplayName?.HelpText,
                        Section = ent.Section?.Section ?? "General",
                        Type = ent.Type,
                        SortOrder = ent.Editor?.SortOrder ?? int.MaxValue
                    });

            return new ModelDefinition
            {
                Name = name,
                IsVersioned = isVersioned,
                Sections = sections,
                Fields = fields
            };
        }

        public ModelDefinition GetModelDefinition<T>()
            => GetModelDefinition(typeof(T));
    }

    public class ModelDefinition
    {
        public string Name { get; set; }
        public bool IsVersioned { get; set; }

        public IEnumerable<ModelSection> Sections { get; set; }

        public IEnumerable<ModelField> Fields { get; set; }
    }

    public class ModelSection
    {
        public string DisplayName { get; set; }

        public string Icon { get; set; }

        public int SortOrder { get; set; }

        public override bool Equals(object obj)
        {
            var a = this;
            var b = obj as ModelSection;

            return a.DisplayName.Equals(b.DisplayName);
        }

        public override int GetHashCode()
        {
            return DisplayName.GetHashCode();
        }
    }

    public class ModelField
    {
        public string Alias { get; set; }

        public string DisplayName { get; set; }

        public string HelpText { get; set; }

        public string Section { get; set; }

        public string Type { get; set; }

        public int SortOrder { get; set; }
    }
}
