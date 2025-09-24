using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPDPBWeb.Context;
using SPDPBWeb.Models;


namespace SPDSTApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonationsController : ControllerBase
    {
        private readonly DonationsContext _context;

        public DonationsController(DonationsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDonationsDto>>> GetDonations()
        {
            List<UserDonationsDto> donations = new List<UserDonationsDto>();
            try
            {
                  donations = await _context.Users
                            .GroupJoin(
                                _context.Donations,
                                user => user.UserId,
                                donation => donation.UserId,
                                (user, donations) => new { user, donations }
                            )
                            .Select(joined => new UserDonationsDto
                            {
                                UserId = joined.user.UserId,
                                NameEn = joined.user.NameEn,
                                NameKn = joined.user.NameKn,
                                Place = joined.user.Place,
                                ContactNo = joined.user.ContactNo,
                                PledgeAmount = joined.user.PledgeAmount,
                                TotalDonatedAmount = joined.donations
                                         .Where(d => d.PaymentStatus == true)
                                         .Sum(d => (int?)d.DonatedAmount) ?? 0,
                                Donations = joined.donations.Select(d => new DonationDto
                                {
                                    DonationId = d.DonationId,
                                    DonatedAmount = d.DonatedAmount,
                                    ReceiptNo = d.ReceiptNo,
                                    PayDate = d.PayDate,
                                    PayMode = d.PayMode,
                                    PaymentStatus = d.PaymentStatus,
                                    TransactionNo = d.TransactionNo,
                                    ReceiptType=d.ReceiptType,
                                    CreatedBy = d.CreatedBy,
                                    CreatedOn = d.CreatedOn,
                                    ModifiedBy = d.ModifiedBy,
                                    ModifiedOn = d.ModifiedOn
                                }).ToList()
                            }).OrderByDescending(d => d.TotalDonatedAmount)                            
                            .ToListAsync();
               
            }

            catch(Exception ex)
            {

            }
            return Ok(donations);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserDetails(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.UserId)
            {
                return BadRequest();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.NameKn = updatedUser.NameKn ?? ""; 
            user.NameEn = updatedUser.NameEn ?? "";
            user.Place = updatedUser.Place ?? "";
            user.ContactNo = updatedUser.ContactNo;
            user.PledgeAmount = updatedUser.PledgeAmount ?? 0;
            user.CreatedBy = "admin" ?? "";
            user.CreatedOn = DateTime.UtcNow;
            user.ModifiedBy = "admin";
            user.ModifiedOn = DateTime.UtcNow;
            user.UserType= updatedUser.UserType ?? "";
            user.Donations = [];

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(user);
        }

        // GET: api/donations/report
        [HttpGet("report")]
        public IActionResult GetDonorReport()
        {
            var query = from t1 in _context.Users
                        join t2 in _context.Donations on t1.UserId equals t2.UserId into donationsGroup
                        from t2 in donationsGroup.DefaultIfEmpty()
                        orderby t1.UserId
                        select new
                        {
                            UserId = t1.UserId,
                            NameKn = t1.NameKn,
                            NameEn = t1.NameEn,
                            Place = t1.Place,
                            ContactNo = t1.ContactNo,
                            PledgeAmount = t1.PledgeAmount,
                            UserType = t1.UserType,
                            DonatedAmount = t2.DonatedAmount,
                            ReceiptNo = t2.ReceiptNo,
                            PaymentStatus = t2.PaymentStatus,
                            ReceiptType = t2.ReceiptNo
                        };
            var result = query.ToList();
            return Ok(result);
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }

        [HttpPost]
        public async Task<ActionResult<Donation>> PostDonation(DonationDto donationDto)
        {
            var donation = new Donation
            {
                UserId = donationDto.User_Id,
                DonatedAmount = donationDto.DonatedAmount,
                ReceiptNo = donationDto.ReceiptNo,
                PayDate = DateTime.SpecifyKind((DateTime)donationDto.PayDate, DateTimeKind.Utc),
                PayMode = donationDto.PayMode,
                TransactionNo = donationDto.TransactionNo,
                CreatedBy = donationDto.CreatedBy,
                CreatedOn = DateTime.UtcNow,
                ModifiedBy = donationDto.ModifiedBy,
                ModifiedOn = DateTime.UtcNow
            };

            _context.Donations.Add(donation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDonations), new { id = donation.DonationId }, donation);
        }

        // POST: api/donations/adduser
        [HttpPost("adduser")]
        public IActionResult AddUser([FromBody] UserDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest("User data is null.");
            }

            var newUser = new User
            {
                NameKn = userDto.NameKn,
                NameEn = userDto.NameEn,
                Place = userDto.Place,
                ContactNo = userDto.ContactNo,
                PledgeAmount = userDto.PledgeAmount,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = userDto.CreatedBy,
                ModifiedBy = userDto.CreatedBy,
                ModifiedOn = DateTime.UtcNow
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok("User added successfully.");
        }

    }
}
