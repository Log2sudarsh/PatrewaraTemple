using Microsoft.AspNetCore.Mvc;
using SPDPBWeb.Context;
using SPDPBWeb.Models;


namespace SPDPBWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly DonationsContext _context;

        public UserController(DonationsContext context)
        {
            _context = context;

        }

        [HttpPost]
        [Route("api/users")]
        public IActionResult AddUser([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("User is null.");
            }

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(user);
        }
    }
}
