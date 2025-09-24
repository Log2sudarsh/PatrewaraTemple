using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPDPBWeb.Context;
using SPDPBWeb.DTOs;
using SPDPBWeb.Models.Bilva;

namespace SPDPBWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BilvaUserController : ControllerBase
    {
        private readonly BilvaDbContext _context;

        public BilvaUserController(BilvaDbContext context)
        {
            _context = context;
        }

        // GET all users with plants
        [HttpGet("all")]

        public async Task<IActionResult> GetAll()
        {
            var users = await _context.BilvaUsers
                .Include(u => u.UserPlants)
                .ToListAsync();

            var result = users.Select(u => new
            {
                u.UserId,
                u.FirstName,
                u.LastName,
                u.Gender,
                u.ContactNumber,
                u.Place,
                u.Address,
                u.Designation,
                u.Institution,
                // Assuming 1 user has only 1 UserPlants entry
                PlantsNeeded = u.UserPlants.FirstOrDefault()?.PlantsNeeded ?? 0,
                Variety = u.UserPlants.FirstOrDefault()?.Variety ?? "",
                DeliveryStatus = u.UserPlants.FirstOrDefault()?.DeliveryStatus ?? ""
            });

            return Ok(result);
        }

        public async Task<IActionResult> GetAllUsersWithPlants()
        {
            var users = await _context.BilvaUsers
                .Include(u => u.UserPlants)
                .ToListAsync();

            return Ok(users);
        }

        // GET single user with plants
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserWithPlant(int id)
        {
            var user = await _context.BilvaUsers
                .Include(u => u.UserPlants)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null) return NotFound();

            return Ok(user);
        }

        // POST: Add user + one plant together
        [HttpPost("adduser")]
        public async Task<IActionResult> CreateUserWithPlant([FromBody] UserWithPlantDto dto)
        {
            var user = new BilvaUser
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Gender = dto.Gender,
                ContactNumber = dto.ContactNumber,
                Place = dto.Place,
                Address = dto.Address,
                Designation = dto.Designation,
                Institution = dto.Institution,
                UserPlants = new List<UserPlant>
            {
                new UserPlant
                {
                    PlantsNeeded = dto.PlantsNeeded,
                    Variety = dto.Variety,
                    DeliveryStatus = dto.DeliveryStatus
                }
            }
            };

            _context.BilvaUsers.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserWithPlant), new { id = user.UserId }, user);
        }

        // PUT: Update both user + plant
        [HttpPut("updateuser/{id}")]
        public async Task<IActionResult> UpdateUserWithPlant(int id, [FromBody] UserWithPlantDto dto)
        {
            var user = await _context.BilvaUsers
                .Include(u => u.UserPlants)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null) return NotFound();

            // Update user info
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Gender = dto.Gender;
            user.ContactNumber = dto.ContactNumber;
            user.Place = dto.Place;
            user.Address = dto.Address;
            user.Designation = dto.Designation;
            user.Institution = dto.Institution;

            // Update first plant info (assumes 1 plant per user for now)
            var plant = user.UserPlants.FirstOrDefault();
            if (plant != null)
            {
                plant.PlantsNeeded = dto.PlantsNeeded;
                plant.Variety = dto.Variety;
                plant.DeliveryStatus = dto.DeliveryStatus;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: Remove user and cascade delete plants
        [HttpDelete("deleteuser/{id}")]
        public async Task<IActionResult> DeleteUserWithPlant(int id)
        {
            var user = await _context.BilvaUsers.FindAsync(id);
            if (user == null) return NotFound();

            _context.BilvaUsers.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
