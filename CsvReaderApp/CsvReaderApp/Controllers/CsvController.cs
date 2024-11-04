using CsvApi.Models;
using CsvHelper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CsvApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CsvController : ControllerBase
    {
        [HttpPost("upload")]
        public async Task<IActionResult> UploadCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var records = new List<CsvRecord>();

            using (var stream = new StreamReader(file.OpenReadStream()))
            using (var csv = new CsvReader(stream, CultureInfo.InvariantCulture))
            {
                //csv.Configuration.BadDataFound = null; // Ignore bad data
                records.AddRange(csv.GetRecords<CsvRecord>());
            }

            var groupedRecords = records
                .GroupBy(record => record.Category)
                .Select(group => new GroupedCsvRecord
                {
                    Category = group.Key,
                    Names = group.Select(record => record.Name).ToList()
                })
                .ToList();

            return Ok(groupedRecords); // Returns grouped data to the frontend
        }
    }

    public class GroupedCsvRecord
    {
        public string Category { get; set; }
        public List<string> Names { get; set; }
    }
}
