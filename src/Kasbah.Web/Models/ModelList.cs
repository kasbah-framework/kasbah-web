using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Kasbah.Core.ContentBroker.Models;
using Kasbah.Core.Utils;

namespace Kasbah.Web.Models
{
    public class ModelList
    {
        #region Public Constructors

        public ModelList()
        {
            _list = new List<Type>();
        }

        #endregion

        #region Public Properties

        public IEnumerable<Type> RegisteredModels { get { return _list.AsEnumerable(); } }

        #endregion

        #region Public Methods

        public void Register<T>() where T : ItemBase
        {
            Register(typeof(T));
        }

        public void Register(Type type)
        {
            if (!_list.Contains(type))
            {
                TypeUtil.Register(type);

                _list.Add(type);

                var baseType = type.GetTypeInfo().BaseType;
                while (baseType != null)
                {
                    if (!baseType.GetTypeInfo().IsAbstract && baseType != typeof(object))
                    {
                        Register(baseType);
                    }
                    baseType = baseType.GetTypeInfo().BaseType;
                }
            }
        }

        #endregion

        #region Private Fields

        readonly ICollection<Type> _list;

        #endregion
    }
}