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
        private readonly List<int> _panchayatReceipts = new() { 68, 69, 70, 71, 72, 73, 74 };

        public DonationsController(DonationsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDonationsDto>>> GetDonations()
        {
            var donations = await _context.Users
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
                        ReceiptType = d.ReceiptType,
                        DonationType = d.DonationType,   
                        CreatedBy = d.CreatedBy,
                        CreatedOn = d.CreatedOn,
                        ModifiedBy = d.ModifiedBy,
                        ModifiedOn = d.ModifiedOn
                    }).ToList()
                }).ToListAsync();

            // 🧩 Now separate Panchayat type donations
            var panchayatDonations = donations
             .SelectMany(u => u.Donations.Select(d => new
             {
                 Donation = d,
                 User = u
             }))
             .Where(x => x.Donation.DonationType == "PANCHAYAT")
             .Select(x => new DonationDto
             {
                 DonationId = x.Donation.DonationId,
                 DonatedAmount = x.Donation.DonatedAmount,
                 ReceiptNo = x.Donation.ReceiptNo,
                 PayDate = x.Donation.PayDate,
                 PayMode = x.Donation.PayMode,
                 PaymentStatus = x.Donation.PaymentStatus,
                 TransactionNo = x.Donation.TransactionNo,
                 ReceiptType = x.Donation.ReceiptType,
                 DonationType = x.Donation.DonationType,
                 CreatedBy = x.Donation.CreatedBy,
                 CreatedOn = x.Donation.CreatedOn,
                 ModifiedBy = x.Donation.ModifiedBy,
                 ModifiedOn = x.Donation.ModifiedOn,

                 // ✅ Include user info from the joined object
                 UserId = x.User.UserId,
                 NameKn = x.User.NameKn,
                 NameEn = x.User.NameEn,
                 Place = x.User.Place,
                 ContactNo = x.User.ContactNo
             })
             .ToList();

            if (panchayatDonations.Any())
            {
                var total = panchayatDonations.Sum(d => d.DonatedAmount ?? 0);

                // Remove Panchayat donations from user-level donations
                foreach (var dto in donations)
                    dto.Donations.RemoveAll(d => d.DonationType == "PANCHAYAT");

                // Add virtual Panchayat record
                donations.Add(new UserDonationsDto
                {
                    UserId = 9999,
                    NameKn = "ಗ್ರಾಮ ಪಂಚಾಯತ್ ಸದಸ್ಯರು :2020-2025 ",
                    NameEn = "PANCHAYAT_CONTRIBUTION",
                    Place = "Yarehanchinal",
                    PledgeAmount = 0,
                    TotalDonatedAmount = total,
                    Donations = panchayatDonations
                });
            }

            return Ok(donations
                //.Where(d => d.TotalDonatedAmount > 0)
                .OrderByDescending(d => d.TotalDonatedAmount)
                .ToList());
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
                UserId = donationDto.UserId,
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
