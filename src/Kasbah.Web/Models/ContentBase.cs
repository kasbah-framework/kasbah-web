using System;
using System.Collections.Generic;
using System.Linq;
using Kasbah.Core.Models;

namespace Kasbah.Web.Models
{
    public abstract class ContentBase : ItemBase
    {
        public string View { get; } = nameof(ContentBase);
    }

    public class ModelList
    {
        readonly ICollection<Type> _list;

        public ModelList()
        {
            _list = new List<Type>();
        }

        public IEnumerable<Type> RegisteredModels { get { return _list.AsEnumerable(); } }

        public void Register<T>() where T : ContentBase
        {
            Register(typeof(T));
        }

        public void Register(Type type)
        {
            if (!_list.Contains(type))
            {
                _list.Add(type);
            }
        }
    }
}