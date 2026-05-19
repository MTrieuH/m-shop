using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MShop.API.Middleware
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class StaffOnlyAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Vui lòng đăng nhập." });
                return;
            }

            var role = user.FindFirstValue(ClaimTypes.Role);
            if (role != "Admin" && role != "Warehouse")
            {
                context.Result = new ObjectResult(new { message = "Bạn không có quyền truy cập." })
                {
                    StatusCode = 403
                };
            }
        }
    }
}
