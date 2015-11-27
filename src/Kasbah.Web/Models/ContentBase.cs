using System;
using System.Collections.Generic;
using System.Linq;
using Kasbah.Core.Models;

namespace Kasbah.Web.Models
{
    public abstract class ContentBase : ItemBase
    {
        #region Public Properties

        public string View { get; } = nameof(ContentBase);

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
            }
        }

        #endregion

        #region Private Fields

        readonly ICollection<Type> _list;

        #endregion
    }
}