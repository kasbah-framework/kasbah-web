using Microsoft.AspNet.Routing;

namespace Kasbah.Web
{
    public class KasbahWebContext
    {
        public IApplicationContext ApplicationContext { get; set; }
        public RouteContext RouteContext { get; set; }
    }
}