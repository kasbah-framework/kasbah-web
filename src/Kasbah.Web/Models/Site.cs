using System.Collections.Generic;
using Kasbah.Core.Models;

namespace Kasbah.Web.Models
{
    public class Site : ItemBase
    {
        public string Alias { get; set; }

        public IEnumerable<string> Domains { get; set; }
    }
}