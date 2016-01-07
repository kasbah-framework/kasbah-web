using System;
using System.Collections.Generic;
using System.Linq;
using Kasbah.Core.Models;
using Kasbah.Web.Annotations;

namespace Kasbah.Web.Models
{
    public abstract class ContentBase : ItemBase
    {
        #region Public Properties

        [Editor("text")]
        public virtual string Action { get; set; }
        [Editor("text")]
        public virtual string Controller { get; set; }
        [Editor("text")]
        public virtual string View { get; set; }

        #endregion
    }

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

        public void Register<T>() where T : ContentBase
        {
            Register(typeof(T));
        }

        public void Register(Type type)
        {
            if (!_list.Contains(type))
            {
                _list.Add(type);

                #if !DNXCORE50
                var baseType = type.BaseType;
                while (baseType != null)
                {
                    if (!baseType.IsAbstract && baseType != typeof(object))
                    {
                        Register(baseType);
                    }
                    baseType = baseType.BaseType;
                }
                #endif
            }
        }

        #endregion

        #region Private Fields

        readonly ICollection<Type> _list;

        #endregion
    }
}
