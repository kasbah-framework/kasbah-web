using Kasbah.Web.Models;

namespace Kasbah.Web
{
    public interface IApplicationContext
    {
        ModelList ModelList { get; }
    }
}